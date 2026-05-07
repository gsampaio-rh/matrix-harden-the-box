interface Props {
  className?: string;
}

export default function HarnessKnowledge({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="18" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" fontWeight="bold">CONTEXT WINDOW IS ZERO-SUM</text>

      {/* Left: Monolithic — overstuffed */}
      <rect x="20" y="30" width="110" height="150" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1.5" opacity="0.7" />
      <text x="75" y="45" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" fontWeight="bold">MONOLITHIC</text>

      <rect x="28" y="52" width="94" height="70" rx="2" fill="var(--matrix-red)" opacity="0.12" />
      <text x="75" y="65" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace">AGENTS.md</text>
      <text x="75" y="76" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace">2000 lines</text>
      <text x="75" y="87" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="4.5" fontFamily="monospace" opacity="0.6">role + scope + rules +</text>
      <text x="75" y="96" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="4.5" fontFamily="monospace" opacity="0.6">history + examples +</text>
      <text x="75" y="105" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="4.5" fontFamily="monospace" opacity="0.6">reference + edge cases</text>
      <text x="75" y="116" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="4.5" fontFamily="monospace" opacity="0.5">noise = guidance</text>

      <rect x="28" y="125" width="94" height="48" rx="2" fill="none"
        stroke="var(--matrix-red)" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.5" />
      <text x="75" y="147" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace" opacity="0.6">tiny space left</text>
      <text x="75" y="159" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="5" fontFamily="monospace" opacity="0.6">for actual work</text>

      {/* Middle: Map + Pointers */}
      <rect x="145" y="30" width="110" height="150" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.7" />
      <text x="200" y="45" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" fontWeight="bold">MAP + POINTERS</text>

      <rect x="153" y="52" width="94" height="28" rx="2" fill="var(--matrix-green)" opacity="0.12" />
      <text x="200" y="65" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace">index (~100 lines)</text>
      <text x="200" y="75" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="4.5" fontFamily="monospace" opacity="0.6">→ docs/api.md</text>

      <rect x="153" y="84" width="94" height="88" rx="2" fill="var(--matrix-green)" opacity="0.06"
        stroke="var(--matrix-green)" strokeWidth="0.8" />
      <text x="200" y="115" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace">available for</text>
      <text x="200" y="128" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace">code, logs,</text>
      <text x="200" y="141" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace">tool output</text>
      <text x="200" y="157" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="5" fontFamily="monospace" opacity="0.5">agent fetches details on demand</text>

      {/* Right: Just-in-Time */}
      <rect x="270" y="30" width="110" height="150" rx="4" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1.5" opacity="0.7" />
      <text x="325" y="45" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="6" fontFamily="monospace" fontWeight="bold">JUST-IN-TIME</text>

      <rect x="278" y="52" width="94" height="16" rx="2" fill="var(--chapter-configure)" opacity="0.12" />
      <text x="325" y="63" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="5" fontFamily="monospace">task-specific context</text>

      <rect x="278" y="72" width="94" height="100" rx="2" fill="var(--chapter-configure)" opacity="0.06"
        stroke="var(--chapter-configure)" strokeWidth="0.8" />
      <text x="325" y="110" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="6" fontFamily="monospace">maximum space</text>
      <text x="325" y="123" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="6" fontFamily="monospace">for the task</text>
      <text x="325" y="143" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="4.5" fontFamily="monospace" opacity="0.7">but: orchestrator decides</text>
      <text x="325" y="155" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="4.5" fontFamily="monospace" opacity="0.7">agent loses big picture</text>

      {/* Footer */}
      <text x="200" y="197" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="7" fontFamily="monospace" opacity="0.8">
        EVERY BYTE OF INSTRUCTIONS COMPETES WITH TASK CONTENT
      </text>
      <text x="200" y="212" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="6" fontFamily="monospace" opacity="0.5">
        "one big AGENTS.md failed" — OpenAI
      </text>
    </svg>
  );
}
