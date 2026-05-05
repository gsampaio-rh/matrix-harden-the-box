import { useState, useEffect, useCallback } from "react";
import { SMITH_FLAVOR, CATEGORY } from "../constants";
import type { ProbeDetail, TeamScore } from "../types";

interface AttackSimulationProps {
  scoreData: TeamScore;
  onComplete: () => void;
}

type ProbeState = "pending" | "scanning" | "revealed";

export default function AttackSimulation({
  scoreData,
  onComplete,
}: AttackSimulationProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentState, setCurrentState] = useState<ProbeState>("scanning");
  const [displayedScore, setDisplayedScore] = useState(0);
  const [phase, setPhase] = useState<"probes" | "score" | "done">("probes");

  const probes = scoreData.probes;

  useEffect(() => {
    if (phase !== "probes") return;
    if (revealedCount >= probes.length) {
      setPhase("score");
      return;
    }

    setCurrentState("scanning");
    let revealTimer: ReturnType<typeof setTimeout>;
    const scanTimer = setTimeout(() => {
      setCurrentState("revealed");
      revealTimer = setTimeout(() => {
        setRevealedCount((c) => c + 1);
      }, 600);
    }, 800);

    return () => {
      clearTimeout(scanTimer);
      clearTimeout(revealTimer);
    };
  }, [revealedCount, probes.length, phase]);

  useEffect(() => {
    if (phase !== "score") return;
    const target = scoreData.score;
    if (target === 0) {
      setPhase("done");
      return;
    }
    const step = Math.max(1, Math.floor(target / 20));
    const interval = setInterval(() => {
      setDisplayedScore((prev) => {
        const next = prev + step;
        if (next >= target) {
          clearInterval(interval);
          setPhase("done");
          return target;
        }
        return next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [phase, scoreData.score]);

  const handleDismiss = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <div className="w-full max-w-2xl px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--matrix-red)] tracking-widest mb-1">
            AGENT SMITH
          </h2>
          <p className="text-sm text-gray-500">Scanning defenses...</p>
        </div>

        <div className="space-y-2 mb-8">
          {probes.map((probe, idx) => (
            <ProbeRow
              key={probe.id}
              probe={probe}
              state={
                idx < revealedCount
                  ? "revealed"
                  : idx === revealedCount
                    ? currentState
                    : "pending"
              }
            />
          ))}
        </div>

        {phase === "score" || phase === "done" ? (
          <div className="text-center space-y-4">
            <div className="text-5xl font-bold tabular-nums">
              <span
                className={
                  displayedScore >= scoreData.max_score
                    ? "text-[var(--matrix-green)]"
                    : displayedScore > 0
                      ? "text-[var(--matrix-yellow)]"
                      : "text-[var(--matrix-red)]"
                }
              >
                {displayedScore}
              </span>
              <span className="text-gray-600 text-3xl">
                /{scoreData.max_score}
              </span>
            </div>

            {phase === "done" && scoreData.achievements.length > 0 && (
              <div className="flex justify-center gap-3 mt-2">
                {scoreData.achievements.map((a) => (
                  <span
                    key={a}
                    className="text-xs bg-[var(--matrix-green)]/10 text-[var(--matrix-green)] px-3 py-1 rounded-full"
                  >
                    {a.replace(/_/g, " ").toUpperCase()}
                  </span>
                ))}
              </div>
            )}

            {phase === "done" && (
              <button
                onClick={handleDismiss}
                className="mt-4 bg-[var(--matrix-green)] text-black font-bold px-8 py-3 rounded hover:brightness-110 transition"
              >
                View Results
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ProbeRow({
  probe,
  state,
}: {
  probe: ProbeDetail;
  state: ProbeState;
}) {
  const flavor = SMITH_FLAVOR[probe.id];
  const isBlocked = probe.status === "BLOCKED";

  if (state === "pending") {
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded border border-gray-800/50 opacity-30">
        <span className="text-xs font-mono text-gray-600 w-16">{probe.id}</span>
        <span className="text-xs text-gray-700">{CATEGORY[probe.id]}</span>
      </div>
    );
  }

  if (state === "scanning") {
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded border border-[var(--matrix-yellow)]/30 bg-[var(--matrix-yellow)]/5 animate-pulse">
        <span className="text-xs font-mono text-[var(--matrix-yellow)] w-16">
          {probe.id}
        </span>
        <span className="text-xs text-gray-400 flex-1 italic">
          {flavor?.before ?? "Scanning..."}
        </span>
        <span className="text-xs text-[var(--matrix-yellow)]">...</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded border transition-all duration-300 ${
        isBlocked
          ? "border-[var(--matrix-green)]/30 bg-[var(--matrix-green)]/5"
          : "border-[var(--matrix-red)]/30 bg-[var(--matrix-red)]/5"
      }`}
    >
      <span className="text-xs font-mono text-gray-400 w-16">{probe.id}</span>
      <span className="text-xs text-gray-500 italic flex-1">
        "{flavor ? (isBlocked ? flavor.blocked : flavor.passed) : probe.status}"
      </span>
      <span
        className={`text-xs font-bold px-2 py-0.5 rounded ${
          isBlocked
            ? "bg-[var(--matrix-green)]/20 text-[var(--matrix-green)]"
            : "bg-[var(--matrix-red)]/20 text-[var(--matrix-red)]"
        }`}
      >
        {probe.status}
      </span>
      <span className="text-xs text-gray-600 w-10 text-right">
        {probe.points}/{probe.max_points}
      </span>
    </div>
  );
}
