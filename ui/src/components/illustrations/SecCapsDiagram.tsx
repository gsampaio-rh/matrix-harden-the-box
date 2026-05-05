interface Props {
  className?: string;
}

export default function SecCapsDiagram({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 300 130" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Container boundary */}
      <rect x="20" y="8" width="260" height="115" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.6" />
      <text x="150" y="24" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace" opacity="0.5">CONTAINER</text>

      {/* drop ALL */}
      <rect x="35" y="35" width="105" height="35" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="87" y="50" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">drop: ALL</text>
      <text x="87" y="63" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">capabilities</text>

      {/* allowPrivilegeEscalation: false */}
      <rect x="35" y="80" width="105" height="30" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="87" y="95" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace">noEscalation</text>
      <text x="87" y="105" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="6" fontFamily="monospace" opacity="0.5">: false</text>

      {/* Dropped caps list */}
      <rect x="165" y="35" width="100" height="22" rx="3" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.4" />
      <text x="215" y="50" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.5">NET_RAW</text>
      <line x1="170" y1="46" x2="260" y2="46" stroke="var(--matrix-red)"
        strokeWidth="1" opacity="0.5" />

      <rect x="165" y="63" width="100" height="22" rx="3" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.4" />
      <text x="215" y="78" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.5">SYS_CHROOT</text>
      <line x1="170" y1="74" x2="260" y2="74" stroke="var(--matrix-red)"
        strokeWidth="1" opacity="0.5" />

      <rect x="165" y="91" width="100" height="22" rx="3" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.4" />
      <text x="215" y="106" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.5">KILL</text>
      <line x1="170" y1="102" x2="260" y2="102" stroke="var(--matrix-red)"
        strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
