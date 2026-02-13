"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Code2, Sparkles, Terminal, Eye, FileCode, Send,
  Settings, Bot, ChevronRight, ChevronDown, File, Folder,
  GitBranch, RefreshCw, Plus, X, Copy, Check,
  AlertCircle, CheckCircle2, Loader2, Zap, Monitor, Tablet, Smartphone,
  Cpu, Globe, Shield, Brain, Palette, KeyRound, ToggleLeft, ToggleRight,
  MessageSquare, Users, ArrowLeft,
} from "lucide-react";
import DemoBadge from "@/components/DemoBadge";
import type {
  ChatMessage,
  PipelineProgress,
  PipelineStepProgress,
  GeneratedFile,
  UserSettings,
  AgentId,
  TaskType,
} from "@/lib/ai-devstudio/types";
import { DEFAULT_SETTINGS, estimateCost } from "@/lib/ai-devstudio/types";
import { ROUTING_TABLE, AGENT_INFO } from "@/lib/ai-devstudio/routing";

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const AGENT_COLORS: Record<AgentId, string> = {
  opus: "#8b5cf6",
  sonnet: "#ec4899",
  codex: "#06b6d4",
  haiku: "#22c55e",
};

const AGENT_EMOJI: Record<AgentId, string> = {
  opus: "🧠",
  sonnet: "🎨",
  codex: "⚡",
  haiku: "🐇",
};

function extractCodeBlocks(text: string): GeneratedFile[] {
  const fileMap = new Map<string, GeneratedFile>();

  // Match ```lang\n// filepath: path\n...code...```
  const fpRegex = /```(\w+)?\n\/\/\s*filepath:\s*(.+?)\n([\s\S]*?)```/g;
  let m;
  while ((m = fpRegex.exec(text)) !== null) {
    const path = m[2].trim();
    const content = m[3].trim();
    const existing = fileMap.get(path);
    if (!existing || content.length > existing.content.length) {
      fileMap.set(path, { language: m[1] || "typescript", path, content });
    }
  }

  // Fallback: any code block
  if (fileMap.size === 0) {
    const simpleRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let idx = 0;
    while ((m = simpleRegex.exec(text)) !== null) {
      const lang = m[1] || "typescript";
      const content = m[2].trim();
      if (content.length < 20) continue; // skip trivial blocks
      const path = `generated_${idx}.${lang === "tsx" ? "tsx" : lang === "css" ? "css" : lang === "html" ? "html" : "ts"}`;
      const existing = fileMap.get(path);
      if (!existing || content.length > existing.content.length) {
        fileMap.set(path, { language: lang, path, content });
      }
      idx++;
    }
  }

  return Array.from(fileMap.values());
}

/** Build a self-contained HTML page from generated files for live preview */
function buildPreviewHtml(files: GeneratedFile[]): string {
  // Collect CSS
  const cssFiles = files.filter((f) => f.language === "css" || f.path.endsWith(".css"));
  const cssBlock = cssFiles.map((f) => f.content).join("\n");

  // Collect TSX/JSX/HTML
  const mainFile =
    files.find((f) => f.path.includes("App")) ||
    files.find((f) => f.path.includes("Calculator")) ||
    files.find((f) => f.path.includes("page")) ||
    files.find((f) => f.language === "tsx" || f.language === "jsx" || f.language === "html") ||
    files[0];

  if (!mainFile) return "";

  // If it's pure HTML, render directly
  if (mainFile.language === "html" || mainFile.content.trim().startsWith("<!") || mainFile.content.trim().startsWith("<html")) {
    return mainFile.content;
  }

  // Otherwise build a code-display page showing all files nicely
  const allCode = files
    .map(
      (f) =>
        `<div class="file-block">
          <div class="file-header">${escapeHtml(f.path)} <span class="lang">${f.language}</span></div>
          <pre><code>${escapeHtml(f.content)}</code></pre>
        </div>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GiuseCoder Preview</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'SF Mono', 'Fira Code', monospace; background: #0f172a; color: #e2e8f0; padding: 24px; }
  h1 { font-size: 18px; color: #fbbf24; margin-bottom: 8px; font-weight: 700; }
  .subtitle { font-size: 12px; color: #64748b; margin-bottom: 24px; }
  .file-block { background: #1e293b; border: 1px solid #334155; border-radius: 12px; margin-bottom: 16px; overflow: hidden; }
  .file-header { padding: 10px 16px; background: #1e293b; border-bottom: 1px solid #334155; font-size: 13px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; }
  .lang { font-size: 10px; background: #334155; padding: 2px 8px; border-radius: 6px; color: #fbbf24; }
  pre { padding: 16px; overflow-x: auto; font-size: 12px; line-height: 1.6; }
  code { color: #e2e8f0; }
  .stats { display: flex; gap: 16px; margin-bottom: 20px; }
  .stat { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 12px 16px; flex: 1; text-align: center; }
  .stat-value { font-size: 20px; font-weight: 700; color: #fbbf24; }
  .stat-label { font-size: 10px; color: #64748b; margin-top: 2px; }
  ${cssBlock}
</style>
</head>
<body>
  <h1>\u26a1 GiuseCoder Output</h1>
  <p class="subtitle">${files.length} file generati</p>
  <div class="stats">
    <div class="stat"><div class="stat-value">${files.length}</div><div class="stat-label">File</div></div>
    <div class="stat"><div class="stat-value">${files.reduce((s, f) => s + f.content.split("\n").length, 0)}</div><div class="stat-label">Righe</div></div>
    <div class="stat"><div class="stat-value">${Math.round(files.reduce((s, f) => s + f.content.length, 0) / 1024)}KB</div><div class="stat-label">Dimensione</div></div>
  </div>
  ${allCode}
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function loadSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem("giusecoder_settings");
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

function saveSettings(s: UserSettings) {
  if (typeof window !== "undefined") {
    localStorage.setItem("giusecoder_settings", JSON.stringify(s));
  }
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
type Page = "chat" | "ide" | "preview" | "agents" | "settings";

export default function AIDevStudioPage() {
  /* ── state ── */
  const [page, setPage] = useState<Page>("chat");
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [sessionStats, setSessionStats] = useState({ requests: 0, tokens: 0, cost: 0 });
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [keyStatus, setKeyStatus] = useState<{
    anthropic?: { ok: boolean; error?: string; model?: string };
    openai?: { ok: boolean; error?: string; model?: string };
  }>({});
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { setSettings(loadSettings()); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
    setSaved(false);
    setKeyStatus({});
  }, []);

  const handleSaveKeys = useCallback(() => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [settings]);

  const handleVerifyKeys = useCallback(async () => {
    setVerifying(true);
    setKeyStatus({});
    try {
      const resp = await fetch("/api/ai-devstudio/verify-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anthropicApiKey: settings.anthropicApiKey,
          openaiApiKey: settings.openaiApiKey,
          models: settings.models,
        }),
      });
      const data = await resp.json();
      setKeyStatus(data);
    } catch (e: unknown) {
      setKeyStatus({
        anthropic: { ok: false, error: (e as Error).message },
        openai: { ok: false, error: (e as Error).message },
      });
    } finally {
      setVerifying(false);
    }
  }, [settings]);

  /* ── orchestrate ── */
  const handleSend = useCallback(async () => {
    if (!input.trim() || isRunning) return;
    if (!settings.anthropicApiKey) {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: "⚠️ Configura la tua API key Anthropic nelle Impostazioni prima di iniziare.", timestamp: Date.now() },
      ]);
      return;
    }

    const userMsg: ChatMessage = { id: uid(), role: "user", content: input.trim(), timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsRunning(true);

    const assistantId = uid();
    const pipeline: PipelineProgress = { taskType: "complex_feature" as TaskType, steps: [] };

    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: Date.now(), pipeline, files: [] },
    ]);

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const resp = await fetch("/api/ai-devstudio/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          context: generatedFiles.map((f) => `${f.path}:\n${f.content}`).join("\n\n").slice(0, 4000),
          settings,
          history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortController.signal,
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${errText}`);
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      const agentTexts: Record<string, string> = {};
      let currentPipeline = { ...pipeline };
      let allFiles: GeneratedFile[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let eventType = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith("data: ") && eventType) {
            try {
              const data = JSON.parse(line.slice(6));
              switch (eventType) {
                case "triage_done":
                  currentPipeline = { ...currentPipeline, taskType: data.taskType, triageLatencyMs: data.latencyMs };
                  break;
                case "pipeline":
                  currentPipeline = {
                    ...currentPipeline,
                    taskType: data.taskType,
                    steps: data.steps.map((s: { agent: AgentId; role: string; parallel?: string }) => ({
                      agent: s.agent,
                      role: s.role,
                      parallel: s.parallel,
                      status: "waiting" as const,
                      content: "",
                    })),
                  };
                  break;
                case "step_start": {
                  const steps = currentPipeline.steps.map((s) =>
                    s.agent === data.agent && s.status === "waiting"
                      ? { ...s, status: "running" as const }
                      : s
                  );
                  currentPipeline = { ...currentPipeline, steps };
                  break;
                }
                case "token": {
                  const agent = data.agent as string;
                  agentTexts[agent] = (agentTexts[agent] || "") + data.text;
                  const steps = currentPipeline.steps.map((s) =>
                    s.agent === agent && s.status === "running"
                      ? { ...s, content: agentTexts[agent] }
                      : s
                  );
                  currentPipeline = { ...currentPipeline, steps };
                  break;
                }
                case "step_done": {
                  const steps = currentPipeline.steps.map((s) =>
                    s.agent === data.agent && s.status === "running"
                      ? {
                          ...s,
                          status: "done" as const,
                          latencyMs: data.latencyMs,
                          inputTokens: data.inputTokens,
                          outputTokens: data.outputTokens,
                        }
                      : s
                  );
                  currentPipeline = { ...currentPipeline, steps };
                  break;
                }
                case "step_error": {
                  const steps = currentPipeline.steps.map((s) =>
                    s.agent === data.agent && s.status === "running"
                      ? { ...s, status: "error" as const, content: `Error: ${data.error}` }
                      : s
                  );
                  currentPipeline = { ...currentPipeline, steps };
                  break;
                }
                case "review":
                  currentPipeline = { ...currentPipeline, reviewResult: data };
                  break;
                case "done": {
                  currentPipeline = {
                    ...currentPipeline,
                    totalLatencyMs: data.totalLatencyMs,
                    totalTokens: data.totalTokens,
                  };
                  // Extract cost
                  const totalCostEst =
                    currentPipeline.steps.reduce((sum, s) => {
                      if (s.inputTokens && s.outputTokens) {
                        const model =
                          s.agent === "codex"
                            ? settings.models.codex
                            : s.agent === "opus"
                            ? settings.models.opus
                            : s.agent === "sonnet"
                            ? settings.models.sonnet
                            : settings.models.haiku;
                        return sum + estimateCost(model, s.inputTokens, s.outputTokens);
                      }
                      return sum;
                    }, 0);
                  currentPipeline = { ...currentPipeline, totalCost: totalCostEst };
                  setSessionStats((prev) => ({
                    requests: prev.requests + 1,
                    tokens: prev.tokens + (data.totalTokens || 0),
                    cost: prev.cost + totalCostEst,
                  }));
                  // Extract generated files from all agent outputs (deduped)
                  const allText = Object.values(agentTexts).join("\n\n");
                  allFiles = extractCodeBlocks(allText);
                  if (allFiles.length > 0) {
                    setGeneratedFiles(allFiles);
                    setActiveFileIdx(0);
                  }
                  break;
                }
                case "error":
                  currentPipeline = {
                    ...currentPipeline,
                    steps: [
                      ...currentPipeline.steps,
                      { agent: "opus", role: "plan", status: "error", content: data.message } as PipelineStepProgress,
                    ],
                  };
                  break;
              }

              // Update the assistant message
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        pipeline: { ...currentPipeline },
                        files: allFiles,
                        content: Object.values(agentTexts).join("\n\n---\n\n"),
                      }
                    : m
                )
              );
            } catch {}
            eventType = "";
          } else if (line === "") {
            eventType = "";
          }
        }
      }
    } catch (e: unknown) {
      if ((e as Error).name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `❌ Errore: ${(e as Error).message}` }
              : m
          )
        );
      }
    } finally {
      setIsRunning(false);
      abortRef.current = null;
    }
  }, [input, isRunning, settings, messages, generatedFiles]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  /* ── nav items ── */
  const navItems = [
    { key: "chat" as Page, icon: MessageSquare, label: "Chat" },
    { key: "ide" as Page, icon: FileCode, label: "Codice" },
    { key: "preview" as Page, icon: Eye, label: "Preview" },
    { key: "agents" as Page, icon: Bot, label: "Agenti" },
    { key: "settings" as Page, icon: Settings, label: "Config" },
  ];

  const hasKeys = !!settings.anthropicApiKey;

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <DemoBadge />

      {/* ── Mobile top header ── */}
      <header className="lg:hidden sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border px-4 py-2.5 flex items-center gap-3">
        <Link href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Code2 className="w-3.5 h-3.5 text-white" />
        </Link>
        <span className="text-sm font-bold text-amber-400">GiuseCoder</span>
        <span className="text-xs text-muted-foreground">{navItems.find((n) => n.key === page)?.label}</span>
      </header>

      {/* ── Desktop activity bar ── */}
      <div className="hidden lg:flex w-12 bg-card border-r border-border flex-col items-center py-2 gap-1 shrink-0">
        <Link href="/" className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-2" title="Portale">
          <Code2 className="w-4 h-4 text-white" />
        </Link>
        {navItems.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              page === key ? "bg-amber-500/10 text-amber-400" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
        <div className="flex-1" />
        {sessionStats.requests > 0 && (
          <div className="text-center mb-2">
            <p className="text-[9px] text-amber-400 font-mono">${sessionStats.cost.toFixed(3)}</p>
            <p className="text-[8px] text-muted-foreground">{sessionStats.requests} req</p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
           MAIN CONTENT
         ═══════════════════════════════════════════════ */}
      <main className="flex-1 min-w-0 pb-16 lg:pb-0 flex flex-col overflow-hidden">

        {/* ═══ CHAT ═══ */}
        {page === "chat" && (
          <div className="flex-1 flex flex-col">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                    <Code2 className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">GiuseCoder</h2>
                  <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                    Orchestrazione automatica a 3 agenti AI. Scrivi cosa vuoi costruire — il sistema decide chi fa cosa.
                  </p>
                  {!hasKeys && (
                    <button onClick={() => setPage("settings")} className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-sm font-medium hover:bg-amber-500/20 mb-6 flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />Configura API Keys
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                    {[
                      "Crea una landing page con hero, pricing e form di contatto",
                      "Genera un componente React per una tabella dati con filtri e paginazione",
                      "Scrivi un\'API REST per gestire utenti con autenticazione JWT",
                      "Crea un design system con bottoni, input e card components",
                    ].map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(ex)}
                        className="text-left p-3 rounded-xl bg-card border border-border hover:border-amber-500/30 transition-colors text-xs text-muted-foreground hover:text-foreground"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-4 max-w-4xl mx-auto w-full">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Code2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[85%] min-w-0 ${msg.role === "user" ? "bg-amber-500/10 border border-amber-500/20 rounded-2xl rounded-tr-md px-4 py-2.5" : "flex-1"}`}>
                        {msg.role === "user" ? (
                          <p className="text-sm">{msg.content}</p>
                        ) : (
                          <div className="space-y-3">
                            {/* Pipeline visualization */}
                            {msg.pipeline && <PipelineViz pipeline={msg.pipeline} settings={settings} />}
                            {/* Generated files */}
                            {msg.files && msg.files.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {msg.files.length} file generati
                                </p>
                                {msg.files.map((f, fi) => (
                                  <div key={fi} className="bg-card border border-border rounded-xl overflow-hidden">
                                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card/80">
                                      <span className="text-[11px] font-mono text-muted-foreground">{f.path}</span>
                                      <button
                                        onClick={() => copyToClipboard(f.content, fi)}
                                        className="p-1 rounded hover:bg-muted text-muted-foreground"
                                      >
                                        {copiedIdx === fi ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                      </button>
                                    </div>
                                    <pre className="p-3 text-[11px] font-mono overflow-x-auto max-h-48 text-foreground/80">{f.content}</pre>
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Plain text fallback if no pipeline */}
                            {!msg.pipeline && msg.content && (
                              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="border-t border-border bg-card/50 p-3">
              <div className="max-w-4xl mx-auto flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder={hasKeys ? "Descrivi cosa vuoi costruire..." : "Configura le API key nelle impostazioni..."}
                    disabled={!hasKeys}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 pr-12"
                    style={{ minHeight: 48, maxHeight: 120 }}
                  />
                  {isRunning && (
                    <button
                      onClick={() => abortRef.current?.abort()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      title="Interrompi"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isRunning || !hasKeys}
                  className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-xl hover:from-amber-400 hover:to-orange-400 disabled:opacity-30 transition-all shrink-0"
                >
                  {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
              <div className="max-w-4xl mx-auto flex items-center gap-3 mt-1.5 px-1">
                <span className="text-[10px] text-muted-foreground">
                  {isRunning ? "Pipeline in esecuzione..." : "Enter per inviare • Shift+Enter nuova riga"}
                </span>
                <div className="flex-1" />
                {sessionStats.requests > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    Sessione: {sessionStats.requests} req · {sessionStats.tokens.toLocaleString()} tok · ${sessionStats.cost.toFixed(3)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ IDE ═══ */}
        {page === "ide" && (
          <div className="flex-1 flex flex-col">
            {generatedFiles.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Nessun file generato</p>
                  <p className="text-xs mt-1">Usa la Chat per generare codice con i 3 agenti AI</p>
                  <button onClick={() => setPage("chat")} className="mt-3 px-4 py-2 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-500/20">
                    Vai alla Chat
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex items-center border-b border-border bg-card/50 px-1 overflow-x-auto">
                  {generatedFiles.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveFileIdx(i)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                        activeFileIdx === i ? "border-amber-500 text-amber-400 bg-background" : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <File className="w-3 h-3" />
                      {f.path.split("/").pop()}
                    </button>
                  ))}
                  <div className="flex-1" />
                  <button
                    onClick={() => copyToClipboard(generatedFiles[activeFileIdx]?.content || "", -1)}
                    className="px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {copiedIdx === -1 ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />} Copia
                  </button>
                </div>
                {/* Code */}
                <div className="flex-1 overflow-auto bg-background">
                  <div className="font-mono text-xs leading-6">
                    {(generatedFiles[activeFileIdx]?.content || "").split("\n").map((line, i) => (
                      <div key={i} className="flex hover:bg-muted/30">
                        <span className="w-12 text-right pr-4 text-muted-foreground/50 select-none shrink-0 border-r border-border/50">{i + 1}</span>
                        <pre className="pl-4 flex-1 whitespace-pre-wrap">
                          <code className={
                            line.trimStart().startsWith("import") ? "text-purple-400" :
                            line.trimStart().startsWith("//") ? "text-muted-foreground" :
                            line.includes("const ") || line.includes("function ") || line.includes("export ") ? "text-blue-400" :
                            line.includes("return") ? "text-pink-400" :
                            (line.includes("'") || line.includes('"') || line.includes('`')) ? "text-green-400" :
                            "text-foreground/80"
                          }>{line || " "}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Status bar */}
                <div className="flex items-center justify-between px-3 py-1 bg-amber-600 text-[10px] text-white/90">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />main</span>
                    <span>{generatedFiles.length} file</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{generatedFiles[activeFileIdx]?.path}</span>
                    <span>{generatedFiles[activeFileIdx]?.language}</span>
                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3" />GiuseCoder v1.0</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══ PREVIEW ═══ */}
        {page === "preview" && (
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-1">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">localhost:3000</span>
              </div>
              <div className="flex items-center bg-muted rounded-lg p-0.5">
                {([
                  { id: "desktop" as const, icon: Monitor, label: "Desktop" },
                  { id: "tablet" as const, icon: Tablet, label: "Tablet" },
                  { id: "mobile" as const, icon: Smartphone, label: "Mobile" },
                ] as const).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setPreviewDevice(d.id)}
                    className={`p-1.5 rounded-md transition-colors ${
                      previewDevice === d.id ? "bg-background text-amber-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={d.label}
                  >
                    <d.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><RefreshCw className="w-4 h-4" /></button>
            </div>
            {/* Preview area — live iframe */}
            <div className="flex-1 bg-[#0f172a] overflow-auto flex items-start justify-center p-4">
              <div
                className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
                style={{
                  width: previewDevice === "desktop" ? "100%" : previewDevice === "tablet" ? 768 : 375,
                  maxWidth: "100%",
                  height: previewDevice === "mobile" ? 667 : previewDevice === "tablet" ? 500 : "100%",
                  minHeight: 400,
                }}
              >
                {generatedFiles.length > 0 ? (
                  <iframe
                    srcDoc={buildPreviewHtml(generatedFiles)}
                    title="GiuseCoder Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                    style={{ minHeight: previewDevice === "mobile" ? 667 : previewDevice === "tablet" ? 500 : 400 }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400">
                    <div className="text-center">
                      <Eye className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Genera codice dalla Chat per vedere l&apos;anteprima</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-1.5 border-t border-border bg-card/50 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                {previewDevice === "desktop" ? <Monitor className="w-3 h-3" /> : previewDevice === "tablet" ? <Tablet className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                {previewDevice === "desktop" ? "Desktop (100%)" : previewDevice === "tablet" ? "Tablet (768px)" : "Mobile (375px)"}
              </span>
              <span>•</span>
              <span>{generatedFiles.length} file generati</span>
            </div>
          </div>
        )}

        {/* ═══ AGENTS ═══ */}
        {page === "agents" && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-bold mb-1">Agenti AI</h2>
              <p className="text-xs text-muted-foreground mb-6">Orchestrazione automatica — l&apos;utente scrive, il sistema decide chi fa cosa</p>

              {/* Agent cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {(Object.entries(AGENT_INFO) as [AgentId, typeof AGENT_INFO[AgentId]][]).map(([id, info]) => (
                  <div key={id} className="bg-card border border-border rounded-2xl p-5 hover:border-opacity-50 transition-colors" style={{ borderColor: info.color + "30" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-lg`}>
                        {info.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{info.name}</h3>
                        <p className="text-[11px] text-muted-foreground">{info.role}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {info.specialties.map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{s}</span>
                      ))}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Modello: <span className="font-mono text-foreground/70">{settings.models[id]}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Session stats */}
              <div className="bg-card border border-border rounded-2xl p-5 mb-6">
                <h3 className="font-semibold text-sm mb-3">Statistiche Sessione</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Richieste", value: sessionStats.requests, color: "#f59e0b" },
                    { label: "Token Totali", value: sessionStats.tokens.toLocaleString(), color: "#06b6d4" },
                    { label: "Costo Totale", value: `$${sessionStats.cost.toFixed(4)}`, color: "#22c55e" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Routing table */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-sm mb-3">Routing Table — Come i Task Vengono Assegnati</h3>
                <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                  {(Object.entries(ROUTING_TABLE) as [TaskType, typeof ROUTING_TABLE[TaskType]][]).map(([type, pipeline]) => (
                    <div key={type} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/50 text-xs">
                      <span className="font-mono text-amber-400 w-32 shrink-0">{type}</span>
                      <div className="flex items-center gap-1 flex-1">
                        {pipeline.steps.map((s, i) => (
                          <span key={i} className="flex items-center gap-0.5">
                            {i > 0 && !s.parallel && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                            {i > 0 && s.parallel && <span className="text-[9px] text-muted-foreground mx-0.5">+</span>}
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                              style={{ backgroundColor: AGENT_COLORS[s.agent] + "15", color: AGENT_COLORS[s.agent] }}
                            >
                              {AGENT_EMOJI[s.agent]} {s.agent}
                            </span>
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">{pipeline.estimatedCost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SETTINGS ═══ */}
        {page === "settings" && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-lg font-bold mb-1">Impostazioni</h2>
              <p className="text-xs text-muted-foreground mb-6">Configura le API key e i modelli per GiuseCoder</p>

              {/* API Keys */}
              <div className="bg-card border border-border rounded-2xl p-5 mb-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><KeyRound className="w-4 h-4 text-amber-400" />API Keys</h3>
                <p className="text-[11px] text-muted-foreground mb-4">Le chiavi sono salvate solo nel tuo browser (localStorage). Mai inviate a terzi.</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Anthropic API Key (per Opus, Sonnet, Haiku)</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={settings.anthropicApiKey}
                        onChange={(e) => updateSettings({ anthropicApiKey: e.target.value })}
                        placeholder="sk-ant-..."
                        className={`w-full px-3 py-2 bg-background border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40 pr-10 ${
                          keyStatus.anthropic?.ok ? "border-green-500/50" : keyStatus.anthropic?.error ? "border-red-500/50" : "border-border"
                        }`}
                      />
                      {keyStatus.anthropic && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {keyStatus.anthropic.ok ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                        </span>
                      )}
                    </div>
                    {keyStatus.anthropic?.ok && (
                      <p className="text-[10px] text-green-400 mt-1">✓ Connesso — modello: {keyStatus.anthropic.model}</p>
                    )}
                    {keyStatus.anthropic?.error && (
                      <p className="text-[10px] text-red-400 mt-1">✗ {keyStatus.anthropic.error}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">OpenAI API Key (per Codex/GPT) <span className="text-muted-foreground/50">— opzionale</span></label>
                    <div className="relative">
                      <input
                        type="password"
                        value={settings.openaiApiKey}
                        onChange={(e) => updateSettings({ openaiApiKey: e.target.value })}
                        placeholder="sk-..."
                        className={`w-full px-3 py-2 bg-background border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40 pr-10 ${
                          keyStatus.openai?.ok ? "border-green-500/50" : keyStatus.openai?.error && settings.openaiApiKey ? "border-red-500/50" : "border-border"
                        }`}
                      />
                      {keyStatus.openai && settings.openaiApiKey && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {keyStatus.openai.ok ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                        </span>
                      )}
                    </div>
                    {keyStatus.openai?.ok && (
                      <p className="text-[10px] text-green-400 mt-1">✓ Connesso — modello: {keyStatus.openai.model}</p>
                    )}
                    {keyStatus.openai?.error && settings.openaiApiKey && (
                      <p className="text-[10px] text-red-400 mt-1">✗ {keyStatus.openai.error}</p>
                    )}
                  </div>
                  {/* Save + Verify buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSaveKeys}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        saved ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                      }`}
                    >
                      {saved ? <><CheckCircle2 className="w-4 h-4" />Salvato!</> : <><Shield className="w-4 h-4" />Salva</>}
                    </button>
                    <button
                      onClick={handleVerifyKeys}
                      disabled={verifying || !settings.anthropicApiKey}
                      className="flex-1 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm font-medium hover:bg-cyan-500/20 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                    >
                      {verifying ? <><Loader2 className="w-4 h-4 animate-spin" />Verifica...</> : <><Zap className="w-4 h-4" />Verifica Chiavi</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* Models */}
              <div className="bg-card border border-border rounded-2xl p-5 mb-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Cpu className="w-4 h-4 text-cyan-400" />Modelli</h3>
                <div className="space-y-3">
                  {([
                    { key: "opus" as const, label: "🧠 Opus (CTO)", placeholder: "claude-sonnet-4-20250514" },
                    { key: "sonnet" as const, label: "🎨 Sonnet (Design)", placeholder: "claude-sonnet-4-20250514" },
                    { key: "haiku" as const, label: "🐇 Haiku (Triage)", placeholder: "claude-3-5-haiku-20241022" },
                    { key: "codex" as const, label: "⚡ Codex (Dev)", placeholder: "gpt-4o" },
                  ]).map((m) => (
                    <div key={m.key}>
                      <label className="text-xs text-muted-foreground block mb-1">{m.label}</label>
                      <input
                        value={settings.models[m.key]}
                        onChange={(e) => updateSettings({ models: { ...settings.models, [m.key]: e.target.value } })}
                        placeholder={m.placeholder}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="bg-card border border-border rounded-2xl p-5 mb-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Settings className="w-4 h-4 text-violet-400" />Orchestrazione</h3>
                <div className="space-y-3">
                  {[
                    { key: "autoReview", label: "Auto-Review (Opus revisiona l'output)", value: settings.autoReview },
                    { key: "autoFix", label: "Auto-Fix (corregge issue critiche/alte)", value: settings.autoFix },
                    { key: "parallelExecution", label: "Esecuzione Parallela (Sonnet + Codex)", value: settings.parallelExecution },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => updateSettings({ [t.key]: !t.value })}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <span className="text-sm">{t.label}</span>
                      {t.value ? (
                        <ToggleRight className="w-6 h-6 text-amber-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                      )}
                    </button>
                  ))}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Codex Reasoning Effort</label>
                    <div className="flex gap-2">
                      {(["low", "medium", "high"] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => updateSettings({ codexReasoningEffort: level })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            settings.codexReasoningEffort === level
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border">
        <div className="flex justify-around items-center py-1.5 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${active ? "text-amber-400" : "text-muted-foreground"}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PIPELINE VISUALIZATION COMPONENT
   ═══════════════════════════════════════════════════════════ */

function PipelineViz({ pipeline, settings }: { pipeline: PipelineProgress; settings: UserSettings }) {
  const taskInfo = ROUTING_TABLE[pipeline.taskType];

  return (
    <div className="bg-card/50 border border-border rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">Pipeline: <span className="font-mono text-amber-400">{pipeline.taskType}</span></span>
        </div>
        {pipeline.totalLatencyMs && (
          <span className="text-[10px] text-muted-foreground">
            {(pipeline.totalLatencyMs / 1000).toFixed(1)}s · {pipeline.totalTokens?.toLocaleString()} tok
            {pipeline.totalCost !== undefined && ` · $${pipeline.totalCost.toFixed(4)}`}
          </span>
        )}
      </div>

      {/* Triage */}
      {pipeline.triageLatencyMs !== undefined && (
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-green-400">🐇</span>
          <span className="text-muted-foreground">Triage:</span>
          <span className="font-mono text-amber-400">{pipeline.taskType}</span>
          <span className="text-muted-foreground">({pipeline.triageLatencyMs}ms)</span>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-2">
        {pipeline.steps.map((step, i) => {
          const info = AGENT_INFO[step.agent];
          const isRunning = step.status === "running";
          const isDone = step.status === "done";
          const isError = step.status === "error";

          return (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-card/80">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
                  style={{ backgroundColor: info.color + "15" }}
                >
                  {info.emoji}
                </div>
                <span className="text-xs font-medium" style={{ color: info.color }}>
                  {info.name}
                </span>
                <span className="text-[10px] text-muted-foreground">{step.role}</span>
                {step.parallel && <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded">parallel</span>}
                <div className="flex-1" />
                {isRunning && <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />}
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
                {isError && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                {isDone && step.latencyMs && (
                  <span className="text-[10px] text-muted-foreground">{(step.latencyMs / 1000).toFixed(1)}s</span>
                )}
                {isDone && step.inputTokens && step.outputTokens && (
                  <span className="text-[10px] text-muted-foreground">
                    {step.inputTokens + step.outputTokens} tok
                  </span>
                )}
              </div>
              {(isRunning || isDone || isError) && step.content && (
                <div className="px-3 py-2 max-h-32 overflow-y-auto">
                  <pre className="text-[11px] font-mono whitespace-pre-wrap text-foreground/70 leading-relaxed">
                    {step.content.length > 800 ? step.content.slice(0, 800) + "..." : step.content}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Review */}
      {pipeline.reviewResult && (
        <div className={`rounded-lg p-3 ${pipeline.reviewResult.verdict === "APPROVED" ? "bg-green-500/5 border border-green-500/20" : "bg-amber-500/5 border border-amber-500/20"}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{pipeline.reviewResult.verdict === "APPROVED" ? "✅" : "⚠️"}</span>
            <span className="text-xs font-semibold">
              Review: {pipeline.reviewResult.verdict} — {pipeline.reviewResult.score}/10
            </span>
          </div>
          {pipeline.reviewResult.summary && (
            <p className="text-[11px] text-muted-foreground">{pipeline.reviewResult.summary}</p>
          )}
          {pipeline.reviewResult.issues && pipeline.reviewResult.issues.length > 0 && (
            <div className="mt-2 space-y-1">
              {pipeline.reviewResult.issues.map((issue, i) => (
                <div key={i} className="text-[10px] flex items-start gap-1.5">
                  <span className={
                    issue.severity === "critical" ? "text-red-400" :
                    issue.severity === "high" ? "text-orange-400" :
                    issue.severity === "medium" ? "text-amber-400" :
                    "text-muted-foreground"
                  }>
                    [{issue.severity}]
                  </span>
                  <span className="text-muted-foreground">{issue.problem}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
