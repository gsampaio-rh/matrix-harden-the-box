interface Props {
  className?: string;
}

export default function HarnessBreakers({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Electrical panel frame */}
      <rect x="50" y="25" width="300" height="170" rx="8" fill="none"
        stroke="var(--matrix-border)" strokeWidth="2" opacity="0.5" />
      <rect x="50" y="25" width="300" height="24" rx="8" fill="var(--matrix-border)" opacity="0.1" />
      <text x="200" y="41" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="9" fontFamily="monospace" fontWeight="bold">CIRCUIT BREAKER PANEL</text>

      {/* Breaker 1: Max Turns — TRIPPED (green/on) */}
      <rect x="70" y="60" width="80" height="120" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="110" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">MAX TURNS</text>

      {/* Switch — ON position */}
      <rect x="95" y="88" width="30" height="50" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.6" />
      <rect x="97" y="90" width="26" height="22" rx="2" fill="var(--matrix-green)" opacity="0.3" />
      <text x="110" y="104" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">ON</text>
      <text x="110" y="130" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" opacity="0.4">OFF</text>

      <text x="110" y="155" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.6">25 turns</text>
      <text x="110" y="168" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="10" opacity="0.8">✓</text>

      {/* Breaker 2: Bash Timeout — TRIPPED (green/on) */}
      <rect x="160" y="60" width="80" height="120" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="200" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">TIMEOUT</text>

      <rect x="185" y="88" width="30" height="50" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.6" />
      <rect x="187" y="90" width="26" height="22" rx="2" fill="var(--matrix-green)" opacity="0.3" />
      <text x="200" y="104" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">ON</text>
      <text x="200" y="130" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" opacity="0.4">OFF</text>

      <text x="200" y="155" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.6">30s max</text>
      <text x="200" y="168" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="10" opacity="0.8">✓</text>

      {/* Breaker 3: Env Scrub — OFF (red/danger) */}
      <rect x="250" y="60" width="80" height="120" rx="6" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1.5" opacity="0.8" />
      <text x="290" y="78" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">ENV SCRUB</text>

      <rect x="275" y="88" width="30" height="50" rx="3" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.6" />
      <text x="290" y="104" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" opacity="0.4">ON</text>
      <rect x="277" y="114" width="26" height="22" rx="2" fill="var(--matrix-red)" opacity="0.25" />
      <text x="290" y="128" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">OFF</text>

      <text x="290" y="155" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.6">secrets exposed</text>
      <text x="290" y="168" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="10" opacity="0.7">✗</text>

      {/* Bottom label */}
      <text x="200" y="210" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" opacity="0.7">
        LIMITS PREVENT RUNAWAY BEHAVIOR
      </text>
    </svg>
  );
}
