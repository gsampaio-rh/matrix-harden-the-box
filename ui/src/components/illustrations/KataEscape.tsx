interface Props {
  className?: string;
}

export default function KataEscape({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Host node boundary */}
      <rect x="20" y="10" width="360" height="180" rx="8" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1.5" opacity="0.5" />
      <text x="200" y="28" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="8" fontFamily="monospace" opacity="0.7">HOST NODE</text>

      {/* Pod A — compromised */}
      <rect x="40" y="42" width="90" height="50" rx="6" fill="none"
        stroke="var(--matrix-red)" strokeWidth="2" opacity="0.9" />
      <text x="85" y="60" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="9" fontFamily="monospace">ATTACKER</text>
      <text x="85" y="74" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.7">CVE exploit</text>

      {/* Pod B — victim */}
      <rect x="155" y="42" width="90" height="50" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.5" />
      <text x="200" y="63" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace" opacity="0.5">POD B</text>
      <text x="200" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.3">api:v2</text>

      {/* Pod C — victim */}
      <rect x="270" y="42" width="90" height="50" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.5" />
      <text x="315" y="63" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace" opacity="0.5">POD C</text>
      <text x="315" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.3">db:v1</text>

      {/* Attack path: attacker → kernel */}
      <line x1="85" y1="92" x2="85" y2="130" stroke="var(--matrix-red)"
        strokeWidth="2" opacity="0.9" />
      <polygon points="85,128 81,120 89,120" fill="var(--matrix-red)" opacity="0.9" />

      {/* Attack path: kernel → Pod B */}
      <line x1="140" y1="140" x2="200" y2="92" stroke="var(--matrix-red)"
        strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <polygon points="200,94 194,102 200,102" fill="var(--matrix-red)" opacity="0.7" />

      {/* Attack path: kernel → Pod C */}
      <line x1="260" y1="140" x2="315" y2="92" stroke="var(--matrix-red)"
        strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <polygon points="315,94 309,102 315,102" fill="var(--matrix-red)" opacity="0.7" />

      {/* Neutral lines */}
      <line x1="200" y1="92" x2="200" y2="130" stroke="var(--matrix-yellow)"
        strokeWidth="1" opacity="0.3" />
      <line x1="315" y1="92" x2="315" y2="130" stroke="var(--matrix-yellow)"
        strokeWidth="1" opacity="0.3" />

      {/* Shared Linux Kernel — compromised */}
      <rect x="40" y="130" width="320" height="40" rx="6" fill="none"
        stroke="var(--matrix-red)" strokeWidth="2" opacity="0.8" />
      <text x="200" y="150" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="10" fontFamily="monospace">SHARED LINUX KERNEL</text>
      <text x="200" y="163" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="7" fontFamily="monospace" opacity="0.6">kernel exploit → full host access</text>
    </svg>
  );
}
