/* ═══════════════════════════════════════════════════════════
   GiuseCoder — API Key Verification Endpoint
   Tests Anthropic and OpenAI keys with minimal API calls.
   ═══════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { anthropicApiKey, openaiApiKey, models } = await req.json();

  const results: {
    anthropic: { ok: boolean; error?: string; model?: string };
    openai: { ok: boolean; error?: string; model?: string };
  } = {
    anthropic: { ok: false },
    openai: { ok: false },
  };

  // Test Anthropic key with a tiny Haiku call
  if (anthropicApiKey) {
    try {
      const client = new Anthropic({ apiKey: anthropicApiKey });
      const resp = await client.messages.create({
        model: models?.haiku || "claude-3-5-haiku-20241022",
        max_tokens: 10,
        messages: [{ role: "user", content: "Rispondi solo: OK" }],
      });
      const text =
        resp.content?.[0]?.type === "text" ? resp.content[0].text : "";
      results.anthropic = {
        ok: true,
        model: resp.model,
      };
    } catch (e: unknown) {
      results.anthropic = {
        ok: false,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  } else {
    results.anthropic = { ok: false, error: "Chiave non fornita" };
  }

  // Test OpenAI key with a tiny GPT call
  if (openaiApiKey) {
    try {
      const client = new OpenAI({ apiKey: openaiApiKey });
      const resp = await client.chat.completions.create({
        model: models?.codex || "gpt-4o",
        max_tokens: 10,
        messages: [{ role: "user", content: "Rispondi solo: OK" }],
      });
      results.openai = {
        ok: true,
        model: resp.model,
      };
    } catch (e: unknown) {
      results.openai = {
        ok: false,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  } else {
    results.openai = { ok: false, error: "Chiave non fornita (opzionale)" };
  }

  return NextResponse.json(results);
}
