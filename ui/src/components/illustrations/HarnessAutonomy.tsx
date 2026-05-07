interface Props {
  className?: string;
}

export default function HarnessAutonomy({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="18" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" fontWeight="bold">BLAST RADIUS BY AUTONOMY LEVEL</text>

      {/* Concentric circles — blast radius */}
      <circle cx="160" cy="115" r="80" fill="var(--matrix-red)" opacity="0.06"
        stroke="var(--matrix-red)" strokeWidth="1" strokeDasharray="4,2" />
      <text x="160" y="42" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.7">FULL AUTONOMY</text>

      <circle cx="160" cy="115" r="55" fill="var(--matrix-yellow)" opacity="0.08"
        stroke="var(--matrix-yellow)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="160" y="68" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="6" fontFamily="monospace" opacity="0.7">SCOPED MUTATION</text>

      <circle cx="160" cy="115" r="28" fill="var(--matrix-green)" opacity="0.12"
        stroke="var(--matrix-green)" strokeWidth="1.5" />
      <text x="160" y="112" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" fontWeight="bold">READ</text>
      <text x="160" y="122" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" fontWeight="bold">ONLY</text>

      {/* Right side: K8s examples */}
      <rect x="260" y="35" width="125" height="155" rx="4" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1" opacity="0.4" />
      <text x="322" y="50" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" fontWeight="bold">KUBERNETES OPS</text>

      {/* Read examples */}
      <text x="270" y="68" fill="var(--matrix-green)"
        fontSize="5.5" fontFamily="monospace">get pods</text>
      <text x="270" y="79" fill="var(--matrix-green)"
        fontSize="5.5" fontFamily="monospace">describe deploy</text>
      <text x="270" y="90" fill="var(--matrix-green)"
        fontSize="5.5" fontFamily="monospace">logs -f pod/x</text>
      <text x="360" y="79" textAnchor="end" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.6">safe</text>

      {/* Separator */}
      <line x1="265" y1="96" x2="380" y2="96" stroke="var(--matrix-border)"
        strokeWidth="0.5" opacity="0.3" />

      {/* Scoped examples */}
      <text x="270" y="110" fill="var(--matrix-yellow)"
        fontSize="5.5" fontFamily="monospace">scale deploy 2→3</text>
      <text x="270" y="121" fill="var(--matrix-yellow)"
        fontSize="5.5" fontFamily="monospace">restart pod</text>
      <text x="270" y="132" fill="var(--matrix-yellow)"
        fontSize="5.5" fontFamily="monospace">apply configmap</text>
      <text x="360" y="121" textAnchor="end" fill="var(--matrix-yellow)"
        fontSize="5" fontFamily="monospace" opacity="0.6">bounded</text>

      {/* Separator */}
      <line x1="265" y1="138" x2="380" y2="138" stroke="var(--matrix-border)"
        strokeWidth="0.5" opacity="0.3" />

      {/* Dangerous examples */}
      <text x="270" y="152" fill="var(--matrix-red)"
        fontSize="5.5" fontFamily="monospace">delete statefulset</text>
      <text x="270" y="163" fill="var(--matrix-red)"
        fontSize="5.5" fontFamily="monospace">drop database</text>
      <text x="270" y="174" fill="var(--matrix-red)"
        fontSize="5.5" fontFamily="monospace">modify RBAC</text>
      <text x="360" y="163" textAnchor="end" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace" opacity="0.6">catastrophic</text>

      {/* Footer */}
      <text x="200" y="207" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="7" fontFamily="monospace" opacity="0.8">
        ENFORCE BOUNDARIES CENTRALLY — ALLOW AUTONOMY LOCALLY
      </text>
    </svg>
  );
}
