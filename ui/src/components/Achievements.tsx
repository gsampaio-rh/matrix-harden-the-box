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
        {achievements.map((id) => {
          const ach = ACHIEVEMENTS[id];
          return (
            <span
              key={id}
              title={ach?.description ?? id}
              className="text-sm leading-none"
            >
              {ach?.icon ?? "?"}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {achievements.map((id) => {
        const ach = ACHIEVEMENTS[id];
        if (!ach) return null;
        return (
          <div
            key={id}
            className="flex items-center gap-1.5 bg-[var(--matrix-green)]/5 border border-[var(--matrix-green)]/20 rounded-full px-3 py-1"
            title={ach.description}
          >
            <span className="text-sm leading-none">{ach.icon}</span>
            <span className="text-[10px] text-[var(--matrix-green)] font-bold uppercase tracking-wider">
              {ach.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
