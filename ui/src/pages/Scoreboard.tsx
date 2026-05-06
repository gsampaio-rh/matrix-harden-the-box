import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Achievements from "../components/Achievements";
import { useWebSocket } from "../hooks/useWebSocket";
import { api } from "../api";
import type { TeamScore, WsMessage } from "../types";

export default function Scoreboard() {
  const [teams, setTeams] = useState<TeamScore[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const teamId = sessionStorage.getItem("teamId");

  const fetchScores = useCallback(async () => {
    try {
      const res = (await api.getLeaderboard()) as { teams: TeamScore[] };
      setTeams(res.teams);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const handleWs = useCallback(
    (msg: WsMessage) => {
      if (
        msg.event === "score_updated" ||
        msg.event === "scores_reset" ||
        msg.event === "exercise_reset" ||
        msg.event === "team_joined"
      ) {
        fetchScores();
      }
    },
    [fetchScores],
  );

  const { connected } = useWebSocket(handleWs);

  const myScore = teamId ? teams.find((t) => t.team === teamId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--matrix-green)]">
          Scoreboard
        </h2>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-[var(--matrix-green)]" : "bg-[var(--matrix-red)]"
            }`}
          />
          <span className="text-xs text-gray-500">
            {connected ? "Live" : "Reconnecting..."}
          </span>
        </div>
      </div>

      {myScore && (
        <section className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Your Progress — {teamId}
            </h3>
            <span className="text-lg font-bold text-[var(--matrix-green)]">
              {myScore.total_score}/{myScore.max_total}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ChapterCard
              label="Ch.1 — Contain"
              color="var(--chapter-contain)"
              score={myScore.chapters?.contain?.score ?? 0}
              maxScore={myScore.chapters?.contain?.max_score ?? 140}
              submitted={myScore.chapters?.contain?.submitted ?? false}
              link="/contain/results"
            />
            <ChapterCard
              label="Ch.2 — Configure"
              color="var(--chapter-configure)"
              score={myScore.chapters?.configure?.score ?? 0}
              maxScore={myScore.chapters?.configure?.max_score ?? 25}
              submitted={myScore.chapters?.configure?.submitted ?? false}
              link="/configure/results"
            />
          </div>
          {myScore.achievements.length > 0 && (
            <div className="mt-3">
              <Achievements achievements={myScore.achievements} />
            </div>
          )}
        </section>
      )}

      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          Leaderboard
        </h3>
        <div className="space-y-1">
          {teams.map((t, i) => (
            <div
              key={t.team}
              role="button"
              tabIndex={0}
              aria-expanded={expandedTeam === t.team}
              aria-label={`${t.team}: total score ${t.total_score}`}
              className={`bg-[var(--matrix-card)] border rounded-lg overflow-hidden transition-all cursor-pointer ${
                t.team === teamId
                  ? "border-[var(--matrix-green)]/30"
                  : "border-[var(--matrix-border)]"
              }`}
              onClick={() => setExpandedTeam(expandedTeam === t.team ? null : t.team)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setExpandedTeam(expandedTeam === t.team ? null : t.team);
                }
              }}
            >
              <div className="flex items-center gap-4 px-4 py-3">
                <span className="text-sm font-mono text-gray-600 w-6">{i + 1}</span>
                <span className="text-sm font-bold text-gray-200 flex-1">{t.team}</span>
                <div className="flex items-center gap-4 text-xs">
                  <span style={{ color: "var(--chapter-contain)" }}>
                    {t.chapters?.contain?.score ?? 0}
                  </span>
                  <span style={{ color: "var(--chapter-configure)" }}>
                    {t.chapters?.configure?.score ?? 0}
                  </span>
                  <span className="font-bold text-sm text-[var(--matrix-green)]">
                    {t.total_score}
                  </span>
                </div>
              </div>
              {expandedTeam === t.team && (
                <div className="px-4 pb-3 border-t border-[var(--matrix-border)] pt-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Ch.1 Contain:</span>{" "}
                      <span style={{ color: "var(--chapter-contain)" }}>
                        {t.chapters?.contain?.score ?? 0}/{t.chapters?.contain?.max_score ?? 140}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ch.2 Configure:</span>{" "}
                      <span style={{ color: "var(--chapter-configure)" }}>
                        {t.chapters?.configure?.score ?? 0}/{t.chapters?.configure?.max_score ?? 25}
                      </span>
                    </div>
                  </div>
                  {t.achievements.length > 0 && (
                    <div className="mt-2">
                      <Achievements achievements={t.achievements} compact />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {teams.length === 0 && (
            <p className="text-sm text-gray-500 py-4 text-center">No teams yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function ChapterCard({
  label,
  color,
  score,
  maxScore,
  submitted,
  link,
}: {
  label: string;
  color: string;
  score: number;
  maxScore: number;
  submitted: boolean;
  link: string;
}) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="p-3 rounded border" style={{ borderColor: color + "30" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
        {submitted && (
          <Link to={link} className="text-[10px] hover:underline" style={{ color }}>
            Details
          </Link>
        )}
      </div>
      {submitted ? (
        <>
          <div className="text-lg font-bold tabular-nums" style={{ color }}>
            {score}<span className="text-gray-600 text-sm">/{maxScore}</span>
            <span className="text-gray-700 text-xs ml-1">({pct}%)</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1 mt-1">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
          </div>
        </>
      ) : (
        <span className="text-xs text-gray-600">Not started</span>
      )}
    </div>
  );
}
