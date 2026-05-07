import { useState, useEffect } from "react";
import { api } from "../api";

interface AdminTeam {
  team: string;
  chapters: Record<string, { submitted: boolean; score: number; achievements: string[] }>;
}

export default function Admin() {
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [timerActive, setTimerActive] = useState(false);
  const [duration, setDuration] = useState(20);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState("");

  const refresh = async () => {
    try {
      const t = (await api.listTeams()) as { teams: AdminTeam[] };
      setTeams(t.teams);
      const timer = (await api.getTimer()) as { active: boolean; end_time: string | null };
      setTimerActive(timer.active);
      setEndTime(timer.end_time);
    } catch (err) {
      if (err instanceof Error && err.message.includes("admin key")) {
        setAuthenticated(false);
        sessionStorage.removeItem("adminKey");
        return;
      }
      console.error("Failed to refresh admin data:", err);
    }
  };

  const handleLogin = async () => {
    sessionStorage.setItem("adminKey", keyInput);
    try {
      await api.listTeams();
      setAuthenticated(true);
      refresh();
    } catch {
      sessionStorage.removeItem("adminKey");
      setMessage("Invalid admin key");
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("adminKey");
    if (stored) {
      setAuthenticated(true);
      refresh();
    } else {
      api.listTeams()
        .then(() => {
          setAuthenticated(true);
          refresh();
        })
        .catch(() => setAuthenticated(false));
    }
  }, []);

  const handleStartTimer = async () => {
    try {
      await api.startTimer(duration);
      setMessage(`Timer started: ${duration} min`);
      refresh();
    } catch (err) {
      setMessage(`Failed to start timer: ${err}`);
    }
  };

  const handleStopTimer = async () => {
    try {
      await api.stopTimer();
      setMessage("Timer stopped");
      refresh();
    } catch (err) {
      setMessage(`Failed to stop timer: ${err}`);
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset all data? This cannot be undone.")) return;
    try {
      await api.resetExercise();
      setMessage("Exercise reset complete");
      refresh();
    } catch (err) {
      setMessage(`Failed to reset: ${err}`);
    }
  };

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-8 w-full max-w-md space-y-4">
          <h2 className="text-[var(--matrix-green)] text-xl font-bold text-center">Admin Access</h2>
          {message && (
            <div className="text-sm p-3 rounded bg-[var(--matrix-red)]/10 text-[var(--matrix-red)]">
              {message}
            </div>
          )}
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Admin key"
            className="w-full bg-[var(--matrix-dark)] border border-[var(--matrix-border)] rounded px-4 py-2.5 text-[var(--matrix-green)] placeholder-gray-600 focus:outline-none focus:border-[var(--matrix-green)] font-mono"
            autoFocus
          />
          <button
            onClick={handleLogin}
            disabled={!keyInput}
            className="w-full bg-[var(--matrix-green)] text-black font-bold py-2.5 rounded hover:brightness-110 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-xl font-bold text-[var(--matrix-green)]">Facilitator Controls</h2>

      {message && (
        <div className="bg-[var(--matrix-green)]/10 text-[var(--matrix-green)] text-sm px-4 py-2 rounded">
          {message}
        </div>
      )}

      {/* Timer */}
      <section className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Timer</h3>
        {timerActive ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-300">
              Ends at: <span className="font-mono text-[var(--matrix-green)]">{endTime}</span>
            </p>
            <button onClick={handleStopTimer} className="bg-[var(--matrix-red)] text-white font-bold px-6 py-2 rounded hover:brightness-110 transition">
              Stop Timer
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={1}
              max={120}
              className="w-20 bg-[var(--matrix-dark)] border border-[var(--matrix-border)] rounded px-3 py-2 text-sm text-gray-200 font-mono"
            />
            <span className="text-sm text-gray-500">minutes</span>
            <button onClick={handleStartTimer} className="bg-[var(--matrix-green)] text-black font-bold px-6 py-2 rounded hover:brightness-110 transition">
              Start Timer
            </button>
          </div>
        )}
      </section>

      {/* Reset */}
      <section className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Exercise Reset</h3>
        <p className="text-xs text-gray-500">Clears all teams, scores, and timer.</p>
        <button onClick={handleReset} className="bg-[var(--matrix-red)] text-white font-bold px-6 py-2 rounded hover:brightness-110 transition">
          Reset All
        </button>
      </section>

      {/* Teams */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Teams ({teams.length})
          </h3>
          <button onClick={refresh} className="text-xs text-gray-500 hover:text-gray-300 underline">
            Refresh
          </button>
        </div>
        {teams.length === 0 ? (
          <p className="text-sm text-gray-500">No teams registered.</p>
        ) : (
          <div className="space-y-2">
            {teams.map((t) => (
              <div
                key={t.team}
                className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-200">{t.team}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Ch.1 Contain: </span>
                    <span style={{ color: "var(--chapter-contain)" }}>
                      {t.chapters?.contain?.submitted ? `${t.chapters.contain.score} pts` : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ch.2 Configure: </span>
                    <span style={{ color: "var(--chapter-configure)" }}>
                      {t.chapters?.configure?.submitted ? `${t.chapters.configure.score} pts` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
