interface Props {
  className?: string;
}

export default function HarnessBrain({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Brain (LLM) — left side */}
      <rect x="30" y="40" width="140" height="130" rx="10" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="2" opacity="0.8" />
      <text x="100" y="30" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="9" fontFamily="monospace" fontWeight="bold">BRAIN</text>

      <circle cx="100" cy="95" r="30" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1.5" opacity="0.5" />
      <text x="100" y="92" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="10" fontFamily="monospace" fontWeight="bold">LLM</text>
      <text x="100" y="104" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="6" fontFamily="monospace" opacity="0.6">reasoning</text>

      <text x="100" y="145" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.6">plans · decides · evaluates</text>
      <text x="100" y="158" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.6">reads instructions</text>

      {/* Separator */}
      <line x1="195" y1="35" x2="195" y2="180" stroke="var(--matrix-border)"
        strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

      {/* Bidirectional arrows */}
      <line x1="170" y1="80" x2="220" y2="80" stroke="var(--matrix-yellow)"
        strokeWidth="1.5" opacity="0.6" />
      <polygon points="220,80 214,76 214,84" fill="var(--matrix-yellow)" opacity="0.6" />
      <line x1="220" y1="110" x2="170" y2="110" stroke="var(--matrix-yellow)"
        strokeWidth="1.5" opacity="0.6" />
      <polygon points="170,110 176,106 176,114" fill="var(--matrix-yellow)" opacity="0.6" />
      <text x="195" y="100" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="6" fontFamily="monospace" opacity="0.5">tool calls</text>

      {/* Hands (Tools) — right side */}
      <rect x="230" y="40" width="140" height="130" rx="10" fill="none"
        stroke="var(--matrix-green)" strokeWidth="2" opacity="0.8" />
      <text x="300" y="30" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace" fontWeight="bold">HANDS</text>

      {/* Tool boxes with attack surface markers */}
      <rect x="245" y="55" width="110" height="22" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.7" />
      <text x="300" y="69" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">bash / shell</text>
      <circle cx="362" cy="66" r="4" fill="var(--matrix-red)" opacity="0.6" />

      <rect x="245" y="85" width="110" height="22" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.7" />
      <text x="300" y="99" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">filesystem</text>
      <circle cx="362" cy="96" r="4" fill="var(--matrix-red)" opacity="0.6" />

      <rect x="245" y="115" width="110" height="22" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.7" />
      <text x="300" y="129" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">network / HTTP</text>
      <circle cx="362" cy="126" r="4" fill="var(--matrix-red)" opacity="0.6" />

      <rect x="245" y="145" width="110" height="22" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.7" />
      <text x="300" y="159" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">subprocess</text>
      <circle cx="362" cy="156" r="4" fill="var(--matrix-red)" opacity="0.6" />

      {/* Attack surface legend */}
      <circle cx="370" cy="185" r="4" fill="var(--matrix-red)" opacity="0.6" />
      <text x="378" y="188" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.5">= attack surface</text>

      {/* Bottom label */}
      <text x="200" y="200" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" opacity="0.7">
        EACH TOOL IS A POTENTIAL ATTACK VECTOR
      </text>
      <text x="200" y="213" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="7" fontFamily="monospace" opacity="0.4">
        the sandbox boundary is where trust ends
      </text>
    </svg>
  );
}
