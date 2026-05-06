interface Props {
  className?: string;
}

export default function HarnessConfig({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 230" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Key label */}
      <text x="200" y="18" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" opacity="0.7">
        CONFIG CONTROLS BEHAVIOR
      </text>
      <line x1="170" y1="25" x2="230" y2="25" stroke="var(--chapter-configure)"
        strokeWidth="1.5" opacity="0.4" />
      <line x1="170" y1="30" x2="230" y2="30" stroke="var(--chapter-configure)"
        strokeWidth="1.5" opacity="0.4" />

      {/* CLAUDE.md file */}
      <rect x="20" y="40" width="140" height="170" rx="4" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1.5" />
      <rect x="20" y="40" width="140" height="24" rx="4" fill="var(--chapter-configure)" opacity="0.15" />
      <text x="90" y="56" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="10" fontFamily="monospace" fontWeight="bold">CLAUDE.md</text>

      {/* Config entries — 28px apart for breathing room */}
      <text x="35" y="82" fill="var(--matrix-green)" fontSize="8" fontFamily="monospace" opacity="0.8">role: SRE agent</text>
      <line x1="35" y1="86" x2="145" y2="86" stroke="var(--matrix-green)" strokeWidth="0.5" opacity="0.3" />

      <text x="35" y="110" fill="var(--matrix-green)" fontSize="8" fontFamily="monospace" opacity="0.8">scope: read-only</text>
      <line x1="35" y1="114" x2="145" y2="114" stroke="var(--matrix-green)" strokeWidth="0.5" opacity="0.3" />

      <text x="35" y="138" fill="var(--matrix-green)" fontSize="8" fontFamily="monospace" opacity="0.8">NEVER: exfiltrate</text>
      <line x1="35" y1="142" x2="145" y2="142" stroke="var(--matrix-green)" strokeWidth="0.5" opacity="0.3" />

      <text x="35" y="166" fill="var(--matrix-green)" fontSize="8" fontFamily="monospace" opacity="0.8">escalate: on doubt</text>
      <line x1="35" y1="170" x2="145" y2="170" stroke="var(--matrix-green)" strokeWidth="0.5" opacity="0.3" />

      <text x="35" y="194" fill="var(--matrix-green)" fontSize="8" fontFamily="monospace" opacity="0.8">max-turns: 25</text>
      <line x1="35" y1="198" x2="145" y2="198" stroke="var(--matrix-green)" strokeWidth="0.5" opacity="0.3" />

      {/* Arrow: config → agent */}
      <line x1="165" y1="125" x2="225" y2="125" stroke="var(--chapter-configure)"
        strokeWidth="2" strokeDasharray="6 3" opacity="0.8" />
      <polygon points="225,125 217,120 217,130" fill="var(--chapter-configure)" opacity="0.8" />
      <text x="195" y="118" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="7" fontFamily="monospace" opacity="0.6">defines</text>

      {/* Agent brain */}
      <rect x="230" y="65" width="140" height="120" rx="10" fill="none"
        stroke="var(--matrix-green)" strokeWidth="2" opacity="0.8" />
      <text x="300" y="90" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="10" fontFamily="monospace" fontWeight="bold">AGENT</text>

      <circle cx="300" cy="120" r="22" fill="none" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.6" />
      <text x="300" y="124" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace" opacity="0.8">LLM</text>

      {/* Action arrows out of agent */}
      <line x1="300" y1="185" x2="300" y2="210" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.5" />
      <polygon points="300,210 296,204 304,204" fill="var(--matrix-green)" opacity="0.5" />
      <text x="300" y="225" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace" opacity="0.6">ACTIONS</text>
    </svg>
  );
}
