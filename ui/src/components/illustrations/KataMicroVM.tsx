interface Props {
  className?: string;
}

export default function KataMicroVM({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Host node boundary */}
      <rect x="10" y="5" width="380" height="210" rx="8" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1.5" opacity="0.5" />
      <text x="200" y="20" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="8" fontFamily="monospace" opacity="0.7">HOST NODE</text>

      {/* microVM A */}
      <rect x="20" y="28" width="110" height="110" rx="6" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.7" />
      <text x="75" y="42" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="7" fontFamily="monospace" opacity="0.6">microVM</text>
      <rect x="35" y="48" width="80" height="36" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="75" y="65" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">POD A</text>
      <text x="75" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">app:v1</text>
      <rect x="35" y="92" width="80" height="28" rx="4" fill="none"
        stroke="var(--matrix-yellow)" strokeWidth="1" opacity="0.6" />
      <text x="75" y="110" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="7" fontFamily="monospace" opacity="0.7">guest kernel</text>
      {/* Connection pod → guest kernel */}
      <line x1="75" y1="84" x2="75" y2="92" stroke="var(--matrix-yellow)"
        strokeWidth="1" opacity="0.4" />

      {/* microVM B */}
      <rect x="145" y="28" width="110" height="110" rx="6" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.7" />
      <text x="200" y="42" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="7" fontFamily="monospace" opacity="0.6">microVM</text>
      <rect x="160" y="48" width="80" height="36" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="200" y="65" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">POD B</text>
      <text x="200" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">api:v2</text>
      <rect x="160" y="92" width="80" height="28" rx="4" fill="none"
        stroke="var(--matrix-yellow)" strokeWidth="1" opacity="0.6" />
      <text x="200" y="110" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="7" fontFamily="monospace" opacity="0.7">guest kernel</text>
      <line x1="200" y1="84" x2="200" y2="92" stroke="var(--matrix-yellow)"
        strokeWidth="1" opacity="0.4" />

      {/* microVM C */}
      <rect x="270" y="28" width="110" height="110" rx="6" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.7" />
      <text x="325" y="42" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="7" fontFamily="monospace" opacity="0.6">microVM</text>
      <rect x="285" y="48" width="80" height="36" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="325" y="65" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">POD C</text>
      <text x="325" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">db:v1</text>
      <rect x="285" y="92" width="80" height="28" rx="4" fill="none"
        stroke="var(--matrix-yellow)" strokeWidth="1" opacity="0.6" />
      <text x="325" y="110" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="7" fontFamily="monospace" opacity="0.7">guest kernel</text>
      <line x1="325" y1="84" x2="325" y2="92" stroke="var(--matrix-yellow)"
        strokeWidth="1" opacity="0.4" />

      {/* Connections from microVMs to hypervisor */}
      <line x1="75" y1="138" x2="75" y2="158" stroke="var(--matrix-blue)"
        strokeWidth="1" opacity="0.4" />
      <line x1="200" y1="138" x2="200" y2="158" stroke="var(--matrix-blue)"
        strokeWidth="1" opacity="0.4" />
      <line x1="325" y1="138" x2="325" y2="158" stroke="var(--matrix-blue)"
        strokeWidth="1" opacity="0.4" />

      {/* Hypervisor layer */}
      <rect x="20" y="158" width="360" height="28" rx="6" fill="none"
        stroke="var(--matrix-blue)" strokeWidth="1.5" opacity="0.8" />
      <text x="200" y="176" textAnchor="middle" fill="var(--matrix-blue)"
        fontSize="9" fontFamily="monospace">KATA RUNTIME + QEMU/Cloud Hypervisor</text>

      {/* Host kernel */}
      <rect x="20" y="190" width="360" height="18" rx="4" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1" opacity="0.4" />
      <text x="200" y="203" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="7" fontFamily="monospace" opacity="0.5">host kernel (isolated)</text>
    </svg>
  );
}
