interface Props {
  className?: string;
}

export default function HarnessEval({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Left panel: Self-evaluation */}
      <rect x="20" y="35" width="160" height="145" rx="8" fill="none"
        stroke="var(--matrix-yellow)" strokeWidth="1.5" opacity="0.7" />
      <text x="100" y="25" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="8" fontFamily="monospace" fontWeight="bold">SELF-EVALUATION</text>

      {/* Agent grading its own work */}
      <circle cx="70" cy="75" r="18" fill="none"
        stroke="var(--matrix-yellow)" strokeWidth="1.5" opacity="0.6" />
      <text x="70" y="72" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="7" fontFamily="monospace">Agent</text>
      <text x="70" y="82" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="6" fontFamily="monospace" opacity="0.5">judge</text>

      {/* Arrow to paper */}
      <line x1="88" y1="75" x2="108" y2="75" stroke="var(--matrix-yellow)"
        strokeWidth="1" opacity="0.5" />

      {/* Paper with all checkmarks */}
      <rect x="110" y="55" width="55" height="60" rx="3" fill="none"
        stroke="var(--matrix-yellow)" strokeWidth="1" opacity="0.6" />
      <text x="137" y="69" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">✓ Task 1</text>
      <text x="137" y="81" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">✓ Task 2</text>
      <text x="137" y="93" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">✓ Task 3</text>
      <text x="137" y="105" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">✓ Task 4</text>

      {/* Grade: A+ (lenient) */}
      <text x="100" y="140" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="16" fontFamily="monospace" fontWeight="bold" opacity="0.8">A+</text>
      <text x="100" y="155" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="6" fontFamily="monospace" opacity="0.5">"looks good to me"</text>
      <text x="100" y="168" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.6">BIASED</text>

      {/* VS divider */}
      <text x="200" y="112" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="12" fontFamily="monospace" opacity="0.5">vs</text>

      {/* Right panel: External verification */}
      <rect x="220" y="35" width="160" height="145" rx="8" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.7" />
      <text x="300" y="25" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace" fontWeight="bold">EXTERNAL VERIFICATION</text>

      {/* External auditor */}
      <circle cx="260" cy="75" r="18" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.6" />
      <text x="260" y="72" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">Rules</text>
      <text x="260" y="82" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.5">engine</text>

      {/* Arrow to paper */}
      <line x1="278" y1="75" x2="298" y2="75" stroke="var(--matrix-green)"
        strokeWidth="1" opacity="0.5" />

      {/* Paper with mixed results */}
      <rect x="300" y="55" width="65" height="60" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.6" />
      <text x="332" y="69" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">✓ Task 1</text>
      <text x="332" y="81" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace">✗ Task 2</text>
      <text x="332" y="93" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">✓ Task 3</text>
      <text x="332" y="105" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace">✗ Task 4</text>

      {/* Grade: accurate */}
      <text x="300" y="140" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="16" fontFamily="monospace" fontWeight="bold" opacity="0.8">C+</text>
      <text x="300" y="155" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.5">"here's what's wrong"</text>
      <text x="300" y="168" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.6">ACCURATE</text>

      {/* Bottom label */}
      <text x="200" y="200" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" opacity="0.7">
        AGENTS CANNOT RELIABLY JUDGE THEIR OWN WORK
      </text>
      <text x="200" y="213" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="7" fontFamily="monospace" opacity="0.4">
        external rules + verification = real safety
      </text>
    </svg>
  );
}
