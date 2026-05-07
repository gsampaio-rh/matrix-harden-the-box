export interface ScenarioOption {
  label: string;
  hint?: string;
}

export interface Scenario {
  id: string;
  category: string;
  title: string;
  situation: string;
  options: Record<string, ScenarioOption>;
}

export interface ScenarioAnswer {
  scenarioId: string;
  selectedOption: string;
}

export interface ProbeDetail {
  id: string;
  status: "BLOCKED" | "PASSED";
  points: number;
  max_points: number;
}

export interface ChapterScore {
  score: number;
  max_score: number;
  achievements: string[];
  submitted: boolean;
}

export interface TeamScore {
  team: string;
  score: number;
  max_score: number;
  blocked_count: number;
  total_probes: number;
  probes: ProbeDetail[];
  achievements: string[];
  chapters: Record<string, ChapterScore>;
  total_score: number;
  max_total: number;
}

export interface TeamStatus {
  team: string;
  chapters: Record<string, { submitted: boolean; score: number; achievements: string[] }>;
}

export interface ScenarioResult {
  id: string;
  category: string;
  title: string;
  selected_option: string | null;
  selected_label: string | null;
  best_option: string;
  best_label: string;
  points_earned: number;
  max_points: number;
  is_best: boolean;
  explanation: string;
}

export interface TeamResults {
  team: string;
  score: number;
  max_score: number;
  achievements: string[];
  scenarios: ScenarioResult[];
}

export interface WsMessage {
  event: string;
  data: Record<string, unknown>;
}

export interface TimerState {
  active: boolean;
  end_time: string | null;
}

// ── Chapter 2 types ─────────────────────────────────────────────────

export interface ContentAnnotation {
  line: number;
  text: string;
  annotation: string;
}

export interface ConfigureContent {
  malicious_claude_md: string;
  malicious_skill: string;
  malicious_claude_md_annotations: ContentAnnotation[];
  malicious_skill_annotations: ContentAnnotation[];
  reference_claude_md: string;
}

export interface AttackVector {
  id: string;
  name: string;
  prompt_line: string;
  blocked: boolean;
  reason: string;
}

export interface ConfigureBreakdown {
  score: number;
  max_score: number;
  constitution: { score: number; max_score: number; breakdown: Record<string, unknown> };
  skills: { score: number; max_score: number; breakdown: Record<string, unknown> };
  circuit_breakers: { score: number; max_score: number; breakdown: Record<string, unknown> };
  replay: { vectors: AttackVector[]; blocked_count: number; total_vectors: number; score: number; max_score: number };
}

export interface ConfigureSubmitResponse extends ConfigureBreakdown {
  team: string;
  achievements: string[];
}

export interface ConfigureResults {
  team: string;
  score: number;
  max_score: number;
  achievements: string[];
  breakdown: ConfigureBreakdown;
  vectors: AttackVector[];
}
