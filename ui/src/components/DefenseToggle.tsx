interface DefenseToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  warning?: string;
}

export default function DefenseToggle({
  label,
  description,
  checked,
  onChange,
  warning,
}: DefenseToggleProps) {
  return (
    <label className="flex items-start gap-3 p-3 rounded border border-[var(--matrix-border)] hover:border-gray-500 transition cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 accent-[var(--matrix-green)] w-4 h-4"
      />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-gray-200">{label}</span>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        {warning && checked && (
          <p className="text-xs text-[var(--matrix-yellow)] mt-1">{warning}</p>
        )}
      </div>
      <span
        className={`text-xs px-2 py-0.5 rounded ${
          checked
            ? "bg-[var(--matrix-green)]/20 text-[var(--matrix-green)]"
            : "bg-gray-800 text-gray-500"
        }`}
      >
        {checked ? "ON" : "OFF"}
      </span>
    </label>
  );
}
