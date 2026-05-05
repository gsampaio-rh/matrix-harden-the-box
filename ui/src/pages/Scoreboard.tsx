import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Leaderboard from "../components/Leaderboard";
import ProbeResult from "../components/ProbeResult";
import Achievements from "../components/Achievements";
import { useWebSocket } from "../hooks/useWebSocket";
import { api } from "../api";
import type { TeamScore, WsMessage, ProbeDetail } from "../types";

export default function Scoreboard() {
  const [teams, setTeams] = useState<TeamScore[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const teamId = sessionStorage.getItem("teamId");

  const fetchScores = useCallback(async () => {
    try {
      const res = (await api.getLeaderboard()) as { teams: TeamScore[] };
      setTeams(res.teams);
    } catch {
      /* ignore */
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
              connected
                ? "bg-[var(--matrix-green)]"
                : "bg-[var(--matrix-red)]"
            }`}
          />
          <span className="text-xs text-gray-500">
            {connected ? "Live" : "Reconnecting..."}
          </span>
        </div>
      </div>

      {myScore && myScore.probes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Your Results — {teamId}
              </h3>
              <Link
                to="/results"
                className="text-[10px] text-[var(--matrix-green)] hover:underline uppercase tracking-wider"
              >
                View Details
              </Link>
            </div>
            <span className="text-lg font-bold text-[var(--matrix-green)]">
              {myScore.score}/{myScore.max_score}
            </span>
          </div>
          {myScore.achievements.length > 0 && (
            <div className="mb-3">
              <Achievements achievements={myScore.achievements} />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {myScore.probes.map((p: ProbeDetail) => (
              <ProbeResult key={p.id} probe={p} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          Leaderboard
        </h3>
        <Leaderboard
          teams={teams}
          expandedTeam={expandedTeam}
          onToggle={(t) => setExpandedTeam(expandedTeam === t ? null : t)}
          myTeam={teamId}
        />
      </section>
    </div>
  );
}
