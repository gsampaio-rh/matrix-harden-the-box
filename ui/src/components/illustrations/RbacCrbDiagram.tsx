interface Props {
  className?: string;
}

export default function RbacCrbDiagram({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 300 140" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* ServiceAccount */}
      <rect x="10" y="50" width="72" height="40" rx="5" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="46" y="68" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace">SERVICE</text>
      <text x="46" y="80" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace">ACCOUNT</text>

      {/* ClusterRoleBinding (crossed out) */}
      <rect x="110" y="10" width="80" height="32" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.5" />
      <text x="150" y="22" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.6">ClusterRole</text>
      <text x="150" y="34" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.6">Binding</text>
      <line x1="115" y1="26" x2="185" y2="26" stroke="var(--matrix-red)"
        strokeWidth="1.5" opacity="0.7" />

      {/* cluster-admin (crossed out) */}
      <rect x="218" y="10" width="72" height="32" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.4" />
      <text x="254" y="30" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.5">cluster-admin</text>
      <line x1="223" y1="26" x2="285" y2="26" stroke="var(--matrix-red)"
        strokeWidth="1" opacity="0.6" />

      {/* Namespace-scoped Role (correct) */}
      <rect x="110" y="58" width="80" height="40" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="150" y="76" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace">ROLE</text>
      <text x="150" y="88" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">(namespace)</text>

      {/* Allowed resources */}
      <rect x="218" y="55" width="72" height="22" rx="3" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1" opacity="0.6" />
      <text x="254" y="70" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="7" fontFamily="monospace" opacity="0.7">pods (get)</text>

      <rect x="218" y="82" width="72" height="22" rx="3" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1" opacity="0.6" />
      <text x="254" y="97" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="7" fontFamily="monospace" opacity="0.7">pods/log</text>

      {/* Blocked resources */}
      <rect x="218" y="112" width="72" height="22" rx="3" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.4" />
      <text x="254" y="127" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.5">* (all)</text>
      <line x1="223" y1="123" x2="285" y2="123" stroke="var(--matrix-red)"
        strokeWidth="1" opacity="0.5" />

      {/* Arrows */}
      <line x1="84" y1="62" x2="108" y2="30" stroke="var(--matrix-red)"
        strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
      <line x1="84" y1="72" x2="108" y2="72" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.7" />
      <line x1="190" y1="70" x2="216" y2="66" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.6" />
      <line x1="190" y1="80" x2="216" y2="90" stroke="var(--matrix-green)"
        strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}
