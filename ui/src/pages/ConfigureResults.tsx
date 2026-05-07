import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Achievements from "../components/Achievements";
import { api } from "../api";
import type { ConfigureResults as ConfigureResultsType } from "../types";

export default function ConfigureResults() {
  const navigate = useNavigate();
  const teamId = localStorage.getItem("teamId");
  const [results, setResults] = useState<ConfigureResultsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      navigate("/login");
      return;
    }
    api
      .getConfigureResults(teamId)
      .then((r) => setResults(r))
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
      <div className="text-center space-y-3">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
          Harness Design Results — {results.team}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ScoreCard label="Awareness" score={breakdown?.awareness?.score ?? 0} max={12} color="var(--chapter-configure)" />
        <ScoreCard label="Coherence" score={breakdown?.coherence?.score ?? 0} max={10} color="var(--chapter-configure)" />
        <ScoreCard label="Philosophy" score={breakdown?.philosophy?.score ?? 0} max={5} color="var(--chapter-configure)" />
        <ScoreCard label="Completeness" score={breakdown?.completeness?.score ?? 0} max={3} color="var(--chapter-configure)" />
      </div>

      {breakdown?.coherence && (
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            Coherence Analysis
          </h3>
          <div className="space-y-2">
            {breakdown.coherence.reinforcements > 0 && (
              <div className="bg-[var(--matrix-green)]/5 border border-[var(--matrix-green)]/30 rounded p-3">
                <p className="text-sm text-[var(--matrix-green)] font-semibold">
                  {breakdown.coherence.reinforcements} reinforcing pair{breakdown.coherence.reinforcements > 1 ? "s" : ""} found
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Your decisions strengthen each other — they form a consistent philosophy.
                </p>
              </div>
            )}
            {breakdown.coherence.contradictions > 0 && (
              <div className="bg-[var(--matrix-red)]/5 border border-[var(--matrix-red)]/30 rounded p-3">
                <p className="text-sm text-[var(--matrix-red)] font-semibold">
                  {breakdown.coherence.contradictions} contradiction{breakdown.coherence.contradictions > 1 ? "s" : ""} detected
                </p>
                <ul className="mt-1 space-y-1">
                  {breakdown.coherence.contradiction_details.map((d, i) => (
                    <li key={i} className="text-xs text-gray-400">
                      {d.pair[0]} vs {d.pair[1]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {breakdown.coherence.reinforcements === 0 && breakdown.coherence.contradictions === 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded p-3">
                <p className="text-sm text-gray-400">
                  No strong reinforcements or contradictions detected in your choices.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="bg-[var(--chapter-configure)]/10 border border-[var(--chapter-configure)]/30 rounded-lg p-5">
        <p className="text-sm leading-relaxed" style={{ color: "var(--chapter-configure)" }}>
          <span className="font-bold">Key Insight:</span> Harness design is about allocating
          scarce resources — context, autonomy, human attention — between competing objectives.
          There is no universally correct answer. What matters is that your decisions form
          a <em>coherent philosophy</em> and you understand what you're trading away.
        </p>
      </div>

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
