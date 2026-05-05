interface Props {
  className?: string;
}

export default function NetIngressDiagram({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 300 140" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Pod */}
      <rect x="110" y="45" width="80" height="50" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="150" y="66" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">YOUR POD</text>
      <text x="150" y="80" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">:8080</text>

      {/* Attacker pod (top-left) */}
      <rect x="5" y="10" width="65" height="36" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.6" />
      <text x="37" y="26" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.7">ATTACKER</text>
      <text x="37" y="38" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.5">other-ns</text>

      {/* Random pod (bottom-left) */}
      <rect x="5" y="95" width="65" height="36" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.6" />
      <text x="37" y="111" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.7">ANY POD</text>
      <text x="37" y="123" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.5">any-ns</text>

      {/* Frontend (top-right) */}
      <rect x="235" y="10" width="60" height="36" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.6" />
      <text x="265" y="26" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.7">FRONTEND</text>
      <text x="265" y="38" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.5">your-ns</text>

      {/* Kubelet (bottom-right) */}
      <rect x="235" y="95" width="60" height="36" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.6" />
      <text x="265" y="111" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.7">KUBELET</text>
      <text x="265" y="123" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.5">health</text>

      {/* Blocked ingress */}
      <line x1="72" y1="32" x2="108" y2="55" stroke="var(--matrix-red)"
        strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
      <line x1="72" y1="110" x2="108" y2="88" stroke="var(--matrix-red)"
        strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

      {/* Allowed ingress */}
      <line x1="233" y1="32" x2="192" y2="55" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.7" />
      <line x1="233" y1="110" x2="192" y2="88" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.7" />

      {/* Labels */}
      <text x="85" y="38" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.6">DENY</text>
      <text x="85" y="105" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="6" fontFamily="monospace" opacity="0.6">DENY</text>
      <text x="218" y="38" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.6">ALLOW</text>
      <text x="218" y="105" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.6">ALLOW</text>
    </svg>
  );
}
