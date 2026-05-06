import { useState, useEffect, useCallback, type ComponentType } from "react";
import HarnessConfig from "../components/illustrations/HarnessConfig";
import HarnessRepo from "../components/illustrations/HarnessRepo";
import HarnessAnatomy from "../components/illustrations/HarnessAnatomy";
import HarnessMap from "../components/illustrations/HarnessMap";
import HarnessBrain from "../components/illustrations/HarnessBrain";
import HarnessBreakers from "../components/illustrations/HarnessBreakers";
import HarnessEval from "../components/illustrations/HarnessEval";

interface Step {
  title: string;
  description: string;
  detail: string;
  Illustration: ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  {
    title: "Configuration = Behavior",
    description:
      "What's in the instruction files IS what the agent does. CLAUDE.md defines the agent's role, scope, prohibitions, and escalation policy. Whoever controls the config controls the agent.",
    detail:
      "This is the attack vector behind the prologue: Agent Smith replaced the config files. The agent didn't malfunction — it followed its instructions perfectly. The instructions were just malicious.",
    Illustration: HarnessConfig,
  },
  {
    title: "Infrastructure as Code — for Agents",
    description:
      "Just as Kubernetes manifests define your infrastructure, CLAUDE.md, skills, and rules define your agent. The repo is the single source of truth — it's the agent's equivalent of your cluster YAML.",
    detail:
      "In K8s, if a NetworkPolicy isn't in the manifest, it doesn't exist. Same for agents: if a safety rule isn't in the config files, the agent won't follow it. Treat agent config with the same rigor as your infrastructure code.",
    Illustration: HarnessRepo,
  },
  {
    title: "Anatomy of a Harness",
    description:
      "Four layers, each with a different trust model. CLAUDE.md is advisory — the LLM reads it but can ignore it. Skills are on-demand reference — loaded when needed, reducing context noise. Hooks are enforced — they run deterministically, the agent can't skip them.",
    detail:
      "The fourth layer is what should NOT be AI at all. Secrets, auth, destructive ops — these need zero tolerance for error. Probabilistic decisions are unacceptable. The separation exists because each layer has a different answer to: 'what happens if the LLM ignores this?'",
    Illustration: HarnessAnatomy,
  },
  {
    title: "Map, Not Encyclopedia",
    description:
      "CLAUDE.md should be a concise index — around 80-100 lines. It defines what the agent IS and what it must NEVER do. Skills provide depth for specific tasks.",
    detail:
      "Overloading the main config file turns guidance into noise. The agent can't prioritize 500 rules — but it can follow 5 clear principles. Think road map, not textbook.",
    Illustration: HarnessMap,
  },
  {
    title: "Brain vs Hands",
    description:
      "The 'brain' (LLM reasoning) is separate from the 'hands' (tools and sandbox). The brain decides what to do; the hands execute it. Each tool is an attack surface.",
    detail:
      "Shell access, filesystem operations, network calls, subprocess spawning — every tool the agent can use is a potential vector for exploitation. The sandbox boundary is where trust ends.",
    Illustration: HarnessBrain,
  },
  {
    title: "Circuit Breakers",
    description:
      "Execution limits — max turns, command timeouts, environment scrubbing — are the electrical breakers of agent behavior. They prevent runaway loops, hanging shells, and credential leakage.",
    detail:
      "Without a turn limit, an agent will loop indefinitely trying to solve a problem. Without a timeout, a reverse shell hangs forever. Without env scrub, child processes inherit your secrets.",
    Illustration: HarnessBreakers,
  },
  {
    title: "Self-Evaluation is Broken",
    description:
      'Ask an agent "did you complete the task?" and it will almost always say yes. Example: an agent deleted a production database, then reported "cleanup successful — all resources removed as requested." It graded itself A+ on a catastrophic action.',
    detail:
      "Why? The same LLM that generated the action is scoring the action — it's optimizing for consistency with its own reasoning, not correctness. Anthropic measured this: agents asked to self-grade rated 92% of tasks as successful when external checks found only 64% actually passed. Use linters, test suites, assertion-based validators, and deterministic rules engines to verify — never ask the model 'did you do it right?' Guardrails (Chapter 4) add hard constraints the agent cannot override.",
    Illustration: HarnessEval,
  },
];

export default function HarnessDemo() {
  const [step, setStep] = useState(0);

  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goBack();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goBack]);

  const current = STEPS[step];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--chapter-configure)" }}>
          Harness Engineering
        </h1>
        <p className="text-sm opacity-50 font-mono">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>

      <div key={step} className="animate-fade-in space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center"
          style={{ color: "var(--matrix-green)" }}>
          {current.title}
        </h2>

        <div className="flex justify-center">
          <current.Illustration className="w-full max-w-xl" />
        </div>

        <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-6 space-y-3 max-w-2xl mx-auto">
          <p className="text-sm sm:text-base leading-relaxed">
            {current.description}
          </p>
          <p className="text-sm leading-relaxed opacity-60">
            {current.detail}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            aria-label={`Go to step ${i + 1}`}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i === step ? "var(--chapter-configure)" : "var(--matrix-border)",
              opacity: i === step ? 1 : 0.5,
            }}
          />
        ))}
      </div>

      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <button
          onClick={goBack}
          disabled={step === 0}
          className="px-5 py-2 rounded font-mono text-sm transition-all
                     bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={goNext}
            className="px-5 py-2 rounded font-mono text-sm font-bold transition-all
                       hover:brightness-110"
            style={{ backgroundColor: "var(--chapter-configure)", color: "white" }}
          >
            Next
          </button>
        ) : (
          <a
            href="/configure/exercise"
            className="px-5 py-2 rounded font-mono text-sm font-bold transition-all
                       hover:brightness-110 inline-block"
            style={{ backgroundColor: "var(--chapter-configure)", color: "white" }}
          >
            Start the Exercise
          </a>
        )}
      </div>
    </div>
  );
}
