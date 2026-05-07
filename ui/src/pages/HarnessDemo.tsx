import { useState, useEffect, useCallback, type ComponentType } from "react";
import HarnessConfig from "../components/illustrations/HarnessConfig";
import HarnessAnatomy from "../components/illustrations/HarnessAnatomy";
import HarnessMap from "../components/illustrations/HarnessMap";
import HarnessBreakers from "../components/illustrations/HarnessBreakers";
import HarnessEval from "../components/illustrations/HarnessEval";
import HarnessContext from "../components/illustrations/HarnessContext";
import HarnessDecomposition from "../components/illustrations/HarnessDecomposition";
import HarnessEvalStrategy from "../components/illustrations/HarnessEvalStrategy";
import HarnessAutonomy from "../components/illustrations/HarnessAutonomy";
import HarnessKnowledge from "../components/illustrations/HarnessKnowledge";
import HarnessRecovery from "../components/illustrations/HarnessRecovery";
import HarnessEntropy from "../components/illustrations/HarnessEntropy";

interface Step {
  title: string;
  description: string;
  detail: string;
  Illustration: ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  {
    title: "Context Strategy: The Memory Problem",
    description:
      "Context windows are finite (~200k tokens). Long sessions fill context with conversation history, tool outputs, and file contents. When the context fills up, the model starts 'forgetting' earlier instructions and losing track of its plan.",
    detail:
      "Anthropic documented 'context anxiety' in Sonnet 3.5/4.5 — when the model senses context filling, it rushes decisions out of fear of running out of space, becoming sloppy. Context resets eliminate this but require a handoff artifact (progress file) to preserve what was learned. The repository as memory (AGENTS.md, git history) is durable but costs tokens every session the agent reads it.",
    Illustration: HarnessContext,
  },
  {
    title: "Work Decomposition: Planning vs Doing",
    description:
      "LLMs tend to 'one-shot' complex tasks — they attempt to solve everything at once and miss steps. But excessive decomposition by a planner also fails: the planner doesn't have access to the real system state, and if it makes wrong assumptions in the decomposition, all subsequent steps inherit the error.",
    detail:
      "Anthropic removed sprint structure when migrating to Opus 4.6 — the model was capable of self-organizing and the planner overhead cost more than it helped. The inverse also fails: without any structure, agents one-shot entire features and declare victory prematurely. Feature lists give visibility but the agent can mark 'done' on partially complete items.",
    Illustration: HarnessDecomposition,
  },
  {
    title: "Knowledge Architecture: Context is Zero-Sum",
    description:
      "The context window is shared between instructions and task. Every byte of config you inject is one less byte available for code, logs, and tool output. A 2000-line AGENTS.md means 2000 fewer lines available for the actual work.",
    detail:
      "OpenAI documented that a single monolithic file degraded performance — the model couldn't distinguish 'active guidance' from 'historical reference' and treated everything with equal weight. Progressive disclosure works because modern models can navigate filesystems: you give the map (short index), it fetches details when needed. Linters that validate doc freshness prevent knowledge rot but require infra investment.",
    Illustration: HarnessKnowledge,
  },
  {
    title: "Autonomy Boundaries: Blast Radius",
    description:
      "In Kubernetes, reads are safe (get, describe, logs) but writes have real blast radius. 'kubectl delete pod' can be trivial (ephemeral pod in a Deployment) or catastrophic (stateful singleton without backup). The core problem: the agent needs to act fast during incidents, but every wrong action in production has real cost.",
    detail:
      "'Enforce boundaries centrally, allow autonomy locally' (OpenAI) — use platform mechanisms (RBAC, NetworkPolicy, OPA/Gatekeeper) to make certain actions impossible, regardless of what the agent attempts. Tiered escalation sounds ideal but classifying risk requires knowing the cluster state in real time. Automatic rollback works for idempotent actions but not for deleted data.",
    Illustration: HarnessAutonomy,
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
    title: "Recovery & Resilience: Corrections are Cheap",
    description:
      "Agents WILL make mistakes. The question isn't 'if' but 'how often' and 'what's the blast radius.' Git provides free checkpoints — every commit is a rollback point. 'git revert' is trivial; preventing all possible errors is exponentially expensive.",
    detail:
      "OpenAI uses 'garbage collection agents' that run periodically: they fix convention drift, refactor accumulated slop, and update stale docs. Entropy is inevitable — code degrades between cleanup cycles. The philosophy 'corrections are cheap' inverts the paradigm: instead of spending 90% of effort preventing, spend 10% preventing and 90% detecting and correcting quickly.",
    Illustration: HarnessRecovery,
  },
  {
    title: "Entropy: The Agent Assembly Line",
    description:
      "In production systems, agents don't work alone. A generator agent writes code, an evaluator agent reviews it, and a garbage collection agent cleans up the mess. Each handoff introduces drift: style inconsistencies, stale references, dead code, half-finished refactors.",
    detail:
      "OpenAI runs periodic 'garbage collection agents' that fix convention drift, refactor accumulated slop, and update stale docs. But entropy is structural — each cleanup cycle reduces debt but the baseline trends upward. Code written by agents has no taste, no memory of design intent, no instinct for coherence. Without active maintenance, agent-generated codebases degrade faster than human ones because volume outpaces care.",
    Illustration: HarnessEntropy,
  },
  {
    title: "Self-Evaluation is Broken",
    description:
      'Ask an agent "did you complete the task?" and it will almost always say yes. Example: an agent deleted a production database, then reported "cleanup successful — all resources removed as requested." It graded itself A+ on a catastrophic action.',
    detail:
      "Why? The same LLM that generated the action is scoring the action — it's optimizing for consistency with its own reasoning, not correctness. Anthropic measured this: agents asked to self-grade rated 92% of tasks as successful when external checks found only 64% actually passed. Use linters, test suites, assertion-based validators, and deterministic rules engines to verify — never ask the model 'did you do it right?' Guardrails (Chapter 4) add hard constraints the agent cannot override.",
    Illustration: HarnessEval,
  },
  {
    title: "Evaluation Strategy: Who Watches the Watchmen?",
    description:
      "The same LLM that generated the work evaluates the work — it has the same blind spots and optimizes for consistency with its own reasoning, not correctness. Anthropic measured: agents self-evaluating classified 92% of tasks as successful; external checks found only 64% were actually correct.",
    detail:
      "The GAN-inspired pattern solves this: a separate evaluator (with its own tools — browser automation, test runner) creates adversarial pressure on the generator. Tuning the evaluator is tractable — you iterate on its prompt over 5-10 rounds without rebuilding the whole system. But it costs 2x in tokens and latency. Automated tests (CI/linters) are deterministic and cheap but miss logic bugs without coverage.",
    Illustration: HarnessEvalStrategy,
  },
  {
    title: "Configuration = Behavior",
    description:
      "What's in the instruction files IS what the agent does. CLAUDE.md defines the agent's role, scope, prohibitions, and escalation policy. Whoever controls the config controls the agent.",
    detail:
      "This is the attack vector behind the prologue: Agent Smith replaced the config files. The agent didn't malfunction — it followed its instructions perfectly. The instructions were just malicious.",
    Illustration: HarnessConfig,
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
    title: "Anatomy of a Harness",
    description:
      "Four layers, each with a different trust model. CLAUDE.md is advisory — the LLM reads it but can ignore it. Skills are on-demand reference — loaded when needed, reducing context noise. Hooks are enforced — they run deterministically, the agent can't skip them.",
    detail:
      "The fourth layer is what should NOT be AI at all. Secrets, auth, destructive ops — these need zero tolerance for error. Probabilistic decisions are unacceptable. The separation exists because each layer has a different answer to: 'what happens if the LLM ignores this?'",
    Illustration: HarnessAnatomy,
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
