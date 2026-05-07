import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Achievements from "../components/Achievements";
import NetEgressDiagram from "../components/illustrations/NetEgressDiagram";
import NetIngressDiagram from "../components/illustrations/NetIngressDiagram";
import RbacCrbDiagram from "../components/illustrations/RbacCrbDiagram";
import RbacSecretsDiagram from "../components/illustrations/RbacSecretsDiagram";
import SecRootDiagram from "../components/illustrations/SecRootDiagram";
import SecFilesystemDiagram from "../components/illustrations/SecFilesystemDiagram";
import SecCapsDiagram from "../components/illustrations/SecCapsDiagram";
import { api } from "../api";
import type { TeamResults, ScenarioResult } from "../types";

const CATEGORY_COLORS: Record<string, string> = {
  Network: "var(--matrix-blue)",
  RBAC: "var(--matrix-yellow)",
  SecurityContext: "var(--matrix-green)",
};

const SCENARIO_ILLUSTRATION: Record<string, React.ComponentType<{ className?: string }>> = {
  "net-egress": NetEgressDiagram,
  "net-ingress": NetIngressDiagram,
  "rbac-crb": RbacCrbDiagram,
  "rbac-secrets": RbacSecretsDiagram,
  "sec-root": SecRootDiagram,
  "sec-filesystem": SecFilesystemDiagram,
  "sec-capabilities": SecCapsDiagram,
};

export default function Results() {
  const navigate = useNavigate();
  const teamId = localStorage.getItem("teamId");
  const [results, setResults] = useState<TeamResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      navigate("/login");
      return;
    }
    api
      .getTeamResults(teamId)
      .then((res) => setResults(res as TeamResults))
      .catch(() => navigate("/contain/exercise"))
      .finally(() => setLoading(false));
  }, [teamId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading results...</p>
      </div>
    );
  }

  if (!results) return null;

  const pct = results.max_score > 0
    ? Math.round((results.score / results.max_score) * 100)
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Score header */}
      <div className="text-center space-y-3">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
          Results — {results.team}
        </h2>
        <div className="text-5xl font-bold tabular-nums">
          <span
            className={
              results.score >= results.max_score
                ? "text-[var(--matrix-green)]"
                : results.score > 0
                  ? "text-[var(--matrix-yellow)]"
                  : "text-[var(--matrix-red)]"
            }
          >
            {results.score}
          </span>
          <span className="text-gray-600 text-3xl">/{results.max_score}</span>
          <span className="text-gray-700 text-lg ml-2">({pct}%)</span>
        </div>
        {results.achievements.length > 0 && (
          <div className="flex justify-center">
            <Achievements achievements={results.achievements} />
          </div>
        )}
      </div>

      {/* Scenario breakdown */}
      <div className="space-y-4">
        {results.scenarios.map((scenario, idx) => (
          <ScenarioCard key={scenario.id} scenario={scenario} index={idx} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 pb-8">
        <button
          onClick={() => navigate("/scoreboard")}
          className="bg-[var(--matrix-green)] text-black font-bold px-8 py-3 rounded hover:brightness-110 transition"
        >
          View Scoreboard
        </button>
      </div>
    </div>
  );
}

function ScenarioCard({
  scenario,
  index,
}: {
  scenario: ScenarioResult;
  index: number;
}) {
  const Illustration = SCENARIO_ILLUSTRATION[scenario.id];
  const catColor = CATEGORY_COLORS[scenario.category] ?? "var(--matrix-blue)";

  return (
    <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 font-mono">{index + 1}.</span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: catColor }}
          >
            {scenario.category}
          </span>
          <span className="text-sm font-bold text-gray-200">
            {scenario.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-bold tabular-nums ${
              scenario.is_best
                ? "text-[var(--matrix-green)]"
                : "text-[var(--matrix-red)]"
            }`}
          >
            {scenario.points_earned}/{scenario.max_points}
          </span>
          {scenario.is_best && (
            <span className="text-[10px] bg-[var(--matrix-green)]/10 text-[var(--matrix-green)] px-2 py-0.5 rounded-full font-bold">
              BEST
            </span>
          )}
        </div>
      </div>

      <div className="px-5 pb-4 space-y-3">
        {/* Illustration */}
        {Illustration && (
          <Illustration className="hidden sm:block w-full max-w-[200px] opacity-60" />
        )}

        {/* Answer comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Your answer */}
          <div
            className={`p-3 rounded border text-sm ${
              scenario.is_best
                ? "border-[var(--matrix-green)]/30 bg-[var(--matrix-green)]/5"
                : "border-[var(--matrix-red)]/30 bg-[var(--matrix-red)]/5"
            }`}
          >
            <div
              className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                scenario.is_best
                  ? "text-[var(--matrix-green)]"
                  : "text-[var(--matrix-red)]"
              }`}
            >
              Your Answer ({scenario.selected_option?.toUpperCase() ?? "—"})
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {scenario.selected_label ?? "Skipped"}
            </p>
          </div>

          {/* Best answer (only shown if different) */}
          {!scenario.is_best && (
            <div className="p-3 rounded border border-[var(--matrix-green)]/30 bg-[var(--matrix-green)]/5">
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[var(--matrix-green)]">
                Best Answer ({scenario.best_option.toUpperCase()})
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {scenario.best_label}
              </p>
            </div>
          )}
        </div>

        {/* Explanation */}
        <div className="text-xs text-gray-500 leading-relaxed border-t border-[var(--matrix-border)] pt-3">
          <span className="text-gray-400 font-bold">Why? </span>
          {scenario.explanation}
        </div>
      </div>
    </div>
  );
}
