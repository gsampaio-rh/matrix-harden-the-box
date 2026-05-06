from app.models import ScenarioAnswer
from app.scenarios import SCENARIO_INDEX, SCENARIOS
from app.services.contain_scoring import (
    ALL_PROBE_IDS,
    build_score_response,
    compute_achievements,
    evaluate_submission,
    max_score,
)

REQUIRED_OPTION_FIELDS = {"label", "points", "probes_blocked"}


class TestYamlIntegrity:
    """Catch broken scenarios.yaml edits before they reach runtime."""

    def test_ids_are_unique(self):
        ids = [s["id"] for s in SCENARIOS]
        assert len(ids) == len(set(ids)), f"Duplicate IDs: {ids}"

    def test_index_matches_list(self):
        assert len(SCENARIO_INDEX) == len(SCENARIOS)

    def test_best_key_is_valid_option(self):
        for s in SCENARIOS:
            assert s["best"] in s["options"], (
                f"Scenario {s['id']}: best={s['best']} not in options"
            )

    def test_options_have_required_fields(self):
        for s in SCENARIOS:
            for key, opt in s["options"].items():
                missing = REQUIRED_OPTION_FIELDS - opt.keys()
                assert not missing, (
                    f"Scenario {s['id']} option {key} missing: {missing}"
                )

    def test_probes_blocked_are_strings(self):
        for s in SCENARIOS:
            for key, opt in s["options"].items():
                for probe in opt["probes_blocked"]:
                    assert isinstance(probe, str), (
                        f"Scenario {s['id']} option {key}: "
                        f"probe {probe!r} is not a string"
                    )

    def test_points_are_non_negative(self):
        for s in SCENARIOS:
            for key, opt in s["options"].items():
                assert opt["points"] >= 0, (
                    f"Scenario {s['id']} option {key}: negative points"
                )

    def test_every_scenario_has_required_top_level_keys(self):
        required = {"id", "category", "title", "situation", "options", "best", "explanation"}
        for s in SCENARIOS:
            missing = required - s.keys()
            assert not missing, f"Scenario {s.get('id', '?')} missing: {missing}"

    def test_explanations_are_non_empty(self):
        for s in SCENARIOS:
            assert s.get("explanation", "").strip(), (
                f"Scenario {s['id']}: explanation must be a non-empty string"
            )


def _answer(scenario_id: str, option: str) -> ScenarioAnswer:
    return ScenarioAnswer(scenario_id=scenario_id, selected_option=option)


def _all_best() -> list[ScenarioAnswer]:
    return [_answer(s["id"], s["best"]) for s in SCENARIOS]


def _all_worst() -> list[ScenarioAnswer]:
    """Pick option 'a' for every scenario (always 0 points)."""
    return [_answer(s["id"], "a") for s in SCENARIOS]


def test_empty_submission_all_passed():
    probes, pts = evaluate_submission([])
    assert pts == 0
    assert all(p.status == "PASSED" for p in probes)


def test_all_best_answers_max_score():
    probes, pts = evaluate_submission(_all_best())
    assert pts == max_score()
    assert pts > 0


def test_all_worst_answers_zero():
    probes, pts = evaluate_submission(_all_worst())
    assert pts == 0
    assert all(p.status == "PASSED" for p in probes)


def test_all_best_blocks_all_probes():
    probes, _ = evaluate_submission(_all_best())
    for p in probes:
        assert p.status == "BLOCKED", f"{p.probe} should be BLOCKED with best answers"


def test_partial_submission():
    answers = [_answer("net-egress", "c")]
    probes, pts = evaluate_submission(answers)
    assert pts == 20
    blocked = {p.probe for p in probes if p.status == "BLOCKED"}
    assert "NET-01" in blocked
    assert "NET-02" in blocked


def test_unknown_scenario_ignored():
    answers = [_answer("nonexistent", "a")]
    probes, pts = evaluate_submission(answers)
    assert pts == 0


def test_unknown_option_ignored():
    answers = [_answer("net-egress", "z")]
    probes, pts = evaluate_submission(answers)
    assert pts == 0


class TestScoreResponse:
    def test_response_shape(self):
        probes, pts = evaluate_submission(_all_best())
        achs = compute_achievements(probes, pts, False)
        resp = build_score_response("team-01", probes, pts, achs)
        assert resp["team"] == "team-01"
        assert resp["score"] == pts
        assert resp["max_score"] == max_score()
        assert len(resp["probes"]) == len(ALL_PROBE_IDS)
        assert isinstance(resp["achievements"], list)

    def test_zero_score_empty_submission(self):
        probes, pts = evaluate_submission([])
        resp = build_score_response("team-x", probes, pts, [])
        assert resp["score"] == 0
        assert resp["blocked_count"] == 0


class TestAchievements:
    def test_network_guardian(self):
        answers = [
            _answer("net-egress", "c"),
            _answer("net-ingress", "c"),
        ]
        probes, pts = evaluate_submission(answers)
        achs = compute_achievements(probes, pts, False)
        assert "network_guardian" in achs

    def test_rbac_master(self):
        answers = [
            _answer("rbac-crb", "b"),
            _answer("rbac-secrets", "b"),
        ]
        probes, pts = evaluate_submission(answers)
        achs = compute_achievements(probes, pts, False)
        assert "rbac_master" in achs

    def test_lockdown(self):
        answers = [
            _answer("sec-root", "b"),
            _answer("sec-filesystem", "b"),
            _answer("sec-capabilities", "b"),
        ]
        probes, pts = evaluate_submission(answers)
        achs = compute_achievements(probes, pts, False)
        assert "lockdown" in achs

    def test_perfect_score(self):
        probes, pts = evaluate_submission(_all_best())
        achs = compute_achievements(probes, pts, False)
        assert "perfect_score" in achs

    def test_first_blood(self):
        probes, pts = evaluate_submission([])
        achs = compute_achievements(probes, pts, True)
        assert "first_blood" in achs

    def test_no_first_blood_when_not_first(self):
        probes, pts = evaluate_submission([])
        achs = compute_achievements(probes, pts, False)
        assert "first_blood" not in achs

    def test_no_achievements_worst_answers(self):
        probes, pts = evaluate_submission(_all_worst())
        achs = compute_achievements(probes, pts, False)
        assert achs == []
