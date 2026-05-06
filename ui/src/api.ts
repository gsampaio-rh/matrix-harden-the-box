import type { ScenarioAnswer } from "./types";

const BASE = "/api";

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

export const api = {
  registerTeam: (teamId: string) =>
    request("/teams/register", {
      method: "POST",
      body: JSON.stringify({ team_id: teamId }),
    }),

  getScenarios: () => request("/scenarios"),

  submitAnswers: (teamId: string, answers: ScenarioAnswer[]) =>
    request(`/contain/${teamId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  getTeamStatus: (teamId: string) => request(`/teams/${teamId}/status`),

  getTeamResults: (teamId: string) => request(`/contain/results/${teamId}`),

  getLeaderboard: () => request("/scores"),
  getTeamScore: (teamId: string) => request(`/scores/${teamId}`),

  resetExercise: () => request("/admin/reset", { method: "POST" }),

  listTeams: () => request("/admin/teams"),

  startTimer: (durationMinutes: number) =>
    request("/admin/timer", {
      method: "POST",
      body: JSON.stringify({ duration_minutes: durationMinutes }),
    }),

  stopTimer: () => request("/admin/timer", { method: "DELETE" }),

  getTimer: () => request("/admin/timer"),

  // ── Chapter 2 (Configure) ────────────────────────────────────────

  getConfigureContent: () => request("/configure/content"),

  submitConfigure: (payload: {
    team_id: string;
    sections: Record<string, string>;
    skills: Record<string, string>;
    limits: { max_turns: number | null; bash_timeout: number | null; env_scrub: boolean };
  }) =>
    request("/configure/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getConfigureResults: (teamId: string) => request(`/configure/results/${teamId}`),
};
