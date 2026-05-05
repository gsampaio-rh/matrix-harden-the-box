interface Props {
  className?: string;
}

export default function RbacSecretsDiagram({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 300 140" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Pod */}
      <rect x="10" y="45" width="72" height="50" rx="5" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="46" y="66" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace">YOUR POD</text>
      <text x="46" y="80" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">needs 1</text>

      {/* Role with resourceNames */}
      <rect x="110" y="45" width="80" height="50" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="150" y="63" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace">ROLE</text>
      <text x="150" y="76" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.5">resourceNames:</text>
      <text x="150" y="87" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.5">[db-credentials]</text>

      {/* Target secret (allowed) */}
      <rect x="218" y="15" width="72" height="30" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.7" />
      <text x="254" y="28" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">db-</text>
      <text x="254" y="39" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">credentials</text>

      {/* Blocked secrets */}
      <rect x="218" y="55" width="72" height="22" rx="3" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.4" />
      <text x="254" y="70" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.5">tls-certs</text>

      <rect x="218" y="82" width="72" height="22" rx="3" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.4" />
      <text x="254" y="97" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.5">api-tokens</text>

      <rect x="218" y="109" width="72" height="22" rx="3" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.4" />
      <text x="254" y="124" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.5">+12 more</text>

      {/* Arrows */}
      <line x1="84" y1="68" x2="108" y2="68" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.7" />
      <line x1="190" y1="60" x2="216" y2="32" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.7" />
      <line x1="190" y1="70" x2="216" y2="66" stroke="var(--matrix-red)"
        strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
      <line x1="190" y1="75" x2="216" y2="90" stroke="var(--matrix-red)"
        strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
      <line x1="190" y1="80" x2="216" y2="118" stroke="var(--matrix-red)"
        strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />

      {/* Labels */}
      <text x="205" y="25" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.6">GET</text>
      <text x="205" y="82" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.6">DENY</text>
    </svg>
  );
}
