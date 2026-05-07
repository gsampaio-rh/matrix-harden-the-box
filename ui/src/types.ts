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

// ── Chapter 2 types — Harness Design Trade-offs ─────────────────────

export interface DimensionOption {
  id: string;
  label: string;
  description: string;
  pros: string;
  cons: string;
}

export interface Dimension {
  id: string;
  title: string;
  question: string;
  source: string;
  options: DimensionOption[];
  tradeoff_summary: string;
}

export interface BriefingChallenge {
  text: string;
  source: string;
}

export interface Briefing {
  title: string;
  scenario: string;
  challenges: BriefingChallenge[];
  prompt: string;
}

export interface ConfigureContent {
  briefing: Briefing;
  dimensions: Dimension[];
}

export interface DimensionChoice {
  dimension_id: string;
  option_id: string;
  justification: string;
}

export interface ConfigureBreakdown {
  score: number;
  max_score: number;
  awareness: { score: number; max_score: number; breakdown: Record<string, unknown> };
  coherence: {
    score: number;
    max_score: number;
    reinforcements: number;
    contradictions: number;
    reinforcement_details: Array<{ pair: string[] }>;
    contradiction_details: Array<{ pair: string[] }>;
  };
  philosophy: { score: number; max_score: number; breakdown: Record<string, unknown> };
  completeness: { score: number; max_score: number; all_dimensions_answered: boolean; all_justified: boolean };
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
}
