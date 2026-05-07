interface Props {
  className?: string;
}

export default function HarnessEntropy({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 240" className={className} xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="18" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" fontWeight="bold">THE AGENT ASSEMBLY LINE</text>

      {/* Generator agent */}
      <rect x="20" y="40" width="90" height="55" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.7" />
      <text x="65" y="56" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" fontWeight="bold">GENERATOR</text>
      <text x="65" y="68" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.6">writes code</text>
      <text x="65" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.6">implements features</text>
      <text x="65" y="88" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.6">commits to repo</text>

      {/* Arrow gen → eval */}
      <line x1="115" y1="67" x2="145" y2="67" stroke="var(--matrix-border)"
        strokeWidth="1.5" opacity="0.6" />
      <polygon points="143,64 150,67 143,70" fill="var(--matrix-border)" opacity="0.6" />

      {/* Evaluator agent */}
      <rect x="155" y="40" width="90" height="55" rx="4" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1.5" opacity="0.7" />
      <text x="200" y="56" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="6" fontFamily="monospace" fontWeight="bold">EVALUATOR</text>
      <text x="200" y="68" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="5" fontFamily="monospace" opacity="0.6">reviews output</text>
      <text x="200" y="78" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="5" fontFamily="monospace" opacity="0.6">runs tests</text>
      <text x="200" y="88" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="5" fontFamily="monospace" opacity="0.6">files bugs</text>

      {/* Arrow eval → GC */}
      <line x1="250" y1="67" x2="280" y2="67" stroke="var(--matrix-border)"
        strokeWidth="1.5" opacity="0.6" />
      <polygon points="278,64 285,67 278,70" fill="var(--matrix-border)" opacity="0.6" />

      {/* GC agent */}
      <rect x="290" y="40" width="90" height="55" rx="4" fill="none"
        stroke="var(--matrix-amber, orange)" strokeWidth="1.5" opacity="0.7" />
      <text x="335" y="56" textAnchor="middle" fill="orange"
        fontSize="6" fontFamily="monospace" fontWeight="bold">GC AGENT</text>
      <text x="335" y="68" textAnchor="middle" fill="orange"
        fontSize="5" fontFamily="monospace" opacity="0.6">fixes drift</text>
      <text x="335" y="78" textAnchor="middle" fill="orange"
        fontSize="5" fontFamily="monospace" opacity="0.6">refactors slop</text>
      <text x="335" y="88" textAnchor="middle" fill="orange"
        fontSize="5" fontFamily="monospace" opacity="0.6">updates stale docs</text>

      {/* Entropy wave */}
      <text x="200" y="115" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" fontWeight="bold">ENTROPY ACCUMULATES</text>

      {/* Entropy graph */}
      <line x1="40" y1="200" x2="360" y2="200" stroke="var(--matrix-border)"
        strokeWidth="1" opacity="0.4" />
      <line x1="40" y1="130" x2="40" y2="200" stroke="var(--matrix-border)"
        strokeWidth="1" opacity="0.4" />
      <text x="36" y="133" textAnchor="end" fill="var(--matrix-border)"
        fontSize="4.5" fontFamily="monospace" opacity="0.5">debt</text>
      <text x="360" y="210" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="4.5" fontFamily="monospace" opacity="0.5">time</text>

      {/* Sawtooth — debt rises, GC drops it, rises again */}
      <polyline
        points="40,195 80,180 120,165 140,155 140,185 180,170 220,155 240,145 240,178 280,163 320,148 340,140 340,172 360,160"
        fill="none" stroke="var(--matrix-red)" strokeWidth="1.5" opacity="0.7" />

      {/* GC drops annotated */}
      <line x1="140" y1="155" x2="140" y2="185" stroke="var(--matrix-green)"
        strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
      <text x="140" y="125" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4.5" fontFamily="monospace" opacity="0.7">cleanup</text>

      <line x1="240" y1="145" x2="240" y2="178" stroke="var(--matrix-green)"
        strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
      <text x="240" y="125" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4.5" fontFamily="monospace" opacity="0.7">cleanup</text>

      <line x1="340" y1="140" x2="340" y2="172" stroke="var(--matrix-green)"
        strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
      <text x="340" y="125" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4.5" fontFamily="monospace" opacity="0.7">cleanup</text>

      {/* Footer */}
      <text x="200" y="230" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="5.5" fontFamily="monospace" opacity="0.5">
        each cleanup buys time — but the baseline drifts up
      </text>
    </svg>
  );
}
