"""
Chapter 2 (Configure) — Harness Design Trade-off Scoring.

Evaluates team decisions across six dimensions of agent harness design.
Scoring rewards coherence (decisions that reinforce each other),
awareness of trade-offs (justifications that mention both sides),
and a synthesized philosophy statement.

There is no single "right answer" — any coherent, well-justified
combination can achieve maximum score.
"""

import re

from app.configure_content import DIMENSION_IDS

MAX_SCORE = 30

CONFIGURE_ACHIEVEMENTS = {
    "systems_thinker": {
        "label": "Systems Thinker",
        "description": "High coherence score — decisions form a consistent philosophy",
    },
    "tradeoff_aware": {
        "label": "Trade-off Aware",
        "description": "All justifications acknowledge both what you gain and what you lose",
    },
    "philosopher": {
        "label": "Philosopher",
        "description": "Philosophy statement aligns with choices and articulates a clear stance",
    },
    "complete_architect": {
        "label": "Complete Architect",
        "description": "All six dimensions answered with substantive justifications",
    },
    "contrarian": {
        "label": "Contrarian",
        "description": "Chose at least one uncommon option (A or D in any dimension) with strong justification",
    },
}

# ── Coherence matrix ─────────────────────────────────────────────────
# Pairs of (dim_id, option_id) that reinforce or contradict each other.

REINFORCING_PAIRS: list[tuple[tuple[str, str], tuple[str, str]]] = [
    (("context_strategy", "B"), ("knowledge_architecture", "B")),
    (("context_strategy", "C"), ("knowledge_architecture", "D")),
    (("evaluation_strategy", "B"), ("autonomy_boundaries", "B")),
    (("evaluation_strategy", "B"), ("autonomy_boundaries", "C")),
    (("autonomy_boundaries", "A"), ("recovery_resilience", "A")),
    (("autonomy_boundaries", "C"), ("recovery_resilience", "B")),
    (("autonomy_boundaries", "C"), ("recovery_resilience", "C")),
    (("work_decomposition", "A"), ("evaluation_strategy", "B")),
    (("work_decomposition", "D"), ("recovery_resilience", "C")),
    (("knowledge_architecture", "B"), ("context_strategy", "D")),
    (("autonomy_boundaries", "D"), ("recovery_resilience", "A")),
    (("work_decomposition", "C"), ("evaluation_strategy", "C")),
]

CONTRADICTING_PAIRS: list[tuple[tuple[str, str], tuple[str, str]]] = [
    (("autonomy_boundaries", "C"), ("recovery_resilience", "A")),
    (("autonomy_boundaries", "A"), ("recovery_resilience", "B")),
    (("evaluation_strategy", "D"), ("work_decomposition", "B")),
    (("knowledge_architecture", "A"), ("context_strategy", "B")),
    (("autonomy_boundaries", "C"), ("evaluation_strategy", "D")),
    (("work_decomposition", "A"), ("autonomy_boundaries", "A")),
]

# Keywords that indicate trade-off awareness in justifications
TRADEOFF_INDICATORS = [
    "but", "however", "although", "trade-off", "tradeoff", "downside",
    "cost", "risk", "sacrifice", "give up", "lose", "at the expense",
    "on the other hand", "despite", "accepting", "willing to",
    "even though", "acknowledg", "aware that", "limitation",
    "porém", "mas", "embora", "custo", "risco",
]


def _justification_shows_awareness(text: str) -> bool:
    lower = text.lower()
    return any(indicator in lower for indicator in TRADEOFF_INDICATORS)


def _justification_is_substantive(text: str, min_chars: int = 30) -> bool:
    return len(text.strip()) >= min_chars


# ── Scoring functions ────────────────────────────────────────────────

def score_awareness(choices: list[dict]) -> dict:
    """Score whether justifications show trade-off awareness (max 12)."""
    results = {}
    total = 0

    for choice in choices:
        dim_id = choice["dimension_id"]
        justification = choice.get("justification", "")
        aware = _justification_shows_awareness(justification)
        substantive = _justification_is_substantive(justification)
        pts = 0
        if substantive:
            pts += 1
        if aware:
            pts += 1
        results[dim_id] = {
            "points": pts,
            "max": 2,
            "substantive": substantive,
            "shows_tradeoff": aware,
        }
        total += pts

    return {"score": total, "max_score": 12, "breakdown": results}


def score_coherence(choices: list[dict]) -> dict:
    """Score internal consistency via reinforcing/contradicting pairs (max 10)."""
    choice_map = {c["dimension_id"]: c["option_id"] for c in choices}

    reinforcements = 0
    contradictions = 0
    reinforcement_details = []
    contradiction_details = []

    for (d1, o1), (d2, o2) in REINFORCING_PAIRS:
        if choice_map.get(d1) == o1 and choice_map.get(d2) == o2:
            reinforcements += 1
            reinforcement_details.append({"pair": [f"{d1}:{o1}", f"{d2}:{o2}"]})

    for (d1, o1), (d2, o2) in CONTRADICTING_PAIRS:
        if choice_map.get(d1) == o1 and choice_map.get(d2) == o2:
            contradictions += 1
            contradiction_details.append({"pair": [f"{d1}:{o1}", f"{d2}:{o2}"]})

    raw_score = (reinforcements * 2) - (contradictions * 3)
    score = max(0, min(10, raw_score + 4))

    return {
        "score": score,
        "max_score": 10,
        "reinforcements": reinforcements,
        "contradictions": contradictions,
        "reinforcement_details": reinforcement_details,
        "contradiction_details": contradiction_details,
    }


def score_philosophy(philosophy: str, choices: list[dict]) -> dict:
    """Score the philosophy statement (max 5)."""
    total = 0
    breakdown = {}

    exists = len(philosophy.strip()) >= 20
    breakdown["exists"] = exists
    if exists:
        total += 1

    mentions_tradeoff = _justification_shows_awareness(philosophy)
    breakdown["mentions_tradeoff"] = mentions_tradeoff
    if mentions_tradeoff:
        total += 2

    choice_map = {c["dimension_id"]: c["option_id"] for c in choices}
    alignment_keywords = _extract_philosophy_alignment(philosophy, choice_map)
    aligned = len(alignment_keywords) >= 2
    breakdown["aligned"] = aligned
    breakdown["alignment_keywords"] = alignment_keywords
    if aligned:
        total += 2

    return {"score": total, "max_score": 5, "breakdown": breakdown}


def _extract_philosophy_alignment(philosophy: str, choice_map: dict) -> list[str]:
    """Check if philosophy keywords align with chosen options."""
    lower = philosophy.lower()
    found = []

    alignment_signals = {
        ("context_strategy", "B"): ["reset", "fresh", "clean slate", "handoff"],
        ("context_strategy", "C"): ["repository", "versioned", "git", "file"],
        ("context_strategy", "D"): ["hybrid", "compaction", "within session"],
        ("work_decomposition", "A"): ["sprint", "plan", "decompos", "contract"],
        ("work_decomposition", "B"): ["free", "goal", "autonom", "flexible"],
        ("work_decomposition", "D"): ["incremental", "checkpoint", "commit"],
        ("evaluation_strategy", "B"): ["evaluator", "qa", "external", "separate"],
        ("evaluation_strategy", "C"): ["test", "ci", "lint", "automat"],
        ("evaluation_strategy", "D"): ["human", "review", "approve"],
        ("autonomy_boundaries", "A"): ["read-only", "suggest", "observe"],
        ("autonomy_boundaries", "B"): ["scoped", "boundar", "namespace"],
        ("autonomy_boundaries", "C"): ["autonomy", "rollback", "fast"],
        ("autonomy_boundaries", "D"): ["tiered", "escala", "risk level"],
        ("knowledge_architecture", "B"): ["map", "pointer", "minimal", "progressive"],
        ("knowledge_architecture", "D"): ["enforce", "linter", "golden", "mechanical"],
        ("recovery_resilience", "A"): ["prevent", "guardrail", "strict"],
        ("recovery_resilience", "B"): ["detect", "correct", "cheap"],
        ("recovery_resilience", "C"): ["checkpoint", "rollback", "revert"],
        ("recovery_resilience", "D"): ["cleanup", "garbage", "background"],
    }

    for (dim, opt), keywords in alignment_signals.items():
        if choice_map.get(dim) == opt:
            for kw in keywords:
                if kw in lower:
                    found.append(kw)
                    break

    return found


def score_completeness(choices: list[dict], philosophy: str) -> dict:
    """Score completeness of submission (max 3)."""
    total = 0

    answered_dims = {c["dimension_id"] for c in choices if c.get("option_id")}
    all_answered = len(answered_dims) == len(DIMENSION_IDS)
    if all_answered:
        total += 2

    all_justified = all(
        _justification_is_substantive(c.get("justification", ""))
        for c in choices
    )
    if all_justified:
        total += 1

    return {
        "score": total,
        "max_score": 3,
        "all_dimensions_answered": all_answered,
        "all_justified": all_justified,
        "answered_count": len(answered_dims),
    }


# ── Full evaluation ─────────────────────────────────────────────────

def evaluate_submission(choices: list[dict], philosophy: str) -> dict:
    awareness = score_awareness(choices)
    coherence = score_coherence(choices)
    philosophy_score = score_philosophy(philosophy, choices)
    completeness = score_completeness(choices, philosophy)

    total = (
        awareness["score"]
        + coherence["score"]
        + philosophy_score["score"]
        + completeness["score"]
    )

    return {
        "score": total,
        "max_score": MAX_SCORE,
        "awareness": awareness,
        "coherence": coherence,
        "philosophy": philosophy_score,
        "completeness": completeness,
    }


def compute_achievements(breakdown: dict, is_first_submission: bool) -> list[str]:
    earned = []

    if breakdown["coherence"]["score"] >= 7:
        earned.append("systems_thinker")

    if breakdown["awareness"]["score"] >= 10:
        earned.append("tradeoff_aware")

    if breakdown["philosophy"]["score"] >= 4:
        earned.append("philosopher")

    if breakdown["completeness"]["all_dimensions_answered"] and breakdown["completeness"]["all_justified"]:
        earned.append("complete_architect")

    if is_first_submission:
        earned.append("first_blood")

    return earned
