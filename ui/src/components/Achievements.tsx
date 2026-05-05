import { useState, useRef, useEffect } from "react";
import { ACHIEVEMENTS } from "../constants";

interface AchievementsProps {
  achievements: string[];
  compact?: boolean;
}

export default function Achievements({
  achievements,
  compact = false,
}: AchievementsProps) {
  if (achievements.length === 0) return null;

  if (compact) {
    return (
      <div className="flex gap-1 flex-wrap">
        {achievements.map((id) => (
          <AchievementBadge key={id} id={id} compact />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {achievements.map((id) => (
        <AchievementBadge key={id} id={id} />
      ))}
    </div>
  );
}

function AchievementBadge({ id, compact }: { id: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const ach = ACHIEVEMENTS[id];

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!ach) return null;

  if (compact) {
    return (
      <div
        ref={ref}
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-sm leading-none cursor-help"
        >
          {ach.icon}
        </button>
        {open && <Popover ach={ach} />}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-[var(--matrix-green)]/5 border border-[var(--matrix-green)]/20 rounded-full px-3 py-1 cursor-help transition hover:bg-[var(--matrix-green)]/10"
      >
        <span className="text-sm leading-none">{ach.icon}</span>
        <span className="text-[10px] text-[var(--matrix-green)] font-bold uppercase tracking-wider">
          {ach.label}
        </span>
      </button>
      {open && <Popover ach={ach} />}
    </div>
  );
}

function Popover({
  ach,
}: {
  ach: { label: string; icon: string; description: string; howToEarn: string };
}) {
  return (
    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg shadow-xl p-3 text-left pointer-events-none">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-lg">{ach.icon}</span>
        <span className="text-xs font-bold text-[var(--matrix-green)] uppercase tracking-wider">
          {ach.label}
        </span>
      </div>
      <p className="text-[11px] text-gray-400 leading-snug mb-1.5">
        {ach.description}
      </p>
      <p className="text-[10px] text-gray-600 leading-snug">
        <span className="text-gray-500 font-bold">How to earn:</span>{" "}
        {ach.howToEarn}
      </p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[var(--matrix-border)]" />
    </div>
  );
}
