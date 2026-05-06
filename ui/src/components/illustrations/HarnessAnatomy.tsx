interface Props {
  className?: string;
}

export default function HarnessAnatomy({ className = "" }: Props) {
  const rowH = 48;
  const gap = 6;
  const startY = 28;

  const layers = [
    {
      label: "CLAUDE.md",
      tag: "ADVISORY",
      what: "WHO — role, scope, prohibitions, escalation",
      why: "LLM reads it but CAN ignore it → guidance only",
      color: "var(--chapter-configure)",
    },
    {
      label: "skills/*.md",
      tag: "ON-DEMAND",
      what: "HOW — procedures, boundaries, domain knowledge",
      why: "Loaded when needed → depth without context noise",
      color: "var(--matrix-green)",
    },
    {
      label: "hooks",
      tag: "ENFORCED",
      what: "WHEN — pre/post actions, lint gates, validation",
      why: "Runs WITHOUT the LLM → agent can't skip these",
      color: "var(--matrix-yellow)",
    },
    {
      label: "NOT AI",
      tag: "NO LLM",
      what: "NEVER — secrets, auth, destructive ops, audit",
      why: "Zero tolerance for error → human-written scripts only",
      color: "var(--matrix-red)",
    },
  ];

  const totalH = startY + layers.length * (rowH + gap) + 30;

  return (
    <svg viewBox={`0 0 400 ${totalH}`} className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Title */}
      <text x="200" y="14" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" opacity="0.8">
        EACH LAYER = DIFFERENT TRUST MODEL
      </text>

      {/* Trust gradient arrow — left side */}
      <line x1="8" y1={startY} x2="8" y2={startY + layers.length * (rowH + gap) - gap}
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.3" />
      <polygon
        points={`8,${startY + layers.length * (rowH + gap) - gap} 5,${startY + layers.length * (rowH + gap) - gap - 6} 11,${startY + layers.length * (rowH + gap) - gap - 6}`}
        fill="var(--matrix-red)" opacity="0.4" />
      <text x="8" y={startY - 4} textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.5">LLM</text>
      <text x="8" y={startY + layers.length * (rowH + gap) + 8} textAnchor="middle"
        fill="var(--matrix-red)" fontSize="5" fontFamily="monospace" opacity="0.5">HUMAN</text>

      {layers.map((layer, i) => {
        const y = startY + i * (rowH + gap);
        return (
          <g key={layer.label}>
            {/* Row box */}
            <rect x="18" y={y} width="374" height={rowH} rx="4" fill="none"
              stroke={layer.color} strokeWidth="1.2" opacity="0.7" />

            {/* Header bar */}
            <rect x="18" y={y} width="374" height="16" rx="4"
              fill={layer.color} opacity="0.1" />

            {/* Label + tag */}
            <text x="28" y={y + 12} fill={layer.color}
              fontSize="8" fontFamily="monospace" fontWeight="bold">{layer.label}</text>
            <text x="384" y={y + 12} textAnchor="end" fill={layer.color}
              fontSize="6" fontFamily="monospace" opacity="0.5">{layer.tag}</text>

            {/* What */}
            <text x="28" y={y + 28} fill="var(--matrix-green)"
              fontSize="7" fontFamily="monospace" opacity="0.8">{layer.what}</text>

            {/* Why */}
            <text x="28" y={y + 40} fill={layer.color}
              fontSize="6.5" fontFamily="monospace" opacity="0.6">{layer.why}</text>
          </g>
        );
      })}

      {/* Bottom label */}
      <text x="200" y={totalH - 4} textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6.5" fontFamily="monospace" opacity="0.6">
        separation exists because each layer answers: "what if the LLM ignores this?"
      </text>
    </svg>
  );
}
