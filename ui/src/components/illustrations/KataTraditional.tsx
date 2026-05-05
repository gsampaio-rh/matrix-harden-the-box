interface Props {
  className?: string;
}

export default function KataTraditional({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Host node boundary */}
      <rect x="20" y="10" width="360" height="180" rx="8" fill="none"
        stroke="var(--matrix-border)" strokeWidth="1.5" opacity="0.5" />
      <text x="200" y="28" textAnchor="middle" fill="var(--matrix-border)"
        fontSize="8" fontFamily="monospace" opacity="0.7">HOST NODE</text>

      {/* Pod A */}
      <rect x="40" y="42" width="90" height="50" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="85" y="63" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">POD A</text>
      <text x="85" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">app:v1</text>

      {/* Pod B */}
      <rect x="155" y="42" width="90" height="50" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="200" y="63" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">POD B</text>
      <text x="200" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">api:v2</text>

      {/* Pod C */}
      <rect x="270" y="42" width="90" height="50" rx="6" fill="none"
        stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.8" />
      <text x="315" y="63" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace">POD C</text>
      <text x="315" y="78" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">db:v1</text>

      {/* Connection lines from pods to kernel */}
      <line x1="85" y1="92" x2="85" y2="130" stroke="var(--matrix-yellow)"
        strokeWidth="1" opacity="0.5" />
      <line x1="200" y1="92" x2="200" y2="130" stroke="var(--matrix-yellow)"
        strokeWidth="1" opacity="0.5" />
      <line x1="315" y1="92" x2="315" y2="130" stroke="var(--matrix-yellow)"
        strokeWidth="1" opacity="0.5" />

      {/* Shared Linux Kernel */}
      <rect x="40" y="130" width="320" height="40" rx="6" fill="none"
        stroke="var(--matrix-yellow)" strokeWidth="1.5" opacity="0.8" />
      <text x="200" y="150" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="10" fontFamily="monospace">SHARED LINUX KERNEL</text>
      <text x="200" y="163" textAnchor="middle" fill="var(--matrix-yellow)"
        fontSize="7" fontFamily="monospace" opacity="0.5">syscalls · namespaces · cgroups</text>
    </svg>
  );
}
