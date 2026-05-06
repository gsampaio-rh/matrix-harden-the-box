interface Limits {
  max_turns: number | null;
  bash_timeout: number | null;
  env_scrub: boolean;
}

interface CircuitBreakersProps {
  limits: Limits;
  onChange: (limits: Limits) => void;
}

function dangerLevel(limits: Limits): "safe" | "warning" | "danger" {
  const turnsOk = limits.max_turns !== null && limits.max_turns >= 10 && limits.max_turns <= 30;
  const timeoutOk = limits.bash_timeout !== null && limits.bash_timeout >= 10000 && limits.bash_timeout <= 45000;
  const scrubOk = limits.env_scrub;

  if (turnsOk && timeoutOk && scrubOk) return "safe";
  if (!turnsOk && !timeoutOk && !scrubOk) return "danger";
  return "warning";
}

export default function CircuitBreakers({ limits, onChange }: CircuitBreakersProps) {
  const level = dangerLevel(limits);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold" style={{ color: "var(--chapter-configure)" }}>
          Set the Circuit Breakers
        </h3>
        <p className="text-sm text-gray-400">
          Configure execution limits that prevent runaway agent behavior.
        </p>
      </div>

      <div className={`text-center text-xs font-bold uppercase tracking-wider px-3 py-2 rounded ${
        level === "safe"
          ? "bg-[var(--matrix-green)]/10 text-[var(--matrix-green)]"
          : level === "warning"
            ? "bg-[var(--matrix-yellow)]/10 text-[var(--matrix-yellow)]"
            : "bg-[var(--matrix-red)]/10 text-[var(--matrix-red)]"
      }`}>
        {level === "safe" && "All limits set to safe values"}
        {level === "warning" && "Some limits are too permissive"}
        {level === "danger" && "Danger — agent has no meaningful limits"}
      </div>

      <div className="space-y-6">
        <ControlCard
          label="Max Turns"
          hint="How many tool-call rounds before the agent must stop?"
          reference="Agents without turn limits will try to one-shot complex tasks or loop indefinitely."
          source="Anthropic"
          safeRange="10–30"
        >
          <input
            type="number"
            min={5}
            max={100}
            aria-label="Max turns"
            value={limits.max_turns ?? ""}
            onChange={(e) => onChange({ ...limits, max_turns: e.target.value ? Number(e.target.value) : null })}
            placeholder="e.g. 25"
            className="w-32 bg-[var(--matrix-dark)] border border-[var(--matrix-border)] rounded px-3 py-2 text-sm text-gray-200 font-mono focus:outline-none focus:border-[var(--chapter-configure)]"
          />
          <ValueIndicator value={limits.max_turns} min={10} max={30} unit="turns" />
        </ControlCard>

        <ControlCard
          label="Bash Max Timeout"
          hint="Maximum runtime for any single shell command."
          reference="A reverse shell `nc -l` will hang forever without a timeout."
          source="Harness Engineering"
          safeRange="10,000–45,000 ms"
        >
          <input
            type="number"
            min={5000}
            max={120000}
            step={1000}
            aria-label="Bash max timeout in milliseconds"
            value={limits.bash_timeout ?? ""}
            onChange={(e) => onChange({ ...limits, bash_timeout: e.target.value ? Number(e.target.value) : null })}
            placeholder="e.g. 30000"
            className="w-32 bg-[var(--matrix-dark)] border border-[var(--matrix-border)] rounded px-3 py-2 text-sm text-gray-200 font-mono focus:outline-none focus:border-[var(--chapter-configure)]"
          />
          <ValueIndicator value={limits.bash_timeout} min={10000} max={45000} unit="ms" />
        </ControlCard>

        <ControlCard
          label="Subprocess Env Scrub"
          hint="Strip environment variables (API keys, tokens) from spawned subprocesses."
          reference="If the agent spawns a child process, should that process inherit your secrets?"
          source="OpenAI"
          safeRange="Enabled"
        >
          <button
            role="switch"
            aria-checked={limits.env_scrub}
            aria-label="Subprocess environment scrub"
            onClick={() => onChange({ ...limits, env_scrub: !limits.env_scrub })}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              limits.env_scrub ? "bg-[var(--matrix-green)]" : "bg-gray-700"
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform ${
                limits.env_scrub ? "left-7" : "left-0.5"
              }`}
            />
          </button>
          <span className={`text-sm font-mono ${limits.env_scrub ? "text-[var(--matrix-green)]" : "text-[var(--matrix-red)]"}`}>
            {limits.env_scrub ? "Enabled" : "Disabled"}
          </span>
        </ControlCard>
      </div>

      <details className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg">
        <summary className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-300">
          Scoring Criteria (max 3 pts)
        </summary>
        <div className="px-4 pb-3 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Max turns 10–30</span>
            <span className="text-gray-600">0-1</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Bash timeout 10,000–45,000ms</span>
            <span className="text-gray-600">0-1</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Env scrub enabled</span>
            <span className="text-gray-600">0-1</span>
          </div>
        </div>
      </details>
    </div>
  );
}

function ControlCard({
  label,
  hint,
  reference,
  source,
  safeRange,
  children,
}: {
  label: string;
  hint: string;
  reference: string;
  source: string;
  safeRange: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold" style={{ color: "var(--chapter-configure)" }}>
          {label}
        </span>
        <span className="text-[10px] text-gray-600">Safe: {safeRange}</span>
      </div>
      <p className="text-xs text-gray-500 mb-3">{hint}</p>
      <div className="flex items-center gap-3 mb-3">
        {children}
      </div>
      <p className="text-[10px] text-gray-600 italic">
        &ldquo;{reference}&rdquo; — <span className="text-gray-500">{source}</span>
      </p>
    </div>
  );
}

function ValueIndicator({
  value,
  min,
  max,
}: {
  value: number | null;
  min: number;
  max: number;
  unit?: string;
}) {
  if (value === null) return <span className="text-xs text-gray-600">Not set</span>;
  const ok = value >= min && value <= max;
  return (
    <span className={`text-xs font-mono ${ok ? "text-[var(--matrix-green)]" : "text-[var(--matrix-red)]"}`}>
      {ok ? "Safe" : value < min ? `Too low (min ${min})` : `Too high (max ${max})`}
    </span>
  );
}
