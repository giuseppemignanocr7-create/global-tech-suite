/* ═══════════════════════════════════════════════════════════
   GiuseCoder — SSE Orchestration Endpoint
   Pipeline: Opus thinks → Sonnet designs + GPT codes → Opus reviews
   ═══════════════════════════════════════════════════════════ */

import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { buildAgentPrompt, buildUserMessage } from "@/lib/ai-devstudio/prompts";
import type {
  AgentId,
  StepRole,
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

function callAgent(
  agent: AgentId,
  role: StepRole,
  userMessage: string,
  context: string,
  settings: UserSettings,
  planOutput: string | undefined,
  previousOutputs: { agent: string; content: string }[],
  onToken: (t: string) => void
): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  const systemPrompt = buildAgentPrompt(agent, role);
  const msg = buildUserMessage(agent, role, userMessage, context, planOutput, previousOutputs);

  if (agent === "codex") {
    if (!settings.openaiApiKey) {
      // Fallback: use Anthropic Sonnet for code too if no OpenAI key
      return callAnthropic(settings.anthropicApiKey, settings.models.sonnet, systemPrompt, msg, onToken);
    }
    return callOpenAI(settings.openaiApiKey, settings.models.codex, systemPrompt, msg, onToken);
  }

  const modelMap: Record<string, string> = {
    opus: settings.models.opus,
    sonnet: settings.models.sonnet,
  };

  return callAnthropic(settings.anthropicApiKey, modelMap[agent] || settings.models.sonnet, systemPrompt, msg, onToken);
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
        /* ─── Send pipeline structure ─── */
        send("pipeline", {
          taskType: "standard",
          description: "Opus pensa → Sonnet design + GPT code → Opus review",
          steps: [
            { agent: "opus", role: "thinking" },
            { agent: "sonnet", role: "design", parallel: "build" },
            { agent: "codex", role: "code", parallel: "build" },
            { agent: "opus", role: "review" },
          ],
        });

        let planOutput: string | undefined;
        const allOutputs: { agent: string; content: string }[] = [];
        let totalInputTokens = 0;
        let totalOutputTokens = 0;

        /* ─── STEP 1: OPUS THINKS ─── */
        send("step_start", { agent: "opus", role: "thinking" });
        const thinkT0 = Date.now();

        try {
          const thinkResult = await callAgent(
            "opus", "thinking", message, context, settings,
            undefined, [],
            (token) => send("token", { agent: "opus", text: token })
          );

          planOutput = thinkResult.content;
          totalInputTokens += thinkResult.inputTokens;
          totalOutputTokens += thinkResult.outputTokens;
          allOutputs.push({ agent: "opus", content: thinkResult.content });

          send("step_done", {
            agent: "opus", role: "thinking",
            latencyMs: Date.now() - thinkT0,
            inputTokens: thinkResult.inputTokens,
            outputTokens: thinkResult.outputTokens,
          });
        } catch (e: unknown) {
          send("step_error", { agent: "opus", role: "thinking", error: (e as Error).message });
          controller.close();
          return;
        }

        /* ─── STEP 2: SONNET + GPT IN PARALLEL ─── */
        send("step_start", { agent: "sonnet", role: "design", parallel: true });
        send("step_start", { agent: "codex", role: "code", parallel: true });

        const [sonnetResult, codexResult] = await Promise.allSettled([
          (async () => {
            const st0 = Date.now();
            const r = await callAgent(
              "sonnet", "design", message, context, settings,
              planOutput, allOutputs,
              (token) => send("token", { agent: "sonnet", text: token })
            );
            return { ...r, latencyMs: Date.now() - st0 };
          })(),
          (async () => {
            const ct0 = Date.now();
            const r = await callAgent(
              "codex", "code", message, context, settings,
              planOutput, allOutputs,
              (token) => send("token", { agent: "codex", text: token })
            );
            return { ...r, latencyMs: Date.now() - ct0 };
          })(),
        ]);

        if (sonnetResult.status === "fulfilled") {
          const sr = sonnetResult.value;
          totalInputTokens += sr.inputTokens;
          totalOutputTokens += sr.outputTokens;
          allOutputs.push({ agent: "sonnet", content: sr.content });
          send("step_done", {
            agent: "sonnet", role: "design",
            latencyMs: sr.latencyMs,
            inputTokens: sr.inputTokens, outputTokens: sr.outputTokens,
          });
        } else {
          send("step_error", { agent: "sonnet", role: "design", error: sonnetResult.reason?.message || String(sonnetResult.reason) });
        }

        if (codexResult.status === "fulfilled") {
          const cr = codexResult.value;
          totalInputTokens += cr.inputTokens;
          totalOutputTokens += cr.outputTokens;
          allOutputs.push({ agent: "codex", content: cr.content });
          send("step_done", {
            agent: "codex", role: "code",
            latencyMs: cr.latencyMs,
            inputTokens: cr.inputTokens, outputTokens: cr.outputTokens,
          });
        } else {
          send("step_error", { agent: "codex", role: "code", error: codexResult.reason?.message || String(codexResult.reason) });
        }

        /* ─── STEP 3: OPUS REVIEW ─── */
        if (settings.autoReview) {
          send("step_start", { agent: "opus", role: "review" });
          const revT0 = Date.now();

          try {
            const reviewResult = await callAgent(
              "opus", "review", message, context, settings,
              planOutput, allOutputs,
              (token) => send("token", { agent: "opus", text: token })
            );

            totalInputTokens += reviewResult.inputTokens;
            totalOutputTokens += reviewResult.outputTokens;

            send("step_done", {
              agent: "opus", role: "review",
              latencyMs: Date.now() - revT0,
              inputTokens: reviewResult.inputTokens,
              outputTokens: reviewResult.outputTokens,
            });

            send("review", parseReview(reviewResult.content));
          } catch (e: unknown) {
            send("step_error", { agent: "opus", role: "review", error: (e as Error).message });
          }
        }

        /* ─── DONE ─── */
        send("done", {
          totalLatencyMs: Date.now() - t0,
          totalInputTokens,
          totalOutputTokens,
          totalTokens: totalInputTokens + totalOutputTokens,
        });
      } catch (e: unknown) {
        send("error", { message: (e as Error).message });
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
