"""
Chapter 2 (Configure) — Harness Design Trade-offs.

Content for the exercise where teams make structured decisions across
six dimensions of agent harness design, each presenting genuine
engineering trade-offs from real-world long-running agent systems.
"""

BRIEFING = {
    "title": "The Long-Running Agent Challenge",
    "scenario": (
        "You are the harness architect for an SRE agent that operates "
        "autonomously on your organization's Kubernetes cluster. The agent "
        "works in long sessions — incident investigation, remediation, "
        "monitoring — and must be effective across multiple context windows."
    ),
    "challenges": [
        {
            "text": "Agents lose coherence as the context window fills",
            "source": "Anthropic — Effective Harnesses for Long-Running Agents",
        },
        {
            "text": "Each new session starts with no memory of what came before",
            "source": "Anthropic — Effective Harnesses for Long-Running Agents",
        },
        {
            "text": "Context is a scarce resource — too many instructions crowd out the task",
            "source": "OpenAI — Harness Engineering",
        },
        {
            "text": "Self-evaluation is biased — agents confidently praise their own mediocre work",
            "source": "Anthropic — Harness Design for Long-Running Apps",
        },
        {
            "text": "Harness overhead (decomposition, eval, handoff) competes with execution speed",
            "source": "Anthropic — Harness Design for Long-Running Apps",
        },
    ],
    "prompt": (
        "For each dimension of harness design, choose a position and "
        "justify the trade-offs. There is no single right answer — "
        "coherence and awareness of what you're giving up matter more "
        "than any particular choice."
    ),
}

DIMENSIONS = [
    {
        "id": "context_strategy",
        "title": "Context Strategy",
        "question": "How does the agent carry state between sessions?",
        "source": "Anthropic — compaction vs context resets; OpenAI — progressive disclosure",
        "options": [
            {
                "id": "A",
                "label": "Compaction",
                "description": (
                    "Summarize history inline, agent keeps going on shortened context."
                ),
                "pros": "Continuity preserved; no handoff overhead",
                "cons": "Context anxiety persists; summaries lose nuance",
            },
            {
                "id": "B",
                "label": "Context Reset + Handoff Artifact",
                "description": (
                    "Fresh slate each session. A structured progress file "
                    "bridges the gap between sessions."
                ),
                "pros": "Clean state eliminates anxiety; agent starts fresh",
                "cons": "Handoff overhead; risk of losing context nuance",
            },
            {
                "id": "C",
                "label": "Repository as Memory",
                "description": (
                    "All knowledge lives in versioned files (AGENTS.md, progress "
                    "logs, git history). Agent reads on startup."
                ),
                "pros": "Durable; auditable; survives any number of resets",
                "cons": "Agent spends tokens reading; knowledge can rot without maintenance",
            },
            {
                "id": "D",
                "label": "Hybrid",
                "description": (
                    "Compaction within a session, reset between sessions with "
                    "minimal structured handoff."
                ),
                "pros": "Balanced approach; best of both worlds",
                "cons": "Orchestration complexity; two mechanisms to maintain",
            },
        ],
        "tradeoff_summary": (
            "Continuity vs. clean slate. How much context does the agent "
            "need to carry vs. how much can it reconstruct?"
        ),
    },
    {
        "id": "work_decomposition",
        "title": "Work Decomposition",
        "question": "How granular should task breakdown be?",
        "source": (
            "Anthropic — sprint structure removed with Opus 4.6; "
            "planner over-specifying cascades errors; "
            "OpenAI — break down into building blocks"
        ),
        "options": [
            {
                "id": "A",
                "label": "Sprint Structure",
                "description": (
                    "Planner decomposes work into sprints with contracts per "
                    "feature. Generator and evaluator negotiate what 'done' "
                    "looks like before coding."
                ),
                "pros": "Clear focus; testable contracts; predictable scope",
                "cons": "Overhead per sprint; rigid; planner errors cascade",
            },
            {
                "id": "B",
                "label": "Free-form + Goal",
                "description": (
                    "Agent receives high-level objective, decides its own "
                    "decomposition as it works."
                ),
                "pros": "Flexible; agent adapts to reality as it goes",
                "cons": "Risk of one-shotting or losing coherence on large tasks",
            },
            {
                "id": "C",
                "label": "Feature List",
                "description": (
                    "Exhaustive checklist of features/tasks. Agent picks one, "
                    "marks progress, moves to next."
                ),
                "pros": "High visibility; clear definition of done",
                "cons": "Agent may declare victory prematurely; list can rot",
            },
            {
                "id": "D",
                "label": "Incremental with Checkpoints",
                "description": (
                    "Agent works in small increments, commits after each. "
                    "No explicit planner — just steady forward progress."
                ),
                "pros": "Simple; clean git history; easy rollback",
                "cons": "No big-picture view; may drift without plan",
            },
        ],
        "tradeoff_summary": (
            "Planning overhead vs. risk of losing direction. "
            "How much structure does the agent need to stay on track?"
        ),
    },
    {
        "id": "evaluation_strategy",
        "title": "Evaluation Strategy",
        "question": "How do you verify the agent's work?",
        "source": (
            "Anthropic — self-eval is biased; GAN-inspired evaluator; "
            "tuning evaluator takes iterations; "
            "OpenAI — agent-to-agent review"
        ),
        "options": [
            {
                "id": "A",
                "label": "Self-evaluation",
                "description": (
                    "Agent checks its own work before delivering. "
                    "Reviews output against criteria it was given."
                ),
                "pros": "Fast and cheap; no extra infrastructure",
                "cons": "Biased; 'confidently praises mediocre work'",
            },
            {
                "id": "B",
                "label": "External Evaluator",
                "description": (
                    "Separate agent does QA with tools (browser automation, "
                    "test execution). Grades against criteria and files bugs."
                ),
                "pros": "Catches real bugs; unbiased; drives iteration",
                "cons": "2x cost; latency; requires careful tuning of evaluator",
            },
            {
                "id": "C",
                "label": "Automated Tests Only",
                "description": (
                    "CI pipeline, linting, type-checks as quality gate. "
                    "No qualitative agent evaluation."
                ),
                "pros": "Mechanical and reliable; fast feedback; deterministic",
                "cons": "Misses UX issues, logic bugs without coverage, subtle regressions",
            },
            {
                "id": "D",
                "label": "Human-in-the-Loop Review",
                "description": (
                    "Human reviews agent output before it ships. "
                    "Agent proposes, human disposes."
                ),
                "pros": "Highest confidence; catches taste issues",
                "cons": "Bottleneck on human time; doesn't scale with throughput",
            },
        ],
        "tradeoff_summary": (
            "Cost and latency of evaluation vs. risk of shipping bad work. "
            "Who pays the price — time or quality?"
        ),
    },
    {
        "id": "autonomy_boundaries",
        "title": "Autonomy Boundaries",
        "question": "What can the agent do without asking?",
        "source": (
            "OpenAI — 'enforce boundaries centrally, allow autonomy locally'; "
            "Anthropic — evaluator + generator negotiated contracts"
        ),
        "options": [
            {
                "id": "A",
                "label": "Read-only + Suggest",
                "description": (
                    "Agent observes and recommends; human executes all "
                    "actions. Zero mutations without approval."
                ),
                "pros": "Zero blast radius; full human control",
                "cons": "Total bottleneck on human time; slow incident response",
            },
            {
                "id": "B",
                "label": "Scoped Mutation",
                "description": (
                    "Agent can mutate resources within defined boundaries "
                    "(own namespace, specific resource types). Everything "
                    "else requires approval."
                ),
                "pros": "Balanced; predictable boundaries; fast within scope",
                "cons": "Boundaries may be too narrow or too wide; tuning needed",
            },
            {
                "id": "C",
                "label": "Full Autonomy + Rollback",
                "description": (
                    "Agent acts freely. Automatic rollback triggers if "
                    "health-checks fail after an action."
                ),
                "pros": "Maximum throughput; no human bottleneck",
                "cons": "High blast radius between action and detection; rollback isn't free",
            },
            {
                "id": "D",
                "label": "Tiered Escalation",
                "description": (
                    "Actions classified by risk level. Low-risk = autonomous; "
                    "medium = log + notify; high = block and ask human."
                ),
                "pros": "Granular; proportional response; auditable",
                "cons": "Classification is hard to get right; edge cases accumulate",
            },
        ],
        "tradeoff_summary": (
            "Speed of resolution vs. blast radius. "
            "How much do you trust the agent vs. requiring a human safety net?"
        ),
    },
    {
        "id": "knowledge_architecture",
        "title": "Knowledge Architecture",
        "question": "How much do you tell the agent upfront?",
        "source": (
            "OpenAI — 'map not encyclopedia'; 'one big AGENTS.md failed'; "
            "progressive disclosure; docs as system of record"
        ),
        "options": [
            {
                "id": "A",
                "label": "Monolithic Instructions",
                "description": (
                    "One large file with everything the agent needs. "
                    "Complete reference in a single document."
                ),
                "pros": "Complete; agent never misses information",
                "cons": "Crowds out task context; rots fast; becomes non-guidance",
            },
            {
                "id": "B",
                "label": "Map + Pointers",
                "description": (
                    "Short entry point (~100 lines) with pointers to "
                    "specialized docs. Agent navigates as needed."
                ),
                "pros": "Scalable; lightweight; progressive disclosure",
                "cons": "Agent may not find relevant info; depends on good organization",
            },
            {
                "id": "C",
                "label": "Just-in-Time Injection",
                "description": (
                    "Context injected dynamically based on current task. "
                    "Orchestrator decides what's relevant."
                ),
                "pros": "Efficient use of context window; task-focused",
                "cons": "Depends on smart orchestrator; agent loses big picture",
            },
            {
                "id": "D",
                "label": "Layered + Enforced",
                "description": (
                    "Versioned docs with linters that validate freshness. "
                    "'Golden principles' enforced mechanically via CI."
                ),
                "pros": "Resists entropy; self-maintaining; scales with codebase",
                "cons": "High setup cost; rigidity; maintenance overhead for linters",
            },
        ],
        "tradeoff_summary": (
            "Information density vs. discoverability. "
            "How much to give upfront vs. how much the agent discovers on its own."
        ),
    },
    {
        "id": "recovery_resilience",
        "title": "Recovery & Resilience",
        "question": "What happens when the agent goes off the rails?",
        "source": (
            "Anthropic — git as rollback mechanism; "
            "OpenAI — 'corrections are cheap'; entropy/garbage collection"
        ),
        "options": [
            {
                "id": "A",
                "label": "Prevention-heavy",
                "description": (
                    "Strict guardrails prevent the agent from making mistakes. "
                    "Constraints block bad actions before they happen."
                ),
                "pros": "Few incidents; predictable behavior",
                "cons": "Restricts capability; false positives block legitimate work",
            },
            {
                "id": "B",
                "label": "Detection + Correction",
                "description": (
                    "Agent acts freely. System detects deviations and "
                    "corrects them (revert, re-run, flag)."
                ),
                "pros": "High throughput; doesn't block legitimate work",
                "cons": "Window of damage between error and detection",
            },
            {
                "id": "C",
                "label": "Checkpoint + Rollback",
                "description": (
                    "Agent commits at intervals. If something breaks, "
                    "rollback to last known-good checkpoint."
                ),
                "pros": "Clean recovery; bounded damage; auditable via git",
                "cons": "Checkpoint overhead; doesn't catch subtle/gradual errors",
            },
            {
                "id": "D",
                "label": "Continuous Cleanup",
                "description": (
                    "Background agents do periodic 'garbage collection' — "
                    "fix drift, refactor slop, update stale docs."
                ),
                "pros": "Organic evolution; debt stays low over time",
                "cons": "Tech debt accumulates between cleanup cycles; reactive",
            },
        ],
        "tradeoff_summary": (
            "Prevention vs. correction. How much to invest in avoiding "
            "errors vs. recovering from them quickly?"
        ),
    },
]

DIMENSION_IDS = [d["id"] for d in DIMENSIONS]


def get_content() -> dict:
    return {
        "briefing": BRIEFING,
        "dimensions": DIMENSIONS,
    }
