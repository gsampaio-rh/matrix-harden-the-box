interface Props {
  className?: string;
}

export default function HarnessContext({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Title */}
      <text x="200" y="18" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" fontWeight="bold">CONTEXT WINDOW OVER TIME</text>

      {/* Session 1 — filling up */}
      <rect x="20" y="30" width="110" height="140" rx="4" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1.5" opacity="0.6" />
      <text x="75" y="45" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">SESSION 1</text>

      {/* Fill bars showing context growing */}
      <rect x="30" y="55" width="90" height="12" rx="2" fill="var(--matrix-green)" opacity="0.2" />
      <text x="75" y="64" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace">instructions</text>

      <rect x="30" y="72" width="90" height="20" rx="2" fill="var(--matrix-green)" opacity="0.3" />
      <text x="75" y="85" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace">tool outputs</text>

      <rect x="30" y="97" width="90" height="25" rx="2" fill="var(--matrix-yellow)" opacity="0.3" />
      <text x="75" y="113" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="5" fontFamily="monospace">conversation history</text>

      <rect x="30" y="127" width="90" height="35" rx="2" fill="var(--matrix-red)" opacity="0.2" />
      <text x="75" y="145" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace">context anxiety</text>
      <text x="75" y="155" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="4" fontFamily="monospace" opacity="0.7">rushing decisions...</text>

      {/* Arrow between sessions */}
      <line x1="135" y1="100" x2="150" y2="100" stroke="var(--chapter-configure)"
        strokeWidth="1.5" opacity="0.6" />
      <polygon points="150,96 158,100 150,104" fill="var(--chapter-configure)" opacity="0.6" />
      <text x="146" y="90" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="5" fontFamily="monospace">RESET</text>

      {/* Session 2 — fresh start with handoff */}
      <rect x="160" y="30" width="110" height="140" rx="4" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1.5" opacity="0.6" />
      <text x="215" y="45" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">SESSION 2</text>

      <rect x="170" y="55" width="90" height="12" rx="2" fill="var(--matrix-green)" opacity="0.2" />
      <text x="215" y="64" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace">instructions</text>

      <rect x="170" y="72" width="90" height="14" rx="2" fill="var(--chapter-configure)" opacity="0.2" />
      <text x="215" y="82" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="5" fontFamily="monospace">handoff artifact</text>

      <rect x="170" y="91" width="90" height="70" rx="2" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" strokeDasharray="3,2" opacity="0.3" />
      <text x="215" y="130" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.5">available for work</text>

      {/* Repository option */}
      <rect x="290" y="30" width="95" height="140" rx="4" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1.5" opacity="0.6" />
      <text x="337" y="45" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">REPO MEMORY</text>

      <rect x="300" y="55" width="75" height="10" rx="2" fill="var(--chapter-configure)" opacity="0.15" />
      <text x="337" y="63" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="4.5" fontFamily="monospace">AGENTS.md</text>

      <rect x="300" y="69" width="75" height="10" rx="2" fill="var(--chapter-configure)" opacity="0.15" />
      <text x="337" y="77" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="4.5" fontFamily="monospace">progress.log</text>

      <rect x="300" y="83" width="75" height="10" rx="2" fill="var(--chapter-configure)" opacity="0.15" />
      <text x="337" y="91" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="4.5" fontFamily="monospace">git history</text>

      <text x="337" y="115" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.6">+ durable</text>
      <text x="337" y="127" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.6">+ auditable</text>
      <text x="337" y="142" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace" opacity="0.6">- costs tokens</text>
      <text x="337" y="154" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace" opacity="0.6">- can rot</text>

      {/* Bottom label */}
      <text x="200" y="190" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="7" fontFamily="monospace" opacity="0.8">
        EVERY TOKEN OF HISTORY COMPETES WITH THE CURRENT TASK
      </text>
      <text x="200" y="205" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" opacity="0.5">
        ~200k tokens shared between memory and work
      </text>
    </svg>
  );
}
