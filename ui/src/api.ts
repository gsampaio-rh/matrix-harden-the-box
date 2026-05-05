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
    request(`/teams/${teamId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  getTeamStatus: (teamId: string) => request(`/teams/${teamId}/status`),

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
};
