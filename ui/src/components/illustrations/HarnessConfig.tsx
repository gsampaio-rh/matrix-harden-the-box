interface Props {
  className?: string;
}

export default function HarnessConfig({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* CLAUDE.md file */}
      <rect x="30" y="40" width="120" height="150" rx="4" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1.5" />
      <rect x="30" y="40" width="120" height="22" rx="4" fill="var(--chapter-configure)" opacity="0.15" />
      <text x="90" y="55" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="9" fontFamily="monospace" fontWeight="bold">CLAUDE.md</text>

      {/* Config lines */}
      <line x1="42" y1="75" x2="130" y2="75" stroke="var(--matrix-green)" strokeWidth="1" opacity="0.5" />
      <text x="45" y="73" fill="var(--matrix-green)" fontSize="7" fontFamily="monospace" opacity="0.7">role: SRE agent</text>
      <line x1="42" y1="95" x2="125" y2="95" stroke="var(--matrix-green)" strokeWidth="1" opacity="0.5" />
      <text x="45" y="93" fill="var(--matrix-green)" fontSize="7" fontFamily="monospace" opacity="0.7">scope: read-only</text>
      <line x1="42" y1="115" x2="140" y2="115" stroke="var(--matrix-green)" strokeWidth="1" opacity="0.5" />
      <text x="45" y="113" fill="var(--matrix-green)" fontSize="7" fontFamily="monospace" opacity="0.7">NEVER: exfiltrate</text>
      <line x1="42" y1="135" x2="135" y2="135" stroke="var(--matrix-green)" strokeWidth="1" opacity="0.5" />
      <text x="45" y="133" fill="var(--matrix-green)" fontSize="7" fontFamily="monospace" opacity="0.7">escalate: on doubt</text>
      <line x1="42" y1="155" x2="130" y2="155" stroke="var(--matrix-green)" strokeWidth="1" opacity="0.5" />
      <text x="45" y="153" fill="var(--matrix-green)" fontSize="7" fontFamily="monospace" opacity="0.7">max-turns: 25</text>

      {/* Arrow: config → agent */}
      <line x1="155" y1="115" x2="225" y2="115" stroke="var(--chapter-configure)"
        strokeWidth="2" strokeDasharray="6 3" opacity="0.8" />
      <polygon points="225,115 217,110 217,120" fill="var(--chapter-configure)" opacity="0.8" />
      <text x="190" y="108" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="7" fontFamily="monospace" opacity="0.6">defines</text>

      {/* Agent brain */}
      <rect x="230" y="55" width="140" height="120" rx="10" fill="none"
        stroke="var(--matrix-green)" strokeWidth="2" opacity="0.8" />
      <text x="300" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="10" fontFamily="monospace" fontWeight="bold">AGENT</text>

      {/* Brain icon (simplified) */}
      <circle cx="300" cy="110" r="22" fill="none" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.6" />
      <text x="300" y="114" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace" opacity="0.8">LLM</text>

      {/* Action arrows out of agent */}
      <line x1="300" y1="175" x2="300" y2="200" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.5" />
      <polygon points="300,200 296,194 304,194" fill="var(--matrix-green)" opacity="0.5" />
      <text x="300" y="215" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace" opacity="0.6">ACTIONS</text>

      {/* Key label */}
      <text x="200" y="18" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" opacity="0.7">
        CONFIG CONTROLS BEHAVIOR
      </text>

      {/* Equals sign */}
      <line x1="170" y1="25" x2="230" y2="25" stroke="var(--chapter-configure)"
        strokeWidth="1.5" opacity="0.4" />
      <line x1="170" y1="30" x2="230" y2="30" stroke="var(--chapter-configure)"
        strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}
