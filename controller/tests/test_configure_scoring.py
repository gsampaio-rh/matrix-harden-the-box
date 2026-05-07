from app.services.configure_scoring import (
    compute_achievements,
    evaluate_submission,
    score_awareness,
    score_coherence,
    score_completeness,
    score_philosophy,
)

COHERENT_CHOICES = [
    {"dimension_id": "context_strategy", "option_id": "B",
     "justification": "Context resets give a clean slate, but we lose nuance from prior sessions."},
    {"dimension_id": "work_decomposition", "option_id": "D",
     "justification": "Incremental checkpoints keep things simple, however we risk losing big-picture direction."},
    {"dimension_id": "evaluation_strategy", "option_id": "B",
     "justification": "External evaluator catches bugs we'd miss, but doubles our cost and latency."},
    {"dimension_id": "autonomy_boundaries", "option_id": "B",
     "justification": "Scoped mutation gives speed within boundaries, although tuning the scope is tricky."},
    {"dimension_id": "knowledge_architecture", "option_id": "B",
     "justification": "Map + pointers scales well, but the agent might not find what it needs."},
    {"dimension_id": "recovery_resilience", "option_id": "C",
     "justification": "Checkpoint rollback is clean recovery, but adds overhead and misses subtle errors."},
]

INCOHERENT_CHOICES = [
    {"dimension_id": "context_strategy", "option_id": "B",
     "justification": "Fresh slate each time works for us despite the handoff overhead."},
    {"dimension_id": "work_decomposition", "option_id": "B",
     "justification": "Agent decides on its own."},
    {"dimension_id": "evaluation_strategy", "option_id": "D",
     "justification": "Human reviews everything, but it creates a bottleneck."},
    {"dimension_id": "autonomy_boundaries", "option_id": "C",
     "justification": "Full autonomy for maximum speed."},
    {"dimension_id": "knowledge_architecture", "option_id": "A",
     "justification": "Big monolithic file with everything."},
    {"dimension_id": "recovery_resilience", "option_id": "A",
     "justification": "Strict guardrails prevent all mistakes."},
]

EMPTY_CHOICES = [
    {"dimension_id": "context_strategy", "option_id": "", "justification": ""},
    {"dimension_id": "work_decomposition", "option_id": "", "justification": ""},
    {"dimension_id": "evaluation_strategy", "option_id": "", "justification": ""},
    {"dimension_id": "autonomy_boundaries", "option_id": "", "justification": ""},
    {"dimension_id": "knowledge_architecture", "option_id": "", "justification": ""},
    {"dimension_id": "recovery_resilience", "option_id": "", "justification": ""},
]

GOOD_PHILOSOPHY = (
    "We prioritize clean context resets with minimal handoff artifacts, "
    "accepting the cost of rebuilding state each session. External evaluation "
    "justifies scoped autonomy — the tradeoff is higher cost for higher confidence."
)


class TestAwarenessScoring:
    def test_all_tradeoff_aware_max_score(self):
        result = score_awareness(COHERENT_CHOICES)
        assert result["score"] == 12
        assert result["max_score"] == 12

    def test_empty_justifications_zero(self):
        result = score_awareness(EMPTY_CHOICES)
        assert result["score"] == 0

    def test_substantive_without_tradeoff_gets_partial(self):
        choices = [
            {"dimension_id": "context_strategy", "option_id": "A",
             "justification": "This option works well for our use case and keeps things simple for the team."},
        ]
        result = score_awareness(choices)
        assert result["breakdown"]["context_strategy"]["substantive"] is True
        assert result["breakdown"]["context_strategy"]["shows_tradeoff"] is False
        assert result["breakdown"]["context_strategy"]["points"] == 1


class TestCoherenceScoring:
    def test_coherent_choices_high_score(self):
        result = score_coherence(COHERENT_CHOICES)
        assert result["reinforcements"] >= 2
        assert result["contradictions"] == 0
        assert result["score"] >= 6

    def test_incoherent_choices_has_contradictions(self):
        result = score_coherence(INCOHERENT_CHOICES)
        assert result["contradictions"] >= 2

    def test_empty_choices_baseline(self):
        result = score_coherence(EMPTY_CHOICES)
        assert result["score"] == 4
        assert result["reinforcements"] == 0


class TestPhilosophyScoring:
    def test_good_philosophy_high_score(self):
        result = score_philosophy(GOOD_PHILOSOPHY, COHERENT_CHOICES)
        assert result["score"] >= 4

    def test_empty_philosophy_zero(self):
        result = score_philosophy("", COHERENT_CHOICES)
        assert result["score"] == 0

    def test_short_philosophy_partial(self):
        result = score_philosophy("We value safety over speed.", COHERENT_CHOICES)
        assert result["score"] >= 1

    def test_tradeoff_mention_adds_points(self):
        philosophy = "We accept the cost of evaluation overhead because confidence matters more."
        result = score_philosophy(philosophy, COHERENT_CHOICES)
        assert result["breakdown"]["mentions_tradeoff"] is True


class TestCompletenessScoring:
    def test_all_answered_and_justified(self):
        result = score_completeness(COHERENT_CHOICES, GOOD_PHILOSOPHY)
        assert result["score"] == 3
        assert result["all_dimensions_answered"] is True
        assert result["all_justified"] is True

    def test_empty_choices_zero(self):
        result = score_completeness(EMPTY_CHOICES, "")
        assert result["score"] == 0
        assert result["all_dimensions_answered"] is False

    def test_partial_answers(self):
        partial = COHERENT_CHOICES[:3]
        result = score_completeness(partial, "")
        assert result["answered_count"] == 3
        assert result["all_dimensions_answered"] is False


class TestFullEvaluation:
    def test_coherent_full_submission(self):
        result = evaluate_submission(COHERENT_CHOICES, GOOD_PHILOSOPHY)
        assert result["score"] > 20
        assert result["max_score"] == 30

    def test_empty_submission_low_score(self):
        result = evaluate_submission(EMPTY_CHOICES, "")
        assert result["score"] <= 5


class TestAchievements:
    def test_coherent_submission_earns_achievements(self):
        breakdown = evaluate_submission(COHERENT_CHOICES, GOOD_PHILOSOPHY)
        achs = compute_achievements(breakdown, True)
        assert "complete_architect" in achs
        assert "first_blood" in achs

    def test_empty_gets_no_achievements(self):
        breakdown = evaluate_submission(EMPTY_CHOICES, "")
        achs = compute_achievements(breakdown, False)
        assert achs == []

    def test_tradeoff_aware_achievement(self):
        breakdown = evaluate_submission(COHERENT_CHOICES, GOOD_PHILOSOPHY)
        achs = compute_achievements(breakdown, False)
        assert "tradeoff_aware" in achs
