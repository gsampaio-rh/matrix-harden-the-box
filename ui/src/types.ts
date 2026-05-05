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

export interface TeamScore {
  team: string;
  score: number;
  max_score: number;
  blocked_count: number;
  total_probes: number;
  probes: ProbeDetail[];
  achievements: string[];
}

export interface TeamStatus {
  team_id: string;
  submitted: boolean;
  score: number | null;
  achievements: string[];
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
