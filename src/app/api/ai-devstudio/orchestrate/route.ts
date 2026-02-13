/* ═══════════════════════════════════════════════════════════
   GiuseCoder — SSE Orchestration Endpoint
   Streams pipeline progress events back to the client.
   ═══════════════════════════════════════════════════════════ */

import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { ROUTING_TABLE } from "@/lib/ai-devstudio/routing";
import { TRIAGE_PROMPT, buildAgentPrompt, buildUserMessage } from "@/lib/ai-devstudio/prompts";
import type {
  TaskType,
  AgentId,
  StepRole,
  PipelineStep,
  OrchestrateRequest,
  UserSettings,
} from "@/lib/ai-devstudio/types";

export const runtime = "nodejs";
export const maxDuration = 120;

/* ── helpers ── */

function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

async function callAnthropic(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string,
  onToken: (t: string) => void
): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  const client = new Anthropic({ apiKey });
  const stream = client.messages.stream({
    model,
    max_tokens: 16384,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  let content = "";
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      content += event.delta.text;
      onToken(event.delta.text);
    }
  }

  const final = await stream.finalMessage();
  return {
    content,
    inputTokens: final.usage.input_tokens,
    outputTokens: final.usage.output_tokens,
  };
}

async function callOpenAI(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string,
  reasoningEffort: string,
  onToken: (t: string) => void
): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  const client = new OpenAI({ apiKey });

  const stream = await client.chat.completions.create({
    model,
    messages: [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userMessage },
    ],
    max_tokens: 16384,
    stream: true,
    stream_options: { include_usage: true },
  });

  let content = "";
  let inputTokens = 0;
  let outputTokens = 0;

  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content || "";
    if (delta) {
      content += delta;
      onToken(delta);
    }
    if (chunk.usage) {
      inputTokens = chunk.usage.prompt_tokens || 0;
      outputTokens = chunk.usage.completion_tokens || 0;
    }
  }

  return { content, inputTokens, outputTokens };
}

async function callAgent(
  agent: AgentId,
  role: StepRole,
  userMessage: string,
  context: string,
  settings: UserSettings,
  planOutput: string | undefined,
  previousOutputs: { agent: string; content: string }[],
  onToken: (t: string) => void
): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  const systemPrompt = buildAgentPrompt(agent, role, planOutput);
  const msg = buildUserMessage(agent, role, userMessage, context, planOutput, previousOutputs);

  if (agent === "codex") {
    return callOpenAI(
      settings.openaiApiKey,
      settings.models.codex,
      systemPrompt,
      msg,
      settings.codexReasoningEffort,
      onToken
    );
  }

  const modelMap: Record<string, string> = {
    opus: settings.models.opus,
    sonnet: settings.models.sonnet,
    haiku: settings.models.haiku,
  };

  return callAnthropic(
    settings.anthropicApiKey,
    modelMap[agent] || settings.models.sonnet,
    systemPrompt,
    msg,
    onToken
  );
}

/* ── main handler ── */

export async function POST(req: NextRequest) {
  const body: OrchestrateRequest = await req.json();
  const { message, context, settings } = body;

  const encoder = new TextEncoder();
  let controllerRef: ReadableStreamDefaultController | null = null;

  function send(event: string, data: unknown) {
    controllerRef?.enqueue(encoder.encode(sseEvent(event, data)));
  }

  const stream = new ReadableStream({
    async start(controller) {
      controllerRef = controller;
      const t0 = Date.now();

      try {
        /* ─── STEP 1: TRIAGE ─── */
        send("triage_start", {});
        const triageT0 = Date.now();
        let taskType: TaskType = "complex_feature";

        try {
          const triageResult = await callAnthropic(
            settings.anthropicApiKey,
            settings.models.haiku,
            TRIAGE_PROMPT,
            `${message}\n\nContext: ${context}`,
            () => {} // no token streaming for triage
          );
          const cleaned = triageResult.content.trim().toLowerCase().replace(/[^a-z_]/g, "");
          if (cleaned in ROUTING_TABLE) {
            taskType = cleaned as TaskType;
          }
          send("triage_done", {
            taskType,
            latencyMs: Date.now() - triageT0,
            tokens: triageResult.inputTokens + triageResult.outputTokens,
          });
        } catch (e: unknown) {
          const errMsg = e instanceof Error ? e.message : String(e);
          send("triage_done", {
            taskType,
            latencyMs: Date.now() - triageT0,
            error: errMsg,
            fallback: true,
          });
        }

        /* ─── STEP 2: ROUTE ─── */
        const pipeline = ROUTING_TABLE[taskType];
        send("pipeline", {
          taskType,
          description: pipeline.description,
          steps: pipeline.steps.map((s) => ({
            agent: s.agent,
            role: s.role,
            parallel: s.parallel,
          })),
          estimatedTime: pipeline.estimatedTime,
          estimatedCost: pipeline.estimatedCost,
        });

        /* ─── STEP 3: EXECUTE ─── */
        let planOutput: string | undefined;
        const allOutputs: { agent: string; content: string }[] = [];
        let totalInputTokens = 0;
        let totalOutputTokens = 0;

        // Group steps: sequential and parallel groups
        const stepGroups: PipelineStep[][] = [];
        let i = 0;
        while (i < pipeline.steps.length) {
          const step = pipeline.steps[i];
          if (step.parallel) {
            const group: PipelineStep[] = [];
            const groupId = step.parallel;
            while (i < pipeline.steps.length && pipeline.steps[i].parallel === groupId) {
              group.push(pipeline.steps[i]);
              i++;
            }
            stepGroups.push(group);
          } else {
            stepGroups.push([step]);
            i++;
          }
        }

        for (const group of stepGroups) {
          if (group.length === 1) {
            // Sequential step
            const step = group[0];
            send("step_start", { agent: step.agent, role: step.role, parallel: false });
            const stepT0 = Date.now();

            try {
              const result = await callAgent(
                step.agent,
                step.role,
                message,
                context,
                settings,
                planOutput,
                allOutputs,
                (token) => send("token", { agent: step.agent, text: token })
              );

              const latencyMs = Date.now() - stepT0;
              totalInputTokens += result.inputTokens;
              totalOutputTokens += result.outputTokens;
              allOutputs.push({ agent: step.agent, content: result.content });

              if (step.agent === "opus" && step.role !== "review") {
                planOutput = result.content;
              }

              send("step_done", {
                agent: step.agent,
                role: step.role,
                latencyMs,
                inputTokens: result.inputTokens,
                outputTokens: result.outputTokens,
              });

              // If this is a review step, parse and send review result
              if (step.role === "review") {
                send("review", parseReview(result.content));
              }
            } catch (e: unknown) {
              const errMsg = e instanceof Error ? e.message : String(e);
              send("step_error", { agent: step.agent, role: step.role, error: errMsg });
            }
          } else {
            // Parallel steps
            for (const step of group) {
              send("step_start", { agent: step.agent, role: step.role, parallel: true });
            }

            const results = await Promise.allSettled(
              group.map(async (step) => {
                const stepT0 = Date.now();
                const result = await callAgent(
                  step.agent,
                  step.role,
                  message,
                  context,
                  settings,
                  planOutput,
                  allOutputs,
                  (token) => send("token", { agent: step.agent, text: token })
                );
                return { step, result, latencyMs: Date.now() - stepT0 };
              })
            );

            for (const r of results) {
              if (r.status === "fulfilled") {
                const { step, result, latencyMs } = r.value;
                totalInputTokens += result.inputTokens;
                totalOutputTokens += result.outputTokens;
                allOutputs.push({ agent: step.agent, content: result.content });
                send("step_done", {
                  agent: step.agent,
                  role: step.role,
                  latencyMs,
                  inputTokens: result.inputTokens,
                  outputTokens: result.outputTokens,
                });
              } else {
                const step = group[results.indexOf(r)];
                send("step_error", {
                  agent: step.agent,
                  role: step.role,
                  error: r.reason?.message || String(r.reason),
                });
              }
            }
          }
        }

        /* ─── STEP 4: DONE ─── */
        send("done", {
          totalLatencyMs: Date.now() - t0,
          totalInputTokens,
          totalOutputTokens,
          totalTokens: totalInputTokens + totalOutputTokens,
        });
      } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        send("error", { message: errMsg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/* ── review parser ── */

function parseReview(content: string): {
  verdict: string;
  score: number;
  summary: string;
  issues: { severity: string; agent: string; location: string; problem: string; fix: string }[];
} {
  const verdict = content.match(/<verdict>([\s\S]*?)<\/verdict>/)?.[1]?.trim() || "APPROVED";
  const scoreStr = content.match(/<score>([\s\S]*?)<\/score>/)?.[1]?.trim() || "8";
  const summary = content.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim() || "";

  const issues: { severity: string; agent: string; location: string; problem: string; fix: string }[] = [];
  const issueRegex = /<issue\s+severity="([^"]*?)"\s+agent="([^"]*?)">([\s\S]*?)<\/issue>/g;
  let m: RegExpExecArray | null;
  while ((m = issueRegex.exec(content)) !== null) {
    const body = m[3];
    issues.push({
      severity: m[1],
      agent: m[2],
      location: body.match(/<location>([\s\S]*?)<\/location>/)?.[1]?.trim() || "",
      problem: body.match(/<problem>([\s\S]*?)<\/problem>/)?.[1]?.trim() || "",
      fix: body.match(/<fix>([\s\S]*?)<\/fix>/)?.[1]?.trim() || "",
    });
  }

  return { verdict, score: parseInt(scoreStr, 10) || 8, summary, issues };
}
