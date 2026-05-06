from app.models import ProbeResult, ScenarioAnswer
from app.scenarios import SCENARIO_INDEX, SCENARIOS

ALL_PROBE_IDS = sorted({
    probe
    for scenario in SCENARIOS
    for opt in scenario["options"].values()
    for probe in opt["probes_blocked"]
})

ACHIEVEMENTS = {
    "network_guardian": {
        "label": "Network Guardian",
        "description": "All network probes blocked",
        "probes": ["NET-01", "NET-02", "NET-03"],
    },
    "rbac_master": {
        "label": "RBAC Master",
        "description": "All RBAC probes blocked",
        "probes": ["RBAC-01", "RBAC-02", "RBAC-03"],
    },
    "lockdown": {
        "label": "Lockdown",
        "description": "All security context probes blocked",
        "probes": ["SEC-01", "SEC-02"],
    },
    "perfect_score": {
        "label": "Perfect Score",
        "description": "Maximum points achieved",
        "probes": [],
    },
}


def _max_points_per_probe() -> dict[str, int]:
    """For each probe, find the maximum points achievable across all scenarios."""
    probe_max: dict[str, int] = {pid: 0 for pid in ALL_PROBE_IDS}
    for scenario in SCENARIOS:
        for opt in scenario["options"].values():
            for probe in opt["probes_blocked"]:
                pts_per_probe = opt["points"] // max(1, len(opt["probes_blocked"]))
                probe_max[probe] = max(probe_max[probe], pts_per_probe)
    return probe_max


def evaluate_submission(answers: list[ScenarioAnswer]) -> tuple[list[ProbeResult], int]:
    """Evaluate scenario answers. Returns (probe_results, total_points)."""
    blocked_probes: set[str] = set()
    total_points = 0

    for answer in answers:
        scenario = SCENARIO_INDEX.get(answer.scenario_id)
        if not scenario:
            continue
        option = scenario["options"].get(answer.selected_option)
        if not option:
            continue
        total_points += option["points"]
        blocked_probes.update(option["probes_blocked"])

    results = []
    for probe_id in ALL_PROBE_IDS:
        status = "BLOCKED" if probe_id in blocked_probes else "PASSED"
        results.append(ProbeResult(probe=probe_id, status=status))

    return results, total_points


def max_score() -> int:
    """The maximum achievable score (sum of best option points across all scenarios)."""
    total = 0
    for scenario in SCENARIOS:
        best_key = scenario["best"]
        total += scenario["options"][best_key]["points"]
    return total


def build_score_response(
    team_id: str,
    probes: list[ProbeResult],
    total_points: int,
    achievements: list[str],
) -> dict:
    max_pts = max_score()
    probe_max = _max_points_per_probe()

    probe_details = []
    for p in probes:
        mp = probe_max.get(p.probe, 0)
        earned = mp if p.status == "BLOCKED" else 0
        probe_details.append({
            "id": p.probe,
            "status": p.status,
            "points": earned,
            "max_points": mp,
        })

    return {
        "team": team_id,
        "score": total_points,
        "max_score": max_pts,
        "blocked_count": sum(1 for p in probes if p.status == "BLOCKED"),
        "total_probes": len(ALL_PROBE_IDS),
        "probes": probe_details,
        "achievements": achievements,
    }


def compute_achievements(
    probes: list[ProbeResult],
    total_points: int,
    is_first_submission: bool,
) -> list[str]:
    blocked_set = {p.probe for p in probes if p.status == "BLOCKED"}
    earned = []

    for ach_id, ach in ACHIEVEMENTS.items():
        if ach_id == "perfect_score":
            if total_points >= max_score() and total_points > 0:
                earned.append(ach_id)
        elif all(pid in blocked_set for pid in ach["probes"]):
            earned.append(ach_id)

    if is_first_submission:
        earned.append("first_blood")

    return earned
