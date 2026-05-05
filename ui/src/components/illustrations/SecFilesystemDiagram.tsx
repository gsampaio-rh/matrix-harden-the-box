interface Props {
  className?: string;
}

export default function SecFilesystemDiagram({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 300 130" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Container boundary */}
      <rect x="20" y="8" width="260" height="115" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.6" />
      <text x="150" y="24" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace" opacity="0.5">CONTAINER</text>

      {/* Root FS (read-only) */}
      <rect x="35" y="35" width="120" height="35" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="95" y="50" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="8" fontFamily="monospace">readOnlyRoot</text>
      <text x="95" y="63" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">Filesystem</text>

      {/* /tmp emptyDir (writable) */}
      <rect x="35" y="80" width="120" height="30" rx="4" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1.5" opacity="0.7" />
      <text x="95" y="99" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="8" fontFamily="monospace" opacity="0.8">/tmp (emptyDir)</text>

      {/* Attacker actions blocked */}
      <rect x="175" y="35" width="90" height="22" rx="3" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.4" />
      <text x="220" y="50" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.5">write /bin</text>
      <line x1="180" y1="46" x2="260" y2="46" stroke="var(--matrix-red)"
        strokeWidth="1" opacity="0.5" />

      <rect x="175" y="63" width="90" height="22" rx="3" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.4" />
      <text x="220" y="78" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.5">write /etc</text>
      <line x1="180" y1="74" x2="260" y2="74" stroke="var(--matrix-red)"
        strokeWidth="1" opacity="0.5" />

      <rect x="175" y="91" width="90" height="22" rx="3" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.5" />
      <text x="220" y="106" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.6">write /tmp OK</text>
    </svg>
  );
}
