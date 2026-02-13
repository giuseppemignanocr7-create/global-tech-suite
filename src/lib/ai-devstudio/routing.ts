/* ═══════════════════════════════════════════════════════════
   GiuseCoder — Routing Table
   ═══════════════════════════════════════════════════════════ */

import type { TaskType, Pipeline } from "./types";

export const ROUTING_TABLE: Record<TaskType, Pipeline> = {
  quick_task: {
    description: "Task semplice e veloce",
    steps: [{ agent: "haiku", role: "execute" }],
    estimatedTime: "< 1s",
    estimatedCost: "< $0.005",
  },
  completion: {
    description: "Tab completion inline",
    steps: [{ agent: "haiku", role: "complete" }],
    estimatedTime: "< 300ms",
    estimatedCost: "< $0.001",
  },
  commit_message: {
    description: "Genera commit message dal diff",
    steps: [{ agent: "haiku", role: "execute" }],
    estimatedTime: "< 1s",
    estimatedCost: "< $0.003",
  },
  code_edit: {
    description: "Modifica codice esistente",
    steps: [{ agent: "codex", role: "code" }],
    estimatedTime: "2-4s",
    estimatedCost: "$0.02-0.06",
  },
  refactor: {
    description: "Ristruttura codice",
    steps: [{ agent: "codex", role: "code" }],
    estimatedTime: "3-6s",
    estimatedCost: "$0.03-0.08",
  },
  ui_component: {
    description: "Genera componente UI singolo",
    steps: [{ agent: "sonnet", role: "design" }],
    estimatedTime: "2-4s",
    estimatedCost: "$0.01-0.04",
  },
  css_styling: {
    description: "CSS, Tailwind, animazioni",
    steps: [{ agent: "sonnet", role: "design" }],
    estimatedTime: "1-3s",
    estimatedCost: "$0.01-0.03",
  },
  animation: {
    description: "Micro-animazioni, transizioni, keyframes",
    steps: [{ agent: "sonnet", role: "design" }],
    estimatedTime: "2-4s",
    estimatedCost: "$0.02-0.04",
  },
  explain: {
    description: "Spiega codice o concetto",
    steps: [{ agent: "opus", role: "analyze" }],
    estimatedTime: "3-6s",
    estimatedCost: "$0.03-0.08",
  },
  review: {
    description: "Code review approfondita",
    steps: [{ agent: "opus", role: "review" }],
    estimatedTime: "3-6s",
    estimatedCost: "$0.04-0.10",
  },
  architecture: {
    description: "Decisioni architetturali",
    steps: [{ agent: "opus", role: "plan" }],
    estimatedTime: "4-8s",
    estimatedCost: "$0.05-0.12",
  },
  code_generation: {
    description: "Opus pianifica → Codex implementa",
    steps: [
      { agent: "opus", role: "plan" },
      { agent: "codex", role: "code" },
    ],
    estimatedTime: "5-10s",
    estimatedCost: "$0.08-0.18",
  },
  fix_error: {
    description: "Opus analizza bug → Codex fixa",
    steps: [
      { agent: "opus", role: "analyze_bug" },
      { agent: "codex", role: "fix" },
    ],
    estimatedTime: "5-10s",
    estimatedCost: "$0.08-0.15",
  },
  test_generation: {
    description: "Opus test strategy → Codex scrive test",
    steps: [
      { agent: "opus", role: "plan_tests" },
      { agent: "codex", role: "code" },
    ],
    estimatedTime: "5-10s",
    estimatedCost: "$0.08-0.16",
  },
  ui_page: {
    description: "Opus struttura pagina → Sonnet genera UI completa",
    steps: [
      { agent: "opus", role: "plan_ui" },
      { agent: "sonnet", role: "design" },
    ],
    estimatedTime: "5-8s",
    estimatedCost: "$0.06-0.14",
  },
  design_system: {
    description: "Opus definisce tokens → Sonnet implementa",
    steps: [
      { agent: "opus", role: "plan_design_system" },
      { agent: "sonnet", role: "design" },
    ],
    estimatedTime: "6-10s",
    estimatedCost: "$0.08-0.16",
  },
  complex_feature: {
    description: "Full pipeline: plan → design + code → review",
    steps: [
      { agent: "opus", role: "plan" },
      { agent: "sonnet", role: "design", parallel: "design_code" },
      { agent: "codex", role: "code", parallel: "design_code" },
      { agent: "opus", role: "review" },
    ],
    estimatedTime: "10-18s",
    estimatedCost: "$0.15-0.30",
  },
  landing_page: {
    description: "Full pipeline per landing page",
    steps: [
      { agent: "opus", role: "plan" },
      { agent: "sonnet", role: "design", parallel: "design_code" },
      { agent: "codex", role: "code", parallel: "design_code" },
      { agent: "opus", role: "review" },
    ],
    estimatedTime: "12-20s",
    estimatedCost: "$0.18-0.35",
  },
  full_app: {
    description: "Pipeline completa con QA e auto-fix",
    steps: [
      { agent: "opus", role: "plan" },
      { agent: "sonnet", role: "design", parallel: "design_code" },
      { agent: "codex", role: "code", parallel: "design_code" },
      { agent: "opus", role: "review" },
    ],
    estimatedTime: "15-25s",
    estimatedCost: "$0.25-0.45",
  },
  documentation: {
    description: "Opus struttura → Codex scrive tech docs",
    steps: [
      { agent: "opus", role: "plan_docs" },
      { agent: "codex", role: "code" },
    ],
    estimatedTime: "5-10s",
    estimatedCost: "$0.06-0.14",
  },
};

export const AGENT_INFO = {
  opus: {
    name: "Opus",
    emoji: "🧠",
    role: "CTO & Architetto",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-indigo-600",
    specialties: [
      "Analisi richieste",
      "Architettura",
      "Pianificazione",
      "Code Review",
      "QA",
      "Decisioni strategiche",
    ],
  },
  sonnet: {
    name: "Sonnet",
    emoji: "🎨",
    role: "Design Director",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-600",
    specialties: [
      "Componenti React",
      "Tailwind CSS",
      "Animazioni",
      "Layout responsive",
      "Design system",
      "UI/UX",
    ],
  },
  codex: {
    name: "Codex",
    emoji: "⚡",
    role: "Senior Developer",
    color: "#06b6d4",
    gradient: "from-cyan-500 to-blue-600",
    specialties: [
      "TypeScript",
      "API REST",
      "Database",
      "State management",
      "Auth",
      "Testing",
    ],
  },
  haiku: {
    name: "Haiku",
    emoji: "🐇",
    role: "Triage & Quick Tasks",
    color: "#22c55e",
    gradient: "from-green-500 to-emerald-600",
    specialties: [
      "Classificazione task",
      "Tab completion",
      "Commit messages",
      "Task semplici",
    ],
  },
} as const;
