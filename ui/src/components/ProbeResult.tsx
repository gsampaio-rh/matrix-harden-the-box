import { SMITH_FLAVOR, CATEGORY } from "../constants";
import type { ProbeDetail } from "../types";

interface ProbeResultProps {
  probe: ProbeDetail;
}

export default function ProbeResult({ probe }: ProbeResultProps) {
  const flavor = SMITH_FLAVOR[probe.id];
  const isBlocked = probe.status === "BLOCKED";
  const isEscape = probe.id === "ESC-01";

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        isEscape && !isBlocked
          ? "border-[var(--matrix-red)]/50 bg-[var(--matrix-red)]/5"
          : isBlocked
            ? "border-[var(--matrix-green)]/30 bg-[var(--matrix-green)]/5"
            : "border-[var(--matrix-red)]/30 bg-[var(--matrix-red)]/5"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">{probe.id}</span>
          <span className="text-xs text-gray-600">
            {CATEGORY[probe.id]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEscape && !isBlocked && (
            <span className="text-[10px] uppercase text-[var(--matrix-red)] font-bold">
              unblockable
            </span>
          )}
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              isBlocked
                ? "bg-[var(--matrix-green)]/20 text-[var(--matrix-green)]"
                : "bg-[var(--matrix-red)]/20 text-[var(--matrix-red)]"
            }`}
          >
            {probe.status}
          </span>
          <span className="text-xs text-gray-500">
            {probe.points}/{probe.max_points}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-300 italic">
        "{flavor ? (isBlocked ? flavor.blocked : flavor.passed) : probe.status}"
      </p>
    </div>
  );
}
