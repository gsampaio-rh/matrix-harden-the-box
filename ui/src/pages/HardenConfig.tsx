import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AttackSimulation from "../components/AttackSimulation";
import ProgressBar from "../components/ProgressBar";
import { api } from "../api";
import { SCENARIO_ILLUSTRATION, CATEGORY_COLORS } from "../constants/scenarios";
import type { Scenario, ScenarioAnswer, TeamScore } from "../types";

export default function HardenConfig() {
  const navigate = useNavigate();
  const teamId = localStorage.getItem("teamId");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attackData, setAttackData] = useState<TeamScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    if (!teamId) navigate("/login");
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
        const data = res as { chapters: Record<string, { submitted: boolean }> };
        if (data.chapters?.contain?.submitted) {
          setSubmitted(true);
          setStep(-1);
        }
      })
      .catch(() => {});
  }, [teamId]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    api
      .getTimer()
      .then((res) => {
        const t = res as { active: boolean; end_time: string | null };
        if (t.active && t.end_time) {
          const endMs = new Date(t.end_time).getTime();
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

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
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
    navigate("/contain/results");
  }, [navigate]);

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
          <p className="text-[var(--matrix-green)] font-bold text-lg">
            Submission locked
          </p>
          <p className="text-sm text-gray-500">
            Your answers have been submitted.
          </p>
          {error && (
            <p className="text-sm text-[var(--matrix-red)]">{error}</p>
          )}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate("/contain/results")}
              className="bg-[var(--matrix-green)] text-black font-bold px-8 py-3 rounded hover:brightness-110 transition"
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

      <div key={current.id} className="space-y-6 animate-fade-in">
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
          {(() => {
            const Illustration = SCENARIO_ILLUSTRATION[current.id];
            return Illustration ? (
              <Illustration className="hidden sm:block w-full max-w-xs mx-auto mb-4 opacity-80" />
            ) : null;
          })()}
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

