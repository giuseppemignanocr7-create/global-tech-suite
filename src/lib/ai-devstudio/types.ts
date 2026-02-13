/* ═══════════════════════════════════════════════════════════
   GiuseCoder — TypeScript Types
   ═══════════════════════════════════════════════════════════ */

export type AgentId = "opus" | "sonnet" | "codex" | "haiku";

export type TaskType =
  | "quick_task"
  | "completion"
  | "commit_message"
  | "code_edit"
  | "refactor"
  | "ui_component"
  | "css_styling"
  | "animation"
  | "explain"
  | "review"
  | "architecture"
  | "code_generation"
  | "fix_error"
  | "test_generation"
  | "ui_page"
  | "design_system"
  | "complex_feature"
  | "landing_page"
  | "full_app"
  | "documentation";

export type StepRole =
  | "execute"
  | "complete"
  | "code"
  | "design"
  | "plan"
  | "analyze"
  | "review"
  | "plan_ui"
  | "plan_design_system"
  | "plan_tests"
  | "plan_docs"
  | "analyze_bug"
  | "fix";

export interface PipelineStep {
  agent: AgentId;
  role: StepRole;
  parallel?: string; // group ID for parallel execution
}

export interface Pipeline {
  description: string;
  steps: PipelineStep[];
  estimatedTime: string;
  estimatedCost: string;
}

export interface AgentResult {
  agent: AgentId;
  role: StepRole;
  content: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
}

export interface ReviewIssue {
  severity: "critical" | "high" | "medium" | "low";
  agent: "sonnet" | "codex";
  location: string;
  problem: string;
  fix: string;
}

export interface ReviewResult {
  verdict: "APPROVED" | "NEEDS_CHANGES";
  score: number;
  summary?: string;
  issues: ReviewIssue[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  pipeline?: PipelineProgress;
  files?: GeneratedFile[];
}

export interface PipelineStepProgress {
  agent: AgentId;
  role: StepRole;
  status: "waiting" | "running" | "done" | "error";
  parallel?: string;
  content: string;
  latencyMs?: number;
  inputTokens?: number;
  outputTokens?: number;
}

export interface PipelineProgress {
  taskType: TaskType;
  steps: PipelineStepProgress[];
  triageLatencyMs?: number;
  totalLatencyMs?: number;
  totalCost?: number;
  totalTokens?: number;
  reviewResult?: ReviewResult;
}

export interface OrchestrateRequest {
  message: string;
  context: string;
  settings: UserSettings;
  history: { role: "user" | "assistant"; content: string }[];
}

export interface UserSettings {
  anthropicApiKey: string;
  openaiApiKey: string;
  models: {
    opus: string;
    sonnet: string;
    haiku: string;
    codex: string;
  };
  autoReview: boolean;
  autoFix: boolean;
  parallelExecution: boolean;
  codexReasoningEffort: "low" | "medium" | "high";
  costWarningThreshold: number;
}

export const DEFAULT_SETTINGS: UserSettings = {
  anthropicApiKey: "",
  openaiApiKey: "",
  models: {
    opus: "claude-sonnet-4-20250514",
    sonnet: "claude-sonnet-4-20250514",
    haiku: "claude-3-5-haiku-20241022",
    codex: "gpt-4o",
  },
  autoReview: true,
  autoFix: true,
  parallelExecution: true,
  codexReasoningEffort: "high",
  costWarningThreshold: 0.5,
};

// Cost per million tokens [input, output]
export const MODEL_COSTS: Record<string, [number, number]> = {
  "claude-sonnet-4-20250514": [3, 15],
  "claude-3-5-sonnet-20241022": [3, 15],
  "claude-3-opus-20240229": [15, 75],
  "claude-3-5-haiku-20241022": [0.8, 4],
  "gpt-4o": [2.5, 10],
  "gpt-4o-mini": [0.15, 0.6],
};

export function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = MODEL_COSTS[model] || [3, 15];
  return (inputTokens * costs[0] + outputTokens * costs[1]) / 1_000_000;
}
