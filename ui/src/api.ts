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

  applyDefenses: (teamId: string, config: unknown) =>
    request(`/teams/${teamId}/defenses`, {
      method: "POST",
      body: JSON.stringify(config),
    }),

  getDefenses: (teamId: string) => request(`/teams/${teamId}/defenses`),

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
