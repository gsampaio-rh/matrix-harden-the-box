interface Props {
  className?: string;
}

export default function NetEgressDiagram({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 300 140" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Pod */}
      <rect x="110" y="45" width="80" height="50" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="150" y="66" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">YOUR POD</text>
      <text x="150" y="80" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">:8080</text>

      {/* Internet (top-left) */}
      <rect x="5" y="10" width="60" height="30" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.6" />
      <text x="35" y="29" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.7">INTERNET</text>

      {/* K8s API (bottom-left) */}
      <rect x="5" y="100" width="60" height="30" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.6" />
      <text x="35" y="119" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.7">K8s API</text>

      {/* LLM namespace (right) */}
      <rect x="235" y="45" width="60" height="50" rx="4" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1" opacity="0.6" />
      <text x="265" y="66" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="7" fontFamily="monospace" opacity="0.7">llm-</text>
      <text x="265" y="77" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="7" fontFamily="monospace" opacity="0.7">inference</text>
      <text x="265" y="88" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="7" fontFamily="monospace" opacity="0.5">:8080</text>

      {/* DNS (top-right) */}
      <rect x="235" y="5" width="60" height="28" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.5" />
      <text x="265" y="23" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.6">DNS :53</text>

      {/* Blocked egress arrows */}
      <line x1="110" y1="55" x2="67" y2="32" stroke="var(--matrix-red)"
        strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
      <line x1="110" y1="82" x2="67" y2="108" stroke="var(--matrix-red)"
        strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

      {/* Allowed egress arrows */}
      <line x1="190" y1="60" x2="233" y2="60" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.7" />
      <line x1="190" y1="50" x2="233" y2="22" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.7" />

      {/* Labels */}
      <text x="82" y="38" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.6">DENY</text>
      <text x="82" y="102" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.6">DENY</text>
      <text x="215" y="52" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.6">ALLOW</text>
    </svg>
  );
}
