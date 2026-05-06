interface Props {
  className?: string;
}

export default function HarnessBrain({ className = "" }: Props) {
  const tools = [
    { label: "bash / shell", desc: "run commands" },
    { label: "filesystem", desc: "read / write files" },
    { label: "network / HTTP", desc: "external requests" },
    { label: "subprocess", desc: "spawn processes" },
  ];

  return (
    <svg viewBox="0 0 480 250" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Column labels */}
      <text x="110" y="18" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.9">BRAIN</text>
      <text x="370" y="18" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.9">HANDS</text>

      {/* Brain box */}
      <rect x="20" y="28" width="180" height="160" rx="10" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="2" opacity="0.7" />

      {/* LLM circle */}
      <circle cx="110" cy="95" r="36" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1.5" opacity="0.4" />
      <text x="110" y="92" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="12" fontFamily="monospace" fontWeight="bold">LLM</text>
      <text x="110" y="106" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="7" fontFamily="monospace" opacity="0.5">reasoning</text>

      {/* Brain descriptors */}
      <text x="110" y="150" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7.5" fontFamily="monospace" opacity="0.7">plans · decides · evaluates</text>
      <text x="110" y="164" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7.5" fontFamily="monospace" opacity="0.7">reads instructions</text>

      {/* Separator line */}
      <line x1="240" y1="28" x2="240" y2="188"
        stroke="var(--matrix-border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

      {/* Forward arrow: brain → hands */}
      <line x1="200" y1="78" x2="278" y2="78"
        stroke="var(--matrix-yellow)" strokeWidth="2" opacity="0.7" />
      <polygon points="278,78 270,73 270,83" fill="var(--matrix-yellow)" opacity="0.7" />

      {/* Label */}
      <text x="240" y="100" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="8" fontFamily="monospace" opacity="0.7">tool calls</text>

      {/* Return arrow: hands → brain */}
      <line x1="278" y1="118" x2="200" y2="118"
        stroke="var(--matrix-yellow)" strokeWidth="2" opacity="0.7" />
      <polygon points="200,118 208,113 208,123" fill="var(--matrix-yellow)" opacity="0.7" />

      {/* Hands box */}
      <rect x="290" y="28" width="170" height="160" rx="10" fill="none"
        stroke="var(--matrix-green)" strokeWidth="2" opacity="0.7" />

      {/* Tool rows */}
      {tools.map((tool, i) => {
        const y = 42 + i * 36;
        return (
          <g key={tool.label}>
            <rect x="302" y={y} width="130" height="28" rx="4" fill="none"
              stroke="var(--matrix-green)" strokeWidth="1" opacity="0.6" />
            <text x="367" y={y + 14} textAnchor="middle" fill="var(--matrix-green)"
              fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.9">
              {tool.label}
            </text>
            <text x="367" y={y + 24} textAnchor="middle" fill="var(--matrix-green)"
              fontSize="6" fontFamily="monospace" opacity="0.4">
              {tool.desc}
            </text>
            {/* Attack surface dot */}
            <circle cx="440" cy={y + 14} r="5" fill="var(--matrix-red)" opacity="0.6" />
          </g>
        );
      })}

      {/* Legend */}
      <circle cx="302" cy="200" r="4" fill="var(--matrix-red)" opacity="0.6" />
      <text x="310" y="203" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.5">= attack surface</text>

      {/* Bottom labels */}
      <text x="240" y="224" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.8">
        EACH TOOL IS A POTENTIAL ATTACK VECTOR
      </text>
      <text x="240" y="240" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">
        the sandbox boundary is where trust ends
      </text>
    </svg>
  );
}
