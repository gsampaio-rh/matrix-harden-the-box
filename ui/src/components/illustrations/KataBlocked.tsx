interface Props {
  className?: string;
}

export default function KataBlocked({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Host node boundary */}
      <rect x="10" y="5" width="380" height="210" rx="8" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1.5" opacity="0.5" />
      <text x="200" y="20" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="8" fontFamily="monospace" opacity="0.7">HOST NODE</text>

      {/* microVM A — compromised */}
      <rect x="20" y="28" width="110" height="110" rx="6" fill="none"
        stroke="var(--matrix-red)" strokeWidth="2" strokeDasharray="6 3" opacity="0.9" />
      <text x="75" y="42" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.8">microVM</text>
      <rect x="35" y="48" width="80" height="36" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="2" opacity="0.9" />
      <text x="75" y="63" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="9" fontFamily="monospace">ATTACKER</text>
      <text x="75" y="78" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.7">CVE exploit</text>
      <rect x="35" y="92" width="80" height="28" rx="4" fill="none"
        stroke="var(--matrix-red)" strokeWidth="1" opacity="0.5" />
      <text x="75" y="110" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.6">guest kernel</text>
      <line x1="75" y1="84" x2="75" y2="92" stroke="var(--matrix-red)"
        strokeWidth="1.5" opacity="0.7" />

      {/* Attack blocked at microVM wall */}
      <line x1="130" y1="80" x2="143" y2="80" stroke="var(--matrix-red)"
        strokeWidth="2" opacity="0.8" />
      <polygon points="141,80 135,76 135,84" fill="var(--matrix-red)" opacity="0.8" />
      {/* Block X */}
      <line x1="140" y1="72" x2="152" y2="88" stroke="var(--matrix-red)"
        strokeWidth="2.5" opacity="0.9" />
      <line x1="152" y1="72" x2="140" y2="88" stroke="var(--matrix-red)"
        strokeWidth="2.5" opacity="0.9" />

      {/* microVM B — safe */}
      <rect x="145" y="28" width="110" height="110" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.8" />
      <text x="200" y="42" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.6">microVM</text>
      <rect x="160" y="48" width="80" height="36" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="200" y="65" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">POD B</text>
      <text x="200" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">api:v2</text>
      <rect x="160" y="92" width="80" height="28" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.5" />
      <text x="200" y="110" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">guest kernel</text>
      <line x1="200" y1="84" x2="200" y2="92" stroke="var(--matrix-yellow)"
        strokeWidth="1" opacity="0.4" />
      {/* Checkmark */}
      <text x="240" y="58" fill="var(--matrix-green)" fontSize="14"
        fontFamily="monospace" opacity="0.9">&#x2713;</text>

      {/* microVM C — safe */}
      <rect x="270" y="28" width="110" height="110" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.8" />
      <text x="325" y="42" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.6">microVM</text>
      <rect x="285" y="48" width="80" height="36" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="325" y="65" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">POD C</text>
      <text x="325" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">db:v1</text>
      <rect x="285" y="92" width="80" height="28" rx="4" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.5" />
      <text x="325" y="110" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">guest kernel</text>
      <line x1="325" y1="84" x2="325" y2="92" stroke="var(--matrix-yellow)"
        strokeWidth="1" opacity="0.4" />
      {/* Checkmark */}
      <text x="365" y="58" fill="var(--matrix-green)" fontSize="14"
        fontFamily="monospace" opacity="0.9">&#x2713;</text>

      {/* Connections to hypervisor */}
      <line x1="75" y1="138" x2="75" y2="158" stroke="var(--matrix-red)"
        strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
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
        stroke="var(--matrix-green)" strokeWidth="1" opacity="0.6" />
      <text x="200" y="203" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.6">host kernel (safe)</text>
    </svg>
  );
}
