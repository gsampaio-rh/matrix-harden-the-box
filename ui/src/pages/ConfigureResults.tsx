import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Achievements from "../components/Achievements";
import { api } from "../api";
import type { ConfigureResults as ConfigureResultsType, AttackVector, ConfigureContent } from "../types";

export default function ConfigureResults() {
  const navigate = useNavigate();
  const teamId = sessionStorage.getItem("teamId");
  const [results, setResults] = useState<ConfigureResultsType | null>(null);
  const [reference, setReference] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      navigate("/login");
      return;
    }
    Promise.all([
      api.getConfigureResults(teamId).then((r) => setResults(r as ConfigureResultsType)),
      api.getConfigureContent().then((c) => setReference((c as ConfigureContent).reference_claude_md)),
    ])
      .catch(() => navigate("/configure/exercise"))
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

  const { breakdown } = results;
  const pct = results.max_score > 0 ? Math.round((results.score / results.max_score) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Score header */}
      <div className="text-center space-y-3">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
          Chapter 2 Results — {results.team}
        </h2>
        <div className="text-5xl font-bold tabular-nums">
          <span style={{ color: pct >= 80 ? "var(--matrix-green)" : pct > 40 ? "var(--matrix-yellow)" : "var(--matrix-red)" }}>
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

      {/* Section breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ScoreCard label="Constitution" score={breakdown?.constitution?.score ?? 0} max={10} color="var(--chapter-configure)" />
        <ScoreCard label="Skills" score={breakdown?.skills?.score ?? 0} max={6} color="var(--chapter-configure)" />
        <ScoreCard label="Circuit Breakers" score={breakdown?.circuit_breakers?.score ?? 0} max={3} color="var(--chapter-configure)" />
        <ScoreCard label="Replay Test" score={breakdown?.replay?.score ?? 0} max={6} color="var(--chapter-configure)" />
      </div>

      {/* Attack vectors */}
      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          Attack Vector Results
        </h3>
        <div className="space-y-2">
          {(results.vectors || []).map((v: AttackVector) => (
            <div
              key={v.id}
              className={`flex items-start gap-3 px-4 py-3 rounded border ${
                v.blocked
                  ? "border-[var(--matrix-green)]/30 bg-[var(--matrix-green)]/5"
                  : "border-[var(--matrix-red)]/30 bg-[var(--matrix-red)]/5"
              }`}
            >
              <span className={`text-sm mt-0.5 ${v.blocked ? "text-[var(--matrix-green)]" : "text-[var(--matrix-red)]"}`}>
                {v.blocked ? "✓" : "✗"}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-200">{v.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    v.blocked
                      ? "bg-[var(--matrix-green)]/20 text-[var(--matrix-green)]"
                      : "bg-[var(--matrix-red)]/20 text-[var(--matrix-red)]"
                  }`}>
                    {v.blocked ? "BLOCKED" : "PASSED"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{v.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reference comparison */}
      {reference && (
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            Reference: Defensive CLAUDE.md
          </h3>
          <div className="bg-[var(--matrix-dark)] border border-[var(--matrix-green)]/20 rounded-lg p-4">
            <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono leading-relaxed">
              {reference}
            </pre>
          </div>
        </section>
      )}

      {/* Key insight */}
      <div className="bg-[var(--chapter-configure)]/10 border border-[var(--chapter-configure)]/30 rounded-lg p-5">
        <p className="text-sm leading-relaxed" style={{ color: "var(--chapter-configure)" }}>
          <span className="font-bold">Key Insight:</span> Configuration defines <em>INTENT</em>.
          It tells the agent what it <em>should</em> do. But CLAUDE.md can be overwritten —
          the agent follows it because it chooses to, not because it's enforced.
          You need <strong>guardrails</strong> to enforce what the agent <strong>MUST NOT</strong> do.
          That's Chapter 4.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 pb-8">
        <button
          onClick={() => navigate("/scoreboard")}
          className="font-bold px-8 py-3 rounded hover:brightness-110 transition text-black"
          style={{ backgroundColor: "var(--chapter-configure)" }}
        >
          View Scoreboard
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-800 text-gray-300 font-bold px-8 py-3 rounded hover:bg-gray-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  max,
  color,
}: {
  label: string;
  score: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;

  return (
    <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-4 text-center">
      <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
        {label}
      </div>
      <div className="text-2xl font-bold tabular-nums" style={{ color }}>
        {score}<span className="text-gray-600 text-sm">/{max}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
