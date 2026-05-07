import type {
  ConfigureContent,
  ConfigureResults,
  ConfigureSubmitResponse,
  Scenario,
  ScenarioAnswer,
  TeamResults,
  TeamScore,
  TeamStatus,
  TimerState,
} from "./types";


const BASE = "/api";

function getAdminKey(): string {
  return sessionStorage.getItem("adminKey") ?? "";
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || res.statusText);
  }
  return res.json();
}

async function adminRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const adminKey = getAdminKey();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (adminKey) headers["X-Admin-Key"] = adminKey;
  return request<T>(path, { ...options, headers });
}

export const api = {
  registerTeam: (teamId: string): Promise<{ team: string; status: string }> =>
    request("/teams/register", {
      method: "POST",
      body: JSON.stringify({ team_id: teamId }),
    }),

  getScenarios: (): Promise<{ scenarios: Scenario[] }> => request("/scenarios"),

  submitAnswers: (teamId: string, answers: ScenarioAnswer[]): Promise<TeamScore> =>
    request(`/contain/${teamId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  getTeamStatus: (teamId: string): Promise<TeamStatus> => request(`/teams/${teamId}/status`),

  getTeamResults: (teamId: string): Promise<TeamResults> => request(`/contain/results/${teamId}`),

  getLeaderboard: (): Promise<{ teams: TeamScore[] }> => request("/scores"),
  getTeamScore: (teamId: string): Promise<TeamScore> => request(`/scores/${teamId}`),

  resetExercise: (): Promise<{ status: string }> => adminRequest("/admin/reset", { method: "POST" }),

  listTeams: (): Promise<{ teams: Array<{ team: string; chapters: Record<string, { submitted: boolean; score: number; achievements: string[] }> }> }> =>
    adminRequest("/admin/teams"),

  startTimer: (durationMinutes: number): Promise<{ status: string; end_time: string }> =>
    adminRequest("/admin/timer", {
      method: "POST",
      body: JSON.stringify({ duration_minutes: durationMinutes }),
    }),

  stopTimer: (): Promise<{ status: string }> => adminRequest("/admin/timer", { method: "DELETE" }),

  getTimer: (): Promise<TimerState> => request("/teams/timer"),

  // ── Chapter 2 (Configure) — Harness Design ───────────────────────

  getConfigureContent: (): Promise<ConfigureContent> => request("/configure/content"),

  submitConfigure: (payload: {
    team_id: string;
    choices: Array<{ dimension_id: string; option_id: string; justification: string }>;
    philosophy: string;
  }): Promise<ConfigureSubmitResponse> =>
    request("/configure/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getConfigureResults: (teamId: string): Promise<ConfigureResults> => request(`/configure/results/${teamId}`),
};
