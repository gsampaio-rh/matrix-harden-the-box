interface Props {
  className?: string;
}

export default function SecRootDiagram({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 300 130" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Container boundary */}
      <rect x="20" y="8" width="260" height="115" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.6" />
      <text x="150" y="24" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace" opacity="0.5">CONTAINER</text>

      {/* UID 1001 (correct) */}
      <rect x="35" y="35" width="100" height="35" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="85" y="50" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">runAsNonRoot</text>
      <text x="85" y="63" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">UID 1001</text>

      {/* Root (crossed out) */}
      <rect x="35" y="80" width="100" height="30" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.4" />
      <text x="85" y="99" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="8" fontFamily="monospace" opacity="0.5">root (UID 0)</text>
      <line x1="40" y1="95" x2="130" y2="95" stroke="var(--matrix-red)"
        strokeWidth="1.5" opacity="0.6" />

      {/* Port 8080 (correct) */}
      <rect x="165" y="35" width="100" height="35" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="215" y="50" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">:8080</text>
      <text x="215" y="63" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">unprivileged</text>

      {/* Port 80 (crossed out) */}
      <rect x="165" y="80" width="100" height="30" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.4" />
      <text x="215" y="99" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="8" fontFamily="monospace" opacity="0.5">:80 (root)</text>
      <line x1="170" y1="95" x2="260" y2="95" stroke="var(--matrix-red)"
        strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}
