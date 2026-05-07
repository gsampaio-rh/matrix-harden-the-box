export default function ProgressBar({
  current,
  total,
  labels,
  color = "var(--matrix-green)",
}: {
  current: number;
  total: number;
  labels?: string[];
  color?: string;
}) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-gray-600 font-mono">
        <span>{labels && current < labels.length ? labels[current] : `${current}/${total}`}</span>
        <span>{labels ? `${current + 1}/${total}` : `${Math.round(pct)}%`}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
        <div
          className="h-full transition-all duration-500 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
