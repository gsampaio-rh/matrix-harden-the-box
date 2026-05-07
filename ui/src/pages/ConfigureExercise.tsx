import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { api } from "../api";
import type { ConfigureContent, ConfigureSubmitResponse, Dimension, DimensionChoice } from "../types";

const STEP_LABELS = ["Briefing", "Dimensions", "Philosophy", "Review"];

export default function ConfigureExercise() {
  const navigate = useNavigate();
  const teamId = localStorage.getItem("teamId");

  const [step, setStep] = useState(0);
  const [content, setContent] = useState<ConfigureContent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);

  const [choices, setChoices] = useState<Record<string, DimensionChoice>>({});
  const [philosophy, setPhilosophy] = useState("");

  useEffect(() => {
    if (!teamId) navigate("/login");
  }, [teamId, navigate]);

  useEffect(() => {
    api
      .getConfigureContent()
      .then((res) => setContent(res))
      .catch(() => setError("Failed to load exercise content. Please refresh."));

    let intervalId: ReturnType<typeof setInterval> | null = null;
    api
      .getTimer()
      .then((res) => {
        if (res.active && res.end_time) {
          const endMs = new Date(res.end_time).getTime();
          if (Date.now() >= endMs) {
            setTimerExpired(true);
            return;
          }
          intervalId = setInterval(() => {
            if (Date.now() >= endMs) {
              setTimerExpired(true);
              if (intervalId) clearInterval(intervalId);
            }
          }, 1000);
        }
      })
      .catch(() => {});
    return () => { if (intervalId) clearInterval(intervalId); };
  }, []);

  useEffect(() => {
    if (!teamId) return;
    api
      .getTeamStatus(teamId)
      .then((res) => {
        if (res.chapters?.configure?.submitted) setSubmitted(true);
      })
      .catch(() => {});
  }, [teamId]);

  const handleChoiceChange = (dimId: string, optionId: string) => {
    setChoices((prev) => ({
      ...prev,
      [dimId]: { ...prev[dimId], dimension_id: dimId, option_id: optionId, justification: prev[dimId]?.justification || "" },
    }));
  };

  const handleJustificationChange = (dimId: string, text: string) => {
    setChoices((prev) => ({
      ...prev,
      [dimId]: { ...prev[dimId], dimension_id: dimId, option_id: prev[dimId]?.option_id || "", justification: text },
    }));
  };

  const handleSubmit = async () => {
    if (!teamId || submitting || submitted || timerExpired) return;
    setSubmitting(true);
    setError(null);
    try {
      const choicesList = Object.values(choices).filter((c) => c.option_id);
      await api.submitConfigure({
        team_id: teamId,
        choices: choicesList,
        philosophy,
      }) as ConfigureSubmitResponse;
      setSubmitted(true);
      navigate("/configure/results");
    } catch (err) {
      if (err instanceof Error && err.message.includes("one shot")) {
        setSubmitted(true);
        setError("Already submitted — you only get one shot.");
      } else {
        setError(`Submission failed: ${err}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="font-bold text-lg" style={{ color: "var(--chapter-configure)" }}>
            Submission locked
          </p>
          <p className="text-sm text-gray-500">Your harness design has been submitted.</p>
          {error && <p className="text-sm text-[var(--matrix-red)]">{error}</p>}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate("/configure/results")}
              className="font-bold px-8 py-3 rounded hover:brightness-110 transition text-black"
              style={{ backgroundColor: "var(--chapter-configure)" }}
            >
              View Results
            </button>
            <button
              onClick={() => navigate("/scoreboard")}
              className="bg-gray-800 text-gray-300 font-bold px-8 py-3 rounded hover:bg-gray-700 transition"
            >
              Scoreboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (timerExpired) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <p className="text-[var(--matrix-red)] font-bold text-lg uppercase">Time's Up</p>
          <p className="text-sm text-gray-500">Submissions are locked.</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {error ? (
          <p className="text-sm text-[var(--matrix-red)]">{error}</p>
        ) : (
          <p className="text-gray-500">Loading exercise...</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <ProgressBar current={step} total={STEP_LABELS.length} labels={STEP_LABELS} color="var(--chapter-configure)" />

      <div key={step} className="animate-fade-in">
        {step === 0 && <BriefingStep briefing={content.briefing} />}
        {step === 1 && (
          <DimensionsStep
            dimensions={content.dimensions}
            choices={choices}
            onChoiceChange={handleChoiceChange}
            onJustificationChange={handleJustificationChange}
          />
        )}
        {step === 2 && <PhilosophyStep philosophy={philosophy} onChange={setPhilosophy} />}
        {step === 3 && (
          <ReviewStep
            dimensions={content.dimensions}
            choices={choices}
            philosophy={philosophy}
            submitting={submitting}
            error={error}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {step < 3 && (
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 bg-gray-800 text-gray-300 font-bold py-3 rounded hover:bg-gray-700 transition"
            >
              Back
            </button>
          )}
          <button
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 font-bold py-3 rounded hover:brightness-110 transition text-black"
            style={{ backgroundColor: "var(--chapter-configure)" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}


function BriefingStep({ briefing }: { briefing: ConfigureContent["briefing"] }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold" style={{ color: "var(--chapter-configure)" }}>
          {briefing.title}
        </h2>
        <p className="text-sm text-gray-400">{briefing.scenario}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
          The Challenges
        </h3>
        {briefing.challenges.map((challenge, i) => (
          <div
            key={i}
            className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded p-4 space-y-1"
          >
            <p className="text-sm text-gray-200">{challenge.text}</p>
            <p className="text-xs text-gray-500 italic">{challenge.source}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--chapter-configure)]/10 border border-[var(--chapter-configure)]/30 rounded p-4">
        <p className="text-sm text-gray-300">{briefing.prompt}</p>
      </div>
    </div>
  );
}


function DimensionsStep({
  dimensions,
  choices,
  onChoiceChange,
  onJustificationChange,
}: {
  dimensions: Dimension[];
  choices: Record<string, DimensionChoice>;
  onChoiceChange: (dimId: string, optionId: string) => void;
  onJustificationChange: (dimId: string, text: string) => void;
}) {
  const [activeDim, setActiveDim] = useState(0);
  const dim = dimensions[activeDim];
  const choice = choices[dim.id];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {dimensions.map((d, i) => {
          const answered = choices[d.id]?.option_id;
          return (
            <button
              key={d.id}
              onClick={() => setActiveDim(i)}
              className={`px-3 py-1.5 text-xs rounded whitespace-nowrap transition ${
                i === activeDim
                  ? "text-black font-bold"
                  : answered
                  ? "bg-gray-700 text-[var(--matrix-green)]"
                  : "bg-gray-800 text-gray-400 hover:text-gray-200"
              }`}
              style={i === activeDim ? { backgroundColor: "var(--chapter-configure)" } : undefined}
            >
              {i + 1}. {d.title}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-100">{dim.title}</h3>
          <p className="text-sm text-gray-300 italic mt-1">"{dim.question}"</p>
          <p className="text-xs text-gray-500 mt-1">{dim.source}</p>
        </div>

        <div className="space-y-2">
          {dim.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onChoiceChange(dim.id, opt.id)}
              className={`w-full text-left p-4 rounded border transition ${
                choice?.option_id === opt.id
                  ? "border-[var(--chapter-configure)] bg-[var(--chapter-configure)]/10"
                  : "border-[var(--matrix-border)] bg-[var(--matrix-card)] hover:border-gray-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-xs font-mono mt-0.5 ${
                  choice?.option_id === opt.id ? "text-[var(--chapter-configure)]" : "text-gray-500"
                }`}>
                  {opt.id}
                </span>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-gray-100">{opt.label}</p>
                  <p className="text-xs text-gray-400">{opt.description}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs text-[var(--matrix-green)]">+ {opt.pros}</span>
                    <span className="text-xs text-[var(--matrix-red)]">- {opt.cons}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded p-3">
          <p className="text-xs text-gray-500 mb-1">Trade-off: {dim.tradeoff_summary}</p>
        </div>

        {choice?.option_id && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase">
              Justify your choice (mention what you're gaining AND giving up)
            </label>
            <textarea
              value={choice.justification || ""}
              onChange={(e) => onJustificationChange(dim.id, e.target.value)}
              placeholder="Why this option? What trade-off are you accepting?"
              className="w-full h-24 bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded p-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-[var(--chapter-configure)]"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {activeDim > 0 && (
          <button
            onClick={() => setActiveDim((i) => i - 1)}
            className="flex-1 bg-gray-800 text-gray-300 text-sm font-bold py-2 rounded hover:bg-gray-700 transition"
          >
            Previous Dimension
          </button>
        )}
        {activeDim < dimensions.length - 1 && (
          <button
            onClick={() => setActiveDim((i) => i + 1)}
            className="flex-1 text-sm font-bold py-2 rounded hover:brightness-110 transition text-black"
            style={{ backgroundColor: "var(--chapter-configure)" }}
          >
            Next Dimension
          </button>
        )}
      </div>
    </div>
  );
}


function PhilosophyStep({
  philosophy,
  onChange,
}: {
  philosophy: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold" style={{ color: "var(--chapter-configure)" }}>
          Philosophy Statement
        </h3>
        <p className="text-sm text-gray-400">
          Synthesize your decisions into 3-5 sentences that capture your harness design philosophy.
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded p-4 space-y-2">
          <p className="text-xs text-gray-500 uppercase font-semibold">Examples of coherent philosophies:</p>
          <ul className="space-y-1 text-xs text-gray-400 italic">
            <li>"Maximize agent autonomy with strong rollback — corrections are cheaper than prevention"</li>
            <li>"Minimal context, maximum enforcement — the agent gets a map, not a book, and linters catch drift"</li>
            <li>"Human always in the loop for mutations — speed is secondary to safety for production systems"</li>
          </ul>
        </div>

        <textarea
          value={philosophy}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What is your harness design philosophy? What principle unifies your choices?"
          className="w-full h-36 bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded p-4 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-[var(--chapter-configure)]"
        />
        <p className="text-xs text-gray-500 text-right">{philosophy.length} chars</p>
      </div>
    </div>
  );
}


function ReviewStep({
  dimensions,
  choices,
  philosophy,
  submitting,
  error,
  onSubmit,
}: {
  dimensions: Dimension[];
  choices: Record<string, DimensionChoice>;
  philosophy: string;
  submitting: boolean;
  error: string | null;
  onSubmit: () => void;
}) {
  const answeredCount = Object.values(choices).filter((c) => c.option_id).length;
  const justifiedCount = Object.values(choices).filter(
    (c) => c.option_id && c.justification.trim().length >= 30
  ).length;

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold" style={{ color: "var(--chapter-configure)" }}>
          Review & Submit
        </h3>
        <p className="text-sm text-gray-400">
          One shot — no going back. Your harness design decisions are final.
        </p>
      </div>

      <div className="space-y-2">
        {dimensions.map((dim) => {
          const choice = choices[dim.id];
          const selectedOpt = dim.options.find((o) => o.id === choice?.option_id);
          return (
            <div
              key={dim.id}
              className="flex items-center justify-between bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded p-3"
            >
              <span className="text-sm text-gray-300">{dim.title}</span>
              <span className={`text-xs font-mono ${selectedOpt ? "text-[var(--matrix-green)]" : "text-[var(--matrix-yellow)]"}`}>
                {selectedOpt ? `${choice.option_id}: ${selectedOpt.label}` : "Not answered"}
              </span>
            </div>
          );
        })}

        <div className="flex items-center justify-between bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded p-3">
          <span className="text-sm text-gray-300">Philosophy Statement</span>
          <span className={`text-xs font-mono ${philosophy.length >= 20 ? "text-[var(--matrix-green)]" : "text-[var(--matrix-yellow)]"}`}>
            {philosophy.length >= 20 ? `${philosophy.length} chars` : "Too short"}
          </span>
        </div>

        <div className="flex items-center justify-between bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded p-3">
          <span className="text-sm text-gray-300">Dimensions answered</span>
          <span className={`text-xs font-mono ${answeredCount === 6 ? "text-[var(--matrix-green)]" : "text-[var(--matrix-yellow)]"}`}>
            {answeredCount}/6
          </span>
        </div>

        <div className="flex items-center justify-between bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded p-3">
          <span className="text-sm text-gray-300">Substantive justifications</span>
          <span className={`text-xs font-mono ${justifiedCount === 6 ? "text-[var(--matrix-green)]" : "text-[var(--matrix-yellow)]"}`}>
            {justifiedCount}/6
          </span>
        </div>
      </div>

      {error && (
        <div className="text-sm p-3 rounded bg-[var(--matrix-red)]/10 text-[var(--matrix-red)]">
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full font-bold py-3 rounded hover:brightness-110 transition disabled:opacity-50 text-white"
        style={{ backgroundColor: "var(--matrix-red)" }}
      >
        {submitting ? "Submitting..." : "Submit Harness Design — Final Answer"}
      </button>
    </div>
  );
}
