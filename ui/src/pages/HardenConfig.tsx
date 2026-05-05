import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AttackSimulation from "../components/AttackSimulation";
import { api } from "../api";
import type { Scenario, ScenarioAnswer, TeamScore } from "../types";

const CATEGORY_COLORS: Record<string, string> = {
  Network: "var(--matrix-blue)",
  RBAC: "var(--matrix-yellow)",
  SecurityContext: "var(--matrix-green)",
};

export default function HardenConfig() {
  const navigate = useNavigate();
  const teamId = sessionStorage.getItem("teamId");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attackData, setAttackData] = useState<TeamScore | null>(null);
  const [lastScore, setLastScore] = useState<TeamScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    if (!teamId) navigate("/");
  }, [teamId, navigate]);

  useEffect(() => {
    api
      .getScenarios()
      .then((res) => {
        const data = res as { scenarios: Scenario[] };
        setScenarios(data.scenarios);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!teamId) return;
    api
      .getTeamStatus(teamId)
      .then((res) => {
        const data = res as { submitted: boolean };
        if (data.submitted) {
          setSubmitted(true);
          setStep(-1);
        }
      })
      .catch(() => {});
  }, [teamId]);

  useEffect(() => {
    api
      .getTimer()
      .then((res) => {
        const t = res as { active: boolean; end_time: string | null };
        if (t.active && t.end_time) {
          if (Date.now() >= new Date(t.end_time).getTime()) setTimerExpired(true);
        }
      })
      .catch(() => {});
  }, []);

  const current = scenarios[step] ?? null;
  const isReview = step === scenarios.length && scenarios.length > 0;
  const selected = current ? answers[current.id] ?? null : null;

  const handleSelect = (option: string) => {
    if (!current || submitted) return;
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
  };

  const handleNext = () => {
    if (step < scenarios.length) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!teamId || submitting || submitted || timerExpired) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: ScenarioAnswer[] = Object.entries(answers).map(
        ([scenarioId, selectedOption]) => ({ scenarioId, selectedOption }),
      );
      const result = (await api.submitAnswers(teamId, payload)) as TeamScore;
      setSubmitted(true);
      setAttackData(result);
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

  const handleAttackComplete = useCallback(() => {
    setLastScore(attackData);
    setAttackData(null);
  }, [attackData]);

  if (attackData) {
    return (
      <AttackSimulation
        scoreData={attackData}
        onComplete={handleAttackComplete}
      />
    );
  }

  if (submitted || step === -1) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          {lastScore ? (
            <>
              <div className="text-5xl font-bold tabular-nums">
                <span
                  className={
                    lastScore.score >= lastScore.max_score
                      ? "text-[var(--matrix-green)]"
                      : lastScore.score > 0
                        ? "text-[var(--matrix-yellow)]"
                        : "text-[var(--matrix-red)]"
                  }
                >
                  {lastScore.score}
                </span>
                <span className="text-gray-600 text-3xl">
                  /{lastScore.max_score}
                </span>
              </div>
              {lastScore.achievements.length > 0 && (
                <div className="flex justify-center gap-2 flex-wrap">
                  {lastScore.achievements.map((a) => (
                    <span
                      key={a}
                      className="text-xs bg-[var(--matrix-green)]/10 text-[var(--matrix-green)] px-3 py-1 rounded-full"
                    >
                      {a.replace(/_/g, " ").toUpperCase()}
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={() => navigate("/scoreboard")}
                className="mt-4 bg-[var(--matrix-green)] text-black font-bold px-8 py-3 rounded hover:brightness-110 transition"
              >
                View Scoreboard
              </button>
            </>
          ) : (
            <>
              <p className="text-[var(--matrix-green)] font-bold text-lg">
                Submission locked
              </p>
              <p className="text-sm text-gray-500">
                Check the scoreboard for results.
              </p>
              <button
                onClick={() => navigate("/scoreboard")}
                className="mt-2 bg-[var(--matrix-green)] text-black font-bold px-8 py-3 rounded hover:brightness-110 transition"
              >
                View Scoreboard
              </button>
            </>
          )}
          {error && (
            <p className="text-sm text-[var(--matrix-red)]">{error}</p>
          )}
        </div>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading scenarios...</p>
      </div>
    );
  }

  if (timerExpired) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <p className="text-[var(--matrix-red)] font-bold text-lg uppercase">
            Time's Up
          </p>
          <p className="text-sm text-gray-500">Submissions are locked.</p>
        </div>
      </div>
    );
  }

  if (isReview) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <ProgressBar current={scenarios.length} total={scenarios.length} />
        <div className="text-center space-y-2 py-4">
          <h2 className="text-2xl font-bold text-[var(--matrix-red)] tracking-widest">
            CONFIRM SUBMISSION
          </h2>
          <p className="text-sm text-gray-400">
            You answered {Object.keys(answers).length} of {scenarios.length}{" "}
            scenarios. There is no going back.
          </p>
        </div>

        <div className="space-y-2">
          {scenarios.map((s, i) => {
            const ans = answers[s.id];
            const opt = ans ? s.options[ans] : null;
            return (
              <div
                key={s.id}
                className="flex items-start gap-3 bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded p-3"
              >
                <span className="text-xs text-gray-600 font-mono w-5 shrink-0 mt-0.5">
                  {i + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-300">{s.title}</span>
                  {opt ? (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {ans?.toUpperCase()}) {opt.label}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--matrix-red)] mt-0.5">
                      Skipped
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="text-sm p-3 rounded bg-[var(--matrix-red)]/10 text-[var(--matrix-red)]">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setStep(scenarios.length - 1)}
            className="flex-1 bg-gray-800 text-gray-300 font-bold py-3 rounded hover:bg-gray-700 transition"
          >
            Go Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-[var(--matrix-red)] text-white font-bold py-3 rounded hover:brightness-110 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit — Final Answer"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProgressBar current={step} total={scenarios.length} />

      <div className="text-center space-y-1">
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{
            color: CATEGORY_COLORS[current.category] ?? "var(--matrix-blue)",
          }}
        >
          {current.category}
        </span>
        <h2 className="text-lg font-bold text-gray-200">{current.title}</h2>
      </div>

      <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-5">
        <p className="text-sm text-gray-300 leading-relaxed">
          {current.situation}
        </p>
      </div>

      <div className="space-y-2">
        {Object.entries(current.options)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, opt]) => {
            const isSelected = selected === key;
            return (
              <label
                key={key}
                className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-all ${
                  isSelected
                    ? "border-[var(--matrix-green)]/40 bg-[var(--matrix-green)]/5"
                    : "border-gray-800 hover:border-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name={current.id}
                  checked={isSelected}
                  onChange={() => handleSelect(key)}
                  className="mt-0.5 accent-[var(--matrix-green)]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-300">
                    <span className="font-mono text-gray-500 mr-2">
                      {key.toUpperCase()})
                    </span>
                    {opt.label}
                  </span>
                  {opt.hint && (
                    <p className="text-xs text-gray-600 mt-1 italic">
                      {opt.hint}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
      </div>

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
          onClick={handleNext}
          disabled={!selected}
          className="flex-1 bg-[var(--matrix-green)] text-black font-bold py-3 rounded hover:brightness-110 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {step === scenarios.length - 1 ? "Review" : "Next"}
        </button>
      </div>
    </div>
  );
}

function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-gray-600 font-mono">
        <span>
          {current}/{total}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
        <div
          className="h-full bg-[var(--matrix-green)] transition-all duration-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
