interface Props {
  className?: string;
}

export default function HarnessRecovery({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="18" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" fontWeight="bold">CORRECTIONS ARE CHEAP</text>

      {/* Timeline */}
      <line x1="30" y1="70" x2="370" y2="70" stroke="var(--matrix-border)"
        strokeWidth="1.5" opacity="0.5" />

      {/* Checkpoint 1 */}
      <circle cx="60" cy="70" r="6" fill="var(--matrix-green)" opacity="0.3"
        stroke="var(--matrix-green)" strokeWidth="1.5" />
      <text x="60" y="58" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace">commit</text>
      <text x="60" y="88" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4.5" fontFamily="monospace" opacity="0.6">c1: init</text>

      {/* Checkpoint 2 */}
      <circle cx="130" cy="70" r="6" fill="var(--matrix-green)" opacity="0.3"
        stroke="var(--matrix-green)" strokeWidth="1.5" />
      <text x="130" y="58" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace">commit</text>
      <text x="130" y="88" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4.5" fontFamily="monospace" opacity="0.6">c2: fix svc</text>

      {/* Checkpoint 3 — good */}
      <circle cx="200" cy="70" r="6" fill="var(--matrix-green)" opacity="0.3"
        stroke="var(--matrix-green)" strokeWidth="1.5" />
      <text x="200" y="58" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace">commit</text>
      <text x="200" y="88" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4.5" fontFamily="monospace" opacity="0.6">c3: scale ✓</text>

      {/* Error point */}
      <circle cx="270" cy="70" r="6" fill="var(--matrix-red)" opacity="0.4"
        stroke="var(--matrix-red)" strokeWidth="1.5" />
      <text x="270" y="56" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5.5" fontFamily="monospace" fontWeight="bold">ERROR</text>
      <text x="270" y="88" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="4.5" fontFamily="monospace" opacity="0.6">c4: bad config</text>

      {/* Rollback arrow */}
      <path d="M 265 100 C 265 120, 205 120, 205 100" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1.5" opacity="0.8" />
      <polygon points="203,103 205,96 207,103" fill="var(--chapter-configure)" opacity="0.8" />
      <text x="235" y="130" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="6" fontFamily="monospace" fontWeight="bold">git revert</text>

      {/* Recovery */}
      <circle cx="340" cy="70" r="6" fill="var(--matrix-green)" opacity="0.3"
        stroke="var(--matrix-green)" strokeWidth="1.5" />
      <text x="340" y="58" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace">recovered</text>
      <text x="340" y="88" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4.5" fontFamily="monospace" opacity="0.6">c5: retry ✓</text>

      {/* Cost comparison */}
      <rect x="30" y="145" width="160" height="50" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.5" />
      <text x="110" y="160" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" fontWeight="bold">PREVENTION</text>
      <text x="110" y="173" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace" opacity="0.6">block all possible errors</text>
      <text x="110" y="185" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace" opacity="0.6">exponential cost; false positives</text>

      <rect x="210" y="145" width="160" height="50" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.5" />
      <text x="290" y="160" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" fontWeight="bold">CORRECTION</text>
      <text x="290" y="173" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.6">detect → revert → retry</text>
      <text x="290" y="185" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.6">cheap; bounded damage window</text>

      {/* Footer */}
      <text x="200" y="210" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" opacity="0.5">
        git provides free checkpoints — use them
      </text>
    </svg>
  );
}
