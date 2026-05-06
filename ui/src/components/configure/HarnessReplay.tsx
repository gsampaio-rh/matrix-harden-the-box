import { useState, useEffect, useCallback } from "react";
import type { AttackVector } from "../../types";

interface HarnessReplayProps {
  vectors: AttackVector[];
  onComplete: () => void;
}

type VectorState = "pending" | "scanning" | "revealed";

export default function HarnessReplay({ vectors, onComplete }: HarnessReplayProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentState, setCurrentState] = useState<VectorState>("scanning");
  const [phase, setPhase] = useState<"vectors" | "summary">("vectors");

  useEffect(() => {
    if (phase !== "vectors") return;
    if (revealedCount >= vectors.length) {
      setPhase("summary");
      return;
    }

    setCurrentState("scanning");
    let revealTimer: ReturnType<typeof setTimeout>;
    const scanTimer = setTimeout(() => {
      setCurrentState("revealed");
      revealTimer = setTimeout(() => {
        setRevealedCount((c) => c + 1);
      }, 800);
    }, 1000);

    return () => {
      clearTimeout(scanTimer);
      clearTimeout(revealTimer);
    };
  }, [revealedCount, vectors.length, phase]);

  const blockedCount = vectors.filter((v) => v.blocked).length;

  const handleDismiss = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold" style={{ color: "var(--chapter-configure)" }}>
          Test Your Harness
        </h3>
        <p className="text-sm text-gray-400">
          Replaying the prologue attack against your configuration...
        </p>
      </div>

      <div className="bg-[var(--matrix-dark)] border border-[var(--matrix-border)] rounded-lg p-4 space-y-2">
        <div className="text-xs text-gray-600 font-mono mb-3">
          $ replay --config CLAUDE.md --attack prologue-kill-chain
        </div>

        {vectors.map((vector, idx) => (
          <VectorRow
            key={vector.id}
            vector={vector}
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

      {phase === "summary" && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center">
            <div className="text-3xl font-bold tabular-nums">
              <span className={blockedCount >= 4 ? "text-[var(--matrix-green)]" : blockedCount > 0 ? "text-[var(--matrix-yellow)]" : "text-[var(--matrix-red)]"}>
                {blockedCount}
              </span>
              <span className="text-gray-600 text-xl">/{vectors.length}</span>
              <span className="text-sm text-gray-500 ml-2">vectors mitigated</span>
            </div>
          </div>

          {blockedCount < vectors.length && (
            <div className="bg-[var(--matrix-yellow)]/10 border border-[var(--matrix-yellow)]/30 rounded-lg p-4">
              <p className="text-xs text-[var(--matrix-yellow)] leading-relaxed">
                <span className="font-bold">Key Insight:</span> CLAUDE.md reduces blast radius but does NOT
                fully prevent prompt injection. The agent follows configuration because it <em>chooses</em> to —
                there's no enforcement mechanism. You need <strong>guardrails</strong> to enforce what the agent
                MUST NOT do. That's Chapter 4.
              </p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleDismiss}
              className="font-bold px-8 py-3 rounded hover:brightness-110 transition text-black"
              style={{ backgroundColor: "var(--chapter-configure)" }}
            >
              View Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function VectorRow({ vector, state }: { vector: AttackVector; state: VectorState }) {
  if (state === "pending") {
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded border border-gray-800/50 opacity-30">
        <span className="text-xs text-gray-600 flex-1 font-mono">{vector.name}</span>
      </div>
    );
  }

  if (state === "scanning") {
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded border border-[var(--matrix-yellow)]/30 bg-[var(--matrix-yellow)]/5 animate-pulse">
        <span className="text-xs text-gray-400 flex-1 font-mono">
          Testing: {vector.prompt_line}
        </span>
        <span className="text-xs text-[var(--matrix-yellow)]">...</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 px-3 py-2 rounded border transition-all duration-300 ${
        vector.blocked
          ? "border-[var(--matrix-green)]/30 bg-[var(--matrix-green)]/5"
          : "border-[var(--matrix-red)]/30 bg-[var(--matrix-red)]/5"
      }`}
    >
      <span className={`text-sm mt-0.5 ${vector.blocked ? "text-[var(--matrix-green)]" : "text-[var(--matrix-red)]"}`}>
        {vector.blocked ? "✓" : "✗"}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-300">{vector.name}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            vector.blocked
              ? "bg-[var(--matrix-green)]/20 text-[var(--matrix-green)]"
              : "bg-[var(--matrix-red)]/20 text-[var(--matrix-red)]"
          }`}>
            {vector.blocked ? "BLOCKED" : "PASSED"}
          </span>
        </div>
        <p className="text-[10px] text-gray-500 mt-0.5">{vector.reason}</p>
      </div>
    </div>
  );
}
