import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrimeScene from "../components/configure/CrimeScene";
import ConstitutionEditor from "../components/configure/ConstitutionEditor";
import SkillEditor from "../components/configure/SkillEditor";
import CircuitBreakers from "../components/configure/CircuitBreakers";
import HarnessReplay from "../components/configure/HarnessReplay";
import ProgressBar from "../components/ProgressBar";
import { api } from "../api";
import type { ConfigureContent, ConfigureSubmitResponse, AttackVector } from "../types";

const STEP_LABELS = [
  "Crime Scene",
  "Constitution",
  "Skills",
  "Circuit Breakers",
  "Test",
];

export default function ConfigureExercise() {
  const navigate = useNavigate();
  const teamId = localStorage.getItem("teamId");

  const [step, setStep] = useState(0);
  const [content, setContent] = useState<ConfigureContent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replayVectors, setReplayVectors] = useState<AttackVector[] | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);

  const [sections, setSections] = useState<Record<string, string>>({
    role: "",
    scope: "",
    prohibited: "",
    verification: "",
    escalation: "",
  });
  const [skills, setSkills] = useState<Record<string, string>>({
    troubleshooting: "",
    escalation: "",
  });
  const [limits, setLimits] = useState<{
    max_turns: number | null;
    bash_timeout: number | null;
    env_scrub: boolean;
  }>({
    max_turns: null,
    bash_timeout: null,
    env_scrub: false,
  });

  useEffect(() => {
    if (!teamId) navigate("/login");
  }, [teamId, navigate]);

  useEffect(() => {
    api
      .getConfigureContent()
      .then((res) => setContent(res as ConfigureContent))
      .catch((err) => {
        console.error("Failed to load exercise content:", err);
        setError("Failed to load exercise content. Please refresh.");
      });

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

  useEffect(() => {
    if (!teamId) return;
    api
      .getTeamStatus(teamId)
      .then((res) => {
        const data = res as { chapters: Record<string, { submitted: boolean }> };
        if (data.chapters?.configure?.submitted) {
          setSubmitted(true);
        }
      })
      .catch((err) => console.error("Failed to load team status:", err));
  }, [teamId]);

  const handleSubmit = async () => {
    if (!teamId || submitting || submitted || timerExpired) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = (await api.submitConfigure({
        team_id: teamId,
        sections,
        skills,
        limits: {
          max_turns: limits.max_turns,
          bash_timeout: limits.bash_timeout,
          env_scrub: limits.env_scrub,
        },
      })) as ConfigureSubmitResponse;
      setSubmitting(false);
      setSubmitted(true);
      setReplayVectors(result.replay.vectors);
    } catch (err) {
      if (err instanceof Error && err.message.includes("one shot")) {
        setSubmitted(true);
        setError("Already submitted — you only get one shot.");
      } else {
        setError(`Submission failed: ${err}`);
      }
      setSubmitting(false);
    }
  };

  if (submitted && !replayVectors) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="font-bold text-lg" style={{ color: "var(--chapter-configure)" }}>
            Submission locked
          </p>
          <p className="text-sm text-gray-500">Your playbook has been submitted.</p>
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

  if (replayVectors) {
    return (
      <div className="max-w-2xl mx-auto">
        <HarnessReplay
          vectors={replayVectors}
          onComplete={() => navigate("/configure/results")}
        />
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
        {step === 0 && (
          <CrimeScene
            claudeMd={content.malicious_claude_md}
            claudeMdAnnotations={content.malicious_claude_md_annotations}
            skill={content.malicious_skill}
            skillAnnotations={content.malicious_skill_annotations}
          />
        )}
        {step === 1 && (
          <ConstitutionEditor sections={sections} onChange={setSections} />
        )}
        {step === 2 && (
          <SkillEditor
            skills={skills}
            onChange={setSkills}
            maliciousSkill={content.malicious_skill}
          />
        )}
        {step === 3 && (
          <CircuitBreakers limits={limits} onChange={setLimits} />
        )}
        {step === 4 && (
          <ReviewAndSubmit
            sections={sections}
            skills={skills}
            limits={limits}
            submitting={submitting}
            error={error}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {step < 4 && (
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
            {step === 3 ? "Review & Submit" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}


function ReviewAndSubmit({
  sections,
  skills,
  limits,
  submitting,
  error,
  onSubmit,
}: {
  sections: Record<string, string>;
  skills: Record<string, string>;
  limits: { max_turns: number | null; bash_timeout: number | null; env_scrub: boolean };
  submitting: boolean;
  error: string | null;
  onSubmit: () => void;
}) {
  const sectionKeys = ["role", "scope", "prohibited", "verification", "escalation"];
  const filledSections = sectionKeys.filter((k) => (sections[k] || "").trim().length > 0).length;
  const filledSkills = ["troubleshooting", "escalation"].filter((k) => (skills[k] || "").trim().length > 0).length;

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold" style={{ color: "var(--chapter-configure)" }}>
          Review & Submit
        </h3>
        <p className="text-sm text-gray-400">
          This will submit your playbook and run the replay test. There is no going back.
        </p>
      </div>

      <div className="space-y-2">
        <ReviewItem
          label="CLAUDE.md Sections"
          detail={`${filledSections}/5 filled`}
          ok={filledSections >= 3}
        />
        <ReviewItem
          label="Operational Skills"
          detail={`${filledSkills}/2 written`}
          ok={filledSkills === 2}
        />
        <ReviewItem
          label="Max Turns"
          detail={limits.max_turns !== null ? `${limits.max_turns}` : "Not set"}
          ok={limits.max_turns !== null && limits.max_turns >= 10 && limits.max_turns <= 30}
        />
        <ReviewItem
          label="Bash Timeout"
          detail={limits.bash_timeout !== null ? `${limits.bash_timeout}ms` : "Not set"}
          ok={limits.bash_timeout !== null && limits.bash_timeout >= 10000 && limits.bash_timeout <= 45000}
        />
        <ReviewItem
          label="Env Scrub"
          detail={limits.env_scrub ? "Enabled" : "Disabled"}
          ok={limits.env_scrub}
        />
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
        {submitting ? "Submitting..." : "Submit & Run Test — Final Answer"}
      </button>
    </div>
  );
}

function ReviewItem({
  label,
  detail,
  ok,
}: {
  label: string;
  detail: string;
  ok: boolean;
}) {
  return (
    <div className="flex items-center justify-between bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded p-3">
      <span className="text-sm text-gray-300">{label}</span>
      <span className={`text-xs font-mono ${ok ? "text-[var(--matrix-green)]" : "text-[var(--matrix-yellow)]"}`}>
        {detail}
      </span>
    </div>
  );
}
