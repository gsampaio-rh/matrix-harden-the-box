interface Props {
  className?: string;
}

export default function HarnessRepo({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 230" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Title */}
      <text x="200" y="16" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" opacity="0.8">SAME PRINCIPLE, DIFFERENT DOMAIN</text>

      {/* ── Left: K8s IaC ────────────────────────────────── */}
      <rect x="15" y="30" width="170" height="160" rx="8" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1.5" opacity="0.7" />
      <text x="100" y="48" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="9" fontFamily="monospace" fontWeight="bold">KUBERNETES IaC</text>

      {/* K8s manifest files */}
      <rect x="28" y="58" width="144" height="20" rx="3" fill="var(--matrix-blue)"
        opacity="0.08" />
      <rect x="28" y="58" width="144" height="20" rx="3" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1" opacity="0.6" />
      <text x="100" y="71" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="7" fontFamily="monospace">deployment.yaml</text>

      <rect x="28" y="84" width="144" height="20" rx="3" fill="var(--matrix-blue)"
        opacity="0.08" />
      <rect x="28" y="84" width="144" height="20" rx="3" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1" opacity="0.6" />
      <text x="100" y="97" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="7" fontFamily="monospace">networkpolicy.yaml</text>

      <rect x="28" y="110" width="144" height="20" rx="3" fill="var(--matrix-blue)"
        opacity="0.08" />
      <rect x="28" y="110" width="144" height="20" rx="3" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1" opacity="0.6" />
      <text x="100" y="123" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="7" fontFamily="monospace">role-binding.yaml</text>

      {/* Arrow down to cluster */}
      <line x1="100" y1="136" x2="100" y2="155" stroke="var(--matrix-blue)"
        strokeWidth="1.5" opacity="0.5" />
      <polygon points="100,158 95,152 105,152" fill="var(--matrix-blue)" opacity="0.5" />

      {/* Cluster box */}
      <rect x="55" y="160" width="90" height="24" rx="4" fill="var(--matrix-blue)"
        opacity="0.1" />
      <rect x="55" y="160" width="90" height="24" rx="4" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1" opacity="0.7" />
      <text x="100" y="175" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="8" fontFamily="monospace" fontWeight="bold">CLUSTER</text>

      {/* ── Center: equals sign ──────────────────────────── */}
      <line x1="192" y1="105" x2="208" y2="105" stroke="var(--matrix-green)"
        strokeWidth="2" opacity="0.6" />
      <line x1="192" y1="112" x2="208" y2="112" stroke="var(--matrix-green)"
        strokeWidth="2" opacity="0.6" />

      {/* ── Right: Agent IaC ─────────────────────────────── */}
      <rect x="215" y="30" width="170" height="160" rx="8" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1.5" opacity="0.7" />
      <text x="300" y="48" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="9" fontFamily="monospace" fontWeight="bold">AGENT IaC</text>

      {/* Agent config files */}
      <rect x="228" y="58" width="144" height="20" rx="3" fill="var(--chapter-configure)"
        opacity="0.08" />
      <rect x="228" y="58" width="144" height="20" rx="3" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1" opacity="0.6" />
      <text x="300" y="71" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="7" fontFamily="monospace">CLAUDE.md</text>

      <rect x="228" y="84" width="144" height="20" rx="3" fill="var(--chapter-configure)"
        opacity="0.08" />
      <rect x="228" y="84" width="144" height="20" rx="3" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1" opacity="0.6" />
      <text x="300" y="97" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="7" fontFamily="monospace">skills/*.md</text>

      <rect x="228" y="110" width="144" height="20" rx="3" fill="var(--chapter-configure)"
        opacity="0.08" />
      <rect x="228" y="110" width="144" height="20" rx="3" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1" opacity="0.6" />
      <text x="300" y="123" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="7" fontFamily="monospace">.cursorrules / hooks</text>

      {/* Arrow down to agent */}
      <line x1="300" y1="136" x2="300" y2="155" stroke="var(--chapter-configure)"
        strokeWidth="1.5" opacity="0.5" />
      <polygon points="300,158 295,152 305,152" fill="var(--chapter-configure)" opacity="0.5" />

      {/* Agent box */}
      <rect x="255" y="160" width="90" height="24" rx="4" fill="var(--chapter-configure)"
        opacity="0.1" />
      <rect x="255" y="160" width="90" height="24" rx="4" fill="none"
        stroke="var(--chapter-configure)" strokeWidth="1" opacity="0.7" />
      <text x="300" y="175" textAnchor="middle" fill="var(--chapter-configure)"
        fontSize="8" fontFamily="monospace" fontWeight="bold">AGENT</text>

      {/* Bottom message */}
      <text x="200" y="207" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace" opacity="0.8">
        IF IT'S NOT IN THE CONFIG, THE AGENT WON'T DO IT
      </text>
      <text x="200" y="222" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.6">
        treat agent config with the same rigor as your infrastructure code
      </text>
    </svg>
  );
}
