interface Props {
  className?: string;
}

export default function HarnessRepo({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Spotlight / visible zone */}
      <ellipse cx="200" cy="120" rx="130" ry="85" fill="var(--chapter-configure)"
        opacity="0.05" />
      <ellipse cx="200" cy="120" rx="130" ry="85" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.4" />
      <text x="200" y="22" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" opacity="0.7">AGENT CONTEXT WINDOW</text>

      {/* Central repo icon */}
      <rect x="170" y="45" width="60" height="30" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.9" />
      <text x="200" y="64" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace" fontWeight="bold">REPO</text>

      {/* Visible files (inside spotlight) */}
      <rect x="95" y="95" width="70" height="22" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.8" />
      <text x="130" y="109" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">CLAUDE.md</text>

      <rect x="235" y="95" width="70" height="22" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.8" />
      <text x="270" y="109" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">skills/</text>

      <rect x="140" y="140" width="55" height="22" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.8" />
      <text x="167" y="154" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">.cursorrules</text>

      <rect x="210" y="140" width="55" height="22" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.8" />
      <text x="237" y="154" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">hooks/</text>

      {/* Lines from repo to visible files */}
      <line x1="185" y1="75" x2="145" y2="95" stroke="var(--matrix-green)"
        strokeWidth="1" opacity="0.3" />
      <line x1="215" y1="75" x2="255" y2="95" stroke="var(--matrix-green)"
        strokeWidth="1" opacity="0.3" />
      <line x1="195" y1="75" x2="167" y2="140" stroke="var(--matrix-green)"
        strokeWidth="1" opacity="0.3" />
      <line x1="205" y1="75" x2="237" y2="140" stroke="var(--matrix-green)"
        strokeWidth="1" opacity="0.3" />

      {/* Invisible files (outside spotlight, greyed out) */}
      <rect x="15" y="55" width="55" height="20" rx="3" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1" opacity="0.3" />
      <text x="42" y="68" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" opacity="0.3">terraform/</text>

      <rect x="15" y="85" width="55" height="20" rx="3" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1" opacity="0.3" />
      <text x="42" y="98" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" opacity="0.3">docs/old/</text>

      <rect x="340" y="55" width="50" height="20" rx="3" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1" opacity="0.3" />
      <text x="365" y="68" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" opacity="0.3">archive/</text>

      <rect x="340" y="85" width="50" height="20" rx="3" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1" opacity="0.3" />
      <text x="365" y="98" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" opacity="0.3">.git/</text>

      {/* "Invisible" label */}
      <text x="42" y="125" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.5">NOT IN CONTEXT</text>
      <text x="365" y="125" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.5">NOT IN CONTEXT</text>

      {/* Bottom label */}
      <text x="200" y="195" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" opacity="0.7">
        IF IT'S NOT IN THE REPO, IT DOESN'T EXIST
      </text>
      <text x="200" y="210" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="7" fontFamily="monospace" opacity="0.4">
        the repository is the agent's entire reality
      </text>
    </svg>
  );
}
