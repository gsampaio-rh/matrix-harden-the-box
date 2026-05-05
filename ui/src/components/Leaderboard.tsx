import { useRef, useEffect, useState } from "react";
import Achievements from "./Achievements";
import type { TeamScore } from "../types";

interface LeaderboardProps {
  teams: TeamScore[];
  expandedTeam: string | null;
  onToggle: (team: string) => void;
  myTeam?: string | null;
}

const PODIUM_BORDERS = [
  "border-l-4 border-l-yellow-400",
  "border-l-4 border-l-gray-400",
  "border-l-4 border-l-amber-700",
];

export default function Leaderboard({
  teams,
  expandedTeam,
  onToggle,
  myTeam,
}: LeaderboardProps) {
  const prevRanksRef = useRef<Record<string, number>>({});
  const [rankChanges, setRankChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    const prevRanks = prevRanksRef.current;
    const changes: Record<string, number> = {};

    teams.forEach((team, idx) => {
      const prevIdx = prevRanks[team.team];
      if (prevIdx !== undefined) {
        changes[team.team] = prevIdx - idx;
      }
    });

    setRankChanges(changes);

    const newRanks: Record<string, number> = {};
    teams.forEach((team, idx) => {
      newRanks[team.team] = idx;
    });
    prevRanksRef.current = newRanks;
  }, [teams]);

  return (
    <div className="space-y-2">
      {teams.map((team, idx) => {
        const pct =
          team.max_score > 0 ? (team.score / team.max_score) * 100 : 0;
        const isExpanded = expandedTeam === team.team;
        const isMine = myTeam === team.team;
        const rankChange = rankChanges[team.team] ?? 0;

        return (
          <div
            key={team.team}
            className={`bg-[var(--matrix-card)] border rounded-lg overflow-hidden transition-all ${
              isMine
                ? "border-[var(--matrix-green)]/40 ring-1 ring-[var(--matrix-green)]/20"
                : "border-[var(--matrix-border)]"
            } ${idx < 3 ? PODIUM_BORDERS[idx] : ""}`}
          >
            <button
              onClick={() => onToggle(team.team)}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition"
            >
              <span className="text-lg font-bold text-gray-500 w-8 text-right">
                {idx + 1}
              </span>

              {rankChange !== 0 && (
                <span
                  className={`text-xs font-bold ${
                    rankChange > 0
                      ? "text-[var(--matrix-green)]"
                      : "text-[var(--matrix-red)]"
                  }`}
                >
                  {rankChange > 0 ? `+${rankChange}` : rankChange}
                </span>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-200">
                    {team.team}
                  </span>
                  {isMine && (
                    <span className="text-[10px] text-[var(--matrix-green)] font-bold">
                      YOU
                    </span>
                  )}
                </div>
                {team.achievements.length > 0 && (
                  <div className="mt-1">
                    <Achievements achievements={team.achievements} compact />
                  </div>
                )}
              </div>

              <div className="w-32 bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-[var(--matrix-green)] transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <AnimatedScore score={team.score} maxScore={team.max_score} />

              <span className="text-xs text-gray-500">
                {team.blocked_count}/{team.total_probes}
              </span>
            </button>

            {isExpanded && team.probes.length > 0 && (
              <div className="border-t border-[var(--matrix-border)] px-4 py-3 space-y-1">
                {team.probes.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="font-mono text-gray-400">{p.id}</span>
                    <span
                      className={
                        p.status === "BLOCKED"
                          ? "text-[var(--matrix-green)]"
                          : "text-[var(--matrix-red)]"
                      }
                    >
                      {p.status} ({p.points}/{p.max_points})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {teams.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No teams registered yet.
        </div>
      )}
    </div>
  );
}

function AnimatedScore({
  score,
  maxScore,
}: {
  score: number;
  maxScore: number;
}) {
  const [displayed, setDisplayed] = useState(score);
  const targetRef = useRef(score);

  useEffect(() => {
    targetRef.current = score;
    const step = Math.max(1, Math.abs(score - displayed));
    if (step <= 1) {
      setDisplayed(score);
      return;
    }
    const interval = setInterval(() => {
      setDisplayed((prev) => {
        const diff = targetRef.current - prev;
        if (Math.abs(diff) <= 1) {
          clearInterval(interval);
          return targetRef.current;
        }
        return prev + Math.sign(diff) * Math.max(1, Math.floor(Math.abs(diff) / 5));
      });
    }, 30);
    return () => clearInterval(interval);
  }, [score]);

  return (
    <span className="text-sm font-mono text-[var(--matrix-green)] w-16 text-right tabular-nums">
      {displayed}/{maxScore}
    </span>
  );
}
