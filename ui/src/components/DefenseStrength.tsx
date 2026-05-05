import { useMemo } from "react";
import { PROBE_POINTS } from "../constants";
import type { DefenseConfig } from "../types";

interface DefenseStrengthProps {
  config: DefenseConfig;
}

interface CategoryScore {
  label: string;
  earned: number;
  max: number;
}

function evaluateClientSide(config: DefenseConfig): Record<string, boolean> {
  const net = config.network_policy;
  const rbac = config.rbac;
  const sec = config.security_context;

  return {
    "NET-01": net.denyAllEgress,
    "NET-02": net.denyAllEgress,
    "NET-03": net.denyAllIngress,
    "RBAC-01": rbac.deleteClusterRoleBinding,
    "RBAC-02":
      rbac.createNamespacedRole &&
      !rbac.allowedResources.includes("secrets"),
    "RBAC-03":
      rbac.createNamespacedRole && !rbac.allowedVerbs.includes("delete"),
    "SEC-01": sec.readOnlyRootFilesystem,
    "SEC-02": sec.runAsNonRoot,
    "ESC-01": false,
  };
}

export default function DefenseStrength({ config }: DefenseStrengthProps) {
  const blocked = useMemo(() => evaluateClientSide(config), [config]);

  const totalMax = Object.values(PROBE_POINTS).reduce((a, b) => a + b, 0);
  const totalEarned = Object.entries(blocked).reduce(
    (sum, [id, b]) => sum + (b ? (PROBE_POINTS[id] ?? 0) : 0),
    0,
  );
  const pct = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;

  const categories: CategoryScore[] = useMemo(() => {
    const cats: Record<string, CategoryScore> = {
      Network: { label: "Network", earned: 0, max: 0 },
      RBAC: { label: "RBAC", earned: 0, max: 0 },
      Security: { label: "Security", earned: 0, max: 0 },
    };

    for (const [id, pts] of Object.entries(PROBE_POINTS)) {
      const cat = id.startsWith("NET")
        ? "Network"
        : id.startsWith("RBAC")
          ? "RBAC"
          : id.startsWith("SEC")
            ? "Security"
            : null;
      if (!cat) continue;
      cats[cat].max += pts;
      if (blocked[id]) cats[cat].earned += pts;
    }

    return Object.values(cats);
  }, [blocked]);

  const color =
    pct >= 70
      ? "var(--matrix-green)"
      : pct >= 30
        ? "var(--matrix-yellow)"
        : "var(--matrix-red)";

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
        Defense Strength
      </h3>

      <div className="flex justify-center">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-2xl font-bold tabular-nums transition-colors duration-300"
              style={{ color }}
            >
              {Math.round(pct)}%
            </span>
            <span className="text-[10px] text-gray-500">
              {totalEarned}/{totalMax} pts
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const catPct = cat.max > 0 ? (cat.earned / cat.max) * 100 : 0;
          const catColor =
            catPct >= 70
              ? "var(--matrix-green)"
              : catPct >= 30
                ? "var(--matrix-yellow)"
                : "var(--matrix-red)";

          return (
            <div key={cat.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">{cat.label}</span>
                <span className="text-xs text-gray-500">
                  {cat.earned}/{cat.max}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${catPct}%`,
                    backgroundColor: catColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-3">
        <h4 className="text-xs text-gray-500 mb-2">Probe Coverage</h4>
        <div className="grid grid-cols-3 gap-1">
          {Object.entries(blocked).map(([id, b]) => (
            <div
              key={id}
              className={`text-[10px] font-mono px-2 py-1 rounded text-center transition-colors duration-200 ${
                b
                  ? "bg-[var(--matrix-green)]/10 text-[var(--matrix-green)]"
                  : "bg-gray-800 text-gray-600"
              }`}
            >
              {id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
