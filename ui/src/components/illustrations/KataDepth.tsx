interface Props {
  className?: string;
}

export default function KataDepth({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Layer 2 — Kata / Infrastructure (outermost) */}
      <rect x="15" y="10" width="370" height="200" rx="10" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="2" strokeDasharray="8 4" opacity="0.7" />
      <text x="200" y="28" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="9" fontFamily="monospace" fontWeight="bold">LAYER 2: KATA CONTAINERS</text>
      <text x="200" y="40" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="7" fontFamily="monospace" opacity="0.6">microVM isolation · dedicated kernel · hardware boundary</text>

      {/* Layer 1 — K8s Security (inner) */}
      <rect x="45" y="52" width="310" height="130" rx="8" fill="none"
        stroke="var(--matrix-green)" strokeWidth="2" opacity="0.8" />
      <text x="200" y="68" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace" fontWeight="bold">LAYER 1: K8s HARDENING</text>
      <text x="200" y="80" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.6">what you configured in the exercise</text>

      {/* Three pillars */}
      <rect x="62" y="90" width="84" height="42" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.6" />
      <text x="104" y="107" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace">NetworkPolicy</text>
      <text x="104" y="120" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.5">ingress/egress</text>

      <rect x="158" y="90" width="84" height="42" rx="4" fill="none"
        stroke="var(--matrix-yellow)" strokeWidth="1" opacity="0.6" />
      <text x="200" y="107" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="8" fontFamily="monospace">RBAC</text>
      <text x="200" y="120" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="6" fontFamily="monospace" opacity="0.5">roles/bindings</text>

      <rect x="254" y="90" width="84" height="42" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.6" />
      <text x="296" y="107" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace">SecurityCtx</text>
      <text x="296" y="120" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.5">root/caps/fs</text>

      {/* Pod at center bottom */}
      <rect x="145" y="142" width="110" height="30" rx="5" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.9" />
      <text x="200" y="161" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">YOUR POD</text>

      {/* Lines from pillars to pod */}
      <line x1="104" y1="132" x2="165" y2="142" stroke="var(--matrix-green)"
        strokeWidth="1" opacity="0.3" />
      <line x1="200" y1="132" x2="200" y2="142" stroke="var(--matrix-yellow)"
        strokeWidth="1" opacity="0.3" />
      <line x1="296" y1="132" x2="235" y2="142" stroke="var(--matrix-green)"
        strokeWidth="1" opacity="0.3" />

      {/* Attacker arrows stopped at Layer 2 */}
      <line x1="0" y1="110" x2="13" y2="110" stroke="var(--matrix-red)"
        strokeWidth="2" opacity="0.8" />
      <polygon points="12,110 6,106 6,114" fill="var(--matrix-red)" opacity="0.8" />
      <line x1="11" y1="104" x2="19" y2="116" stroke="var(--matrix-red)"
        strokeWidth="2" opacity="0.9" />
      <line x1="19" y1="104" x2="11" y2="116" stroke="var(--matrix-red)"
        strokeWidth="2" opacity="0.9" />

      {/* Bottom label */}
      <text x="200" y="196" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace" opacity="0.8">DEFENSE IN DEPTH</text>
      <text x="200" y="207" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="7" fontFamily="monospace" opacity="0.5">multiple layers · no single point of failure</text>
    </svg>
  );
}
