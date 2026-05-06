interface Props {
  className?: string;
}

export default function HarnessMap({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Good: slim map document */}
      <rect x="30" y="30" width="140" height="160" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="2" opacity="0.8" />
      <rect x="30" y="30" width="140" height="22" rx="6" fill="var(--matrix-green)" opacity="0.1" />
      <text x="100" y="45" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace" fontWeight="bold">CLAUDE.md</text>
      <text x="100" y="57" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.5">~80 lines</text>

      {/* Concise sections */}
      {[
        { y: 70, label: "Role" },
        { y: 88, label: "Scope" },
        { y: 106, label: "Prohibited" },
        { y: 124, label: "Verify" },
        { y: 142, label: "Escalate" },
      ].map(({ y, label }) => (
        <g key={label}>
          <rect x="42" y={y} width="116" height="14" rx="2" fill="var(--matrix-green)" opacity="0.08" />
          <text x="100" y={y + 10} textAnchor="middle" fill="var(--matrix-green)"
            fontSize="7" fontFamily="monospace" opacity="0.7">{label}</text>
        </g>
      ))}

      {/* Skills arrow */}
      <line x1="100" y1="190" x2="100" y2="210" stroke="var(--matrix-green)"
        strokeWidth="1" opacity="0.4" />
      <text x="100" y="205" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.5">→ skills/ for depth</text>

      {/* Checkmark */}
      <text x="100" y="168" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="14" opacity="0.8">✓</text>

      {/* VS divider */}
      <text x="200" y="115" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="12" fontFamily="monospace" opacity="0.5">vs</text>

      {/* Bad: bloated encyclopedia */}
      <rect x="230" y="30" width="140" height="160" rx="6" fill="none"
        stroke="var(--matrix-red)" strokeWidth="2" opacity="0.6" />
      <rect x="230" y="30" width="140" height="22" rx="6" fill="var(--matrix-red)" opacity="0.1" />
      <text x="300" y="45" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="9" fontFamily="monospace" fontWeight="bold">CLAUDE.md</text>
      <text x="300" y="57" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.5">~500+ lines</text>

      {/* Dense lines representing bloat */}
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1="242" y1={68 + i * 8} x2={310 + (i % 3) * 15} y2={68 + i * 8}
          stroke="var(--matrix-red)" strokeWidth="1" opacity={0.15 + (i % 3) * 0.05} />
      ))}

      {/* Red X */}
      <line x1="290" y1="160" x2="310" y2="178" stroke="var(--matrix-red)"
        strokeWidth="3" opacity="0.7" />
      <line x1="310" y1="160" x2="290" y2="178" stroke="var(--matrix-red)"
        strokeWidth="3" opacity="0.7" />

      {/* Labels */}
      <text x="100" y="18" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace" opacity="0.7">MAP</text>
      <text x="300" y="18" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="8" fontFamily="monospace" opacity="0.7">ENCYCLOPEDIA</text>
    </svg>
  );
}
