interface Props {
  className?: string;
}

export default function HarnessEvalStrategy({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Left: Self-evaluation (biased) */}
      <text x="100" y="18" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">SELF-EVALUATION</text>

      <circle cx="100" cy="55" r="22" fill="none"
        stroke="var(--matrix-yellow)" strokeWidth="1.5" opacity="0.7" />
      <text x="100" y="52" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="7" fontFamily="monospace">Agent</text>
      <text x="100" y="62" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="5" fontFamily="monospace" opacity="0.6">generates</text>

      {/* Self-arrow */}
      <path d="M 122 50 C 140 35, 140 75, 122 60" fill="none"
        stroke="var(--matrix-yellow)" strokeWidth="1" opacity="0.6" />
      <text x="148" y="55" textAnchor="start" fill="var(--matrix-yellow)"
        fontSize="5" fontFamily="monospace" opacity="0.7">reviews self</text>

      {/* Result */}
      <rect x="55" y="90" width="90" height="28" rx="4" fill="var(--matrix-yellow)" opacity="0.1"
        stroke="var(--matrix-yellow)" strokeWidth="1" />
      <text x="100" y="104" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="6" fontFamily="monospace">"92% success"</text>
      <text x="100" y="113" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace" opacity="0.7">actual: 64% correct</text>

      <text x="100" y="135" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace" opacity="0.7">same blind spots</text>
      <text x="100" y="147" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace" opacity="0.7">optimizes for consistency</text>
      <text x="100" y="159" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace" opacity="0.7">not correctness</text>

      {/* Divider */}
      <line x1="200" y1="15" x2="200" y2="175" stroke="var(--matrix-border)"
        strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />

      {/* Right: External evaluator (GAN-inspired) */}
      <text x="305" y="18" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">EXTERNAL EVALUATOR</text>

      {/* Generator */}
      <circle cx="265" cy="55" r="20" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1.5" opacity="0.7" />
      <text x="265" y="52" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="6" fontFamily="monospace">Generator</text>
      <text x="265" y="62" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="5" fontFamily="monospace" opacity="0.6">codes</text>

      {/* Arrow to evaluator */}
      <line x1="285" y1="55" x2="320" y2="55" stroke="var(--matrix-border)"
        strokeWidth="1" opacity="0.5" />
      <polygon points="320,52 326,55 320,58" fill="var(--matrix-border)" opacity="0.5" />
      <text x="302" y="48" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="4" fontFamily="monospace" opacity="0.6">output</text>

      {/* Evaluator */}
      <circle cx="345" cy="55" r="20" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.7" />
      <text x="345" y="52" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace">Evaluator</text>
      <text x="345" y="62" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.6">grades</text>

      {/* Feedback arrow */}
      <path d="M 335 75 C 335 95, 275 95, 275 75" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.6" />
      <polygon points="273,77 275,72 277,77" fill="var(--matrix-green)" opacity="0.6" />
      <text x="305" y="100" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.7">feedback + bugs filed</text>

      {/* Tools */}
      <rect x="320" y="85" width="50" height="14" rx="2" fill="none"
        stroke="var(--matrix-green)" strokeWidth="0.8" opacity="0.5" />
      <text x="345" y="94" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4.5" fontFamily="monospace" opacity="0.7">browser, tests</text>

      {/* Result */}
      <rect x="255" y="115" width="100" height="24" rx="4" fill="var(--matrix-green)" opacity="0.1"
        stroke="var(--matrix-green)" strokeWidth="1" />
      <text x="305" y="128" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace">adversarial pressure</text>
      <text x="305" y="137" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.7">quality improves over iterations</text>

      <text x="305" y="158" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="5" fontFamily="monospace" opacity="0.7">cost: 2x tokens + latency</text>
      <text x="305" y="170" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.7">tuning: 5-10 iterations</text>

      {/* Footer */}
      <text x="200" y="192" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="7" fontFamily="monospace" opacity="0.8">
        THE MODEL THAT DID THE WORK CANNOT JUDGE THE WORK
      </text>
      <text x="200" y="207" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" opacity="0.5">
        separation of concerns applies to evaluation too
      </text>
    </svg>
  );
}
