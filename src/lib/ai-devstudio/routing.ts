/* ═══════════════════════════════════════════════════════════
   GiuseCoder — Pipeline & Agent Info
   Opus orchestra → Sonnet design → GPT code → Opus review
   ═══════════════════════════════════════════════════════════ */

import type { TaskType, Pipeline } from "./types";

export const ROUTING_TABLE: Record<TaskType, Pipeline> = {
  standard: {
    description: "Opus pensa → Sonnet design + GPT code → Opus review",
    steps: [
      { agent: "opus", role: "thinking" },
      { agent: "sonnet", role: "design", parallel: "build" },
      { agent: "codex", role: "code", parallel: "build" },
      { agent: "opus", role: "review" },
    ],
    estimatedTime: "20-40s",
    estimatedCost: "$0.10-0.30",
  },
};

export const AGENT_INFO = {
  opus: {
    name: "Opus",
    emoji: "🧠",
    role: "CTO & Orchestratore",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-indigo-600",
    specialties: [
      "Ragionamento",
      "Architettura",
      "Pianificazione",
      "Code Review",
      "Orchestrazione",
    ],
  },
  sonnet: {
    name: "Sonnet",
    emoji: "🎨",
    role: "Design Director",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-600",
    specialties: [
      "UI Components",
      "CSS/Tailwind",
      "Animazioni",
      "Layout",
      "Responsive",
    ],
  },
  codex: {
    name: "GPT-4o",
    emoji: "⚡",
    role: "Senior Developer",
    color: "#06b6d4",
    gradient: "from-cyan-500 to-blue-600",
    specialties: [
      "TypeScript",
      "Logica",
      "API",
      "State",
      "Testing",
    ],
  },
} as const;
