interface Props {
  className?: string;
}

export default function HarnessDecomposition({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Left side: Planner cascade failure */}
      <text x="100" y="18" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">PLANNER CASCADE</text>

      <rect x="55" y="28" width="90" height="22" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1.5" opacity="0.7" />
      <text x="100" y="42" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace">Planner assumes X</text>

      <line x1="100" y1="50" x2="100" y2="58" stroke="var(--matrix-red)"
        strokeWidth="1" opacity="0.5" />
      <polygon points="96,58 100,64 104,58" fill="var(--matrix-red)" opacity="0.5" />

      <rect x="40" y="65" width="55" height="20" rx="3" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.6" />
      <text x="67" y="78" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace">Sprint 1 ✗</text>

      <rect x="105" y="65" width="55" height="20" rx="3" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.6" />
      <text x="132" y="78" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace">Sprint 2 ✗</text>

      <line x1="67" y1="85" x2="67" y2="93" stroke="var(--matrix-red)"
        strokeWidth="1" opacity="0.4" />
      <line x1="132" y1="85" x2="132" y2="93" stroke="var(--matrix-red)"
        strokeWidth="1" opacity="0.4" />

      <rect x="30" y="95" width="50" height="18" rx="3" fill="var(--matrix-red)" opacity="0.1"
        stroke="var(--matrix-red)" strokeWidth="0.5" />
      <text x="55" y="107" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="4.5" fontFamily="monospace">wrong code</text>

      <rect x="85" y="95" width="50" height="18" rx="3" fill="var(--matrix-red)" opacity="0.1"
        stroke="var(--matrix-red)" strokeWidth="0.5" />
      <text x="110" y="107" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="4.5" fontFamily="monospace">wrong code</text>

      <rect x="140" y="95" width="50" height="18" rx="3" fill="var(--matrix-red)" opacity="0.1"
        stroke="var(--matrix-red)" strokeWidth="0.5" />
      <text x="165" y="107" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="4.5" fontFamily="monospace">wrong code</text>

      <text x="100" y="130" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace" opacity="0.7">error propagates to all steps</text>

      {/* Divider */}
      <line x1="200" y1="25" x2="200" y2="170" stroke="var(--matrix-border)"
        strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />

      {/* Right side: Incremental with checkpoints */}
      <text x="305" y="18" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">INCREMENTAL + CHECKPOINTS</text>

      <rect x="225" y="30" width="160" height="18" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.6" />
      <text x="305" y="42" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace">goal: investigate OOM in prod-ns</text>

      {/* Incremental steps with commits */}
      <rect x="230" y="55" width="65" height="16" rx="3" fill="var(--matrix-green)" opacity="0.15"
        stroke="var(--matrix-green)" strokeWidth="0.8" />
      <text x="262" y="66" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4.5" fontFamily="monospace">check pod logs ✓</text>

      <circle cx="305" cy="63" r="4" fill="none" stroke="var(--matrix-green)" strokeWidth="1" opacity="0.8" />
      <text x="305" y="65" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4" fontFamily="monospace">c1</text>

      <rect x="230" y="77" width="65" height="16" rx="3" fill="var(--matrix-green)" opacity="0.15"
        stroke="var(--matrix-green)" strokeWidth="0.8" />
      <text x="262" y="88" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4.5" fontFamily="monospace">describe pods ✓</text>

      <circle cx="305" cy="85" r="4" fill="none" stroke="var(--matrix-green)" strokeWidth="1" opacity="0.8" />
      <text x="305" y="87" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4" fontFamily="monospace">c2</text>

      <rect x="230" y="99" width="65" height="16" rx="3" fill="var(--matrix-green)" opacity="0.15"
        stroke="var(--matrix-green)" strokeWidth="0.8" />
      <text x="262" y="110" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4.5" fontFamily="monospace">check limits ✓</text>

      <circle cx="305" cy="107" r="4" fill="none" stroke="var(--matrix-green)" strokeWidth="1" opacity="0.8" />
      <text x="305" y="109" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4" fontFamily="monospace">c3</text>

      {/* Git timeline line */}
      <line x1="305" y1="55" x2="305" y2="115" stroke="var(--matrix-green)"
        strokeWidth="0.8" opacity="0.4" />

      <text x="350" y="66" textAnchor="start" fill="var(--matrix-border)"
        fontSize="4" fontFamily="monospace" opacity="0.6">each step = commit</text>
      <text x="350" y="88" textAnchor="start" fill="var(--matrix-border)"
        fontSize="4" fontFamily="monospace" opacity="0.6">rollback possible</text>
      <text x="350" y="110" textAnchor="start" fill="var(--matrix-border)"
        fontSize="4" fontFamily="monospace" opacity="0.6">no planner needed</text>

      <text x="305" y="135" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.7">agent self-organizes; errors stay local</text>

      {/* Bottom labels */}
      <text x="100" y="155" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.6">
        planner doesn't know reality
      </text>
      <text x="305" y="155" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.6">
        agent adapts as it discovers
      </text>

      {/* Footer */}
      <text x="200" y="190" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="7" fontFamily="monospace" opacity="0.8">
        OVER-PLANNING CASCADES ERRORS; UNDER-PLANNING LOSES DIRECTION
      </text>
      <text x="200" y="205" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" opacity="0.5">
        the right granularity depends on agent capability
      </text>
    </svg>
  );
}
