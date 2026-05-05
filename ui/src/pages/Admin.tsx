import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useWebSocket } from "../hooks/useWebSocket";
import type { TeamStatus, WsMessage } from "../types";
import Achievements from "../components/Achievements";

export default function Admin() {
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [teams, setTeams] = useState<TeamStatus[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const fetchTeams = useCallback(async () => {
    try {
      const res = (await api.listTeams()) as { teams: TeamStatus[] };
      setTeams(res.teams);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchTeams();
    const interval = setInterval(fetchTeams, 5000);
    return () => clearInterval(interval);
  }, [fetchTeams]);

  const handleWs = useCallback(
    (msg: WsMessage) => {
      if (
        msg.event === "team_joined" ||
        msg.event === "score_updated" ||
        msg.event === "exercise_reset"
      ) {
        fetchTeams();
      }
    },
    [fetchTeams],
  );

  useWebSocket(handleWs);

  const action = async (name: string, fn: () => Promise<unknown>) => {
    setLoading(name);
    setMessage(null);
    try {
      await fn();
      setMessage({ type: "ok", text: `${name} completed` });
      fetchTeams();
    } catch (err) {
      setMessage({ type: "err", text: `${name} failed: ${err}` });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-bold text-[var(--matrix-green)]">
        Facilitator Controls
      </h2>

      {message && (
        <div
          className={`text-sm p-3 rounded ${
            message.type === "ok"
              ? "bg-[var(--matrix-green)]/10 text-[var(--matrix-green)]"
              : "bg-[var(--matrix-red)]/10 text-[var(--matrix-red)]"
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-5">
        <h3 className="text-sm font-bold text-[var(--matrix-yellow)] uppercase tracking-wider mb-3">
          Countdown Timer
        </h3>
        <div className="flex items-end gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(Number(e.target.value))}
              className="w-24 bg-[var(--matrix-dark)] border border-[var(--matrix-border)] rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[var(--matrix-green)]"
            />
          </div>
          <button
            onClick={() =>
              action("Timer", () => api.startTimer(timerMinutes))
            }
            disabled={!!loading}
            className="bg-[var(--matrix-yellow)] text-black font-bold px-6 py-2 rounded text-sm hover:brightness-110 disabled:opacity-50"
          >
            {loading === "Timer" ? "Starting..." : "Start Timer"}
          </button>
          <button
            onClick={() => action("Stop Timer", () => api.stopTimer())}
            disabled={!!loading}
            className="bg-gray-700 text-gray-200 font-bold px-6 py-2 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
          >
            Stop
          </button>
        </div>
      </section>

      <section className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          Reset
        </h3>
        <button
          onClick={() => action("Reset", () => api.resetExercise())}
          disabled={!!loading}
          className="bg-gray-700 text-gray-200 font-bold px-6 py-2 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
        >
          {loading === "Reset" ? "Resetting..." : "Reset Exercise"}
        </button>
      </section>

      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          Teams ({teams.length})
        </h3>
        {teams.length === 0 ? (
          <p className="text-sm text-gray-500">
            No teams yet — teams appear here as they join.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {teams.map((t) => (
              <div
                key={t.team_id}
                className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded p-3"
              >
                <div className="text-sm font-mono text-gray-200">
                  {t.team_id}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {t.defenses_applied && (
                    <span className="text-[10px] text-[var(--matrix-green)]">
                      hardened
                    </span>
                  )}
                  {t.score !== null && (
                    <span className="text-[10px] text-[var(--matrix-blue)]">
                      {t.score} pts
                    </span>
                  )}
                </div>
                {t.achievements.length > 0 && (
                  <div className="mt-1">
                    <Achievements achievements={t.achievements} compact />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
