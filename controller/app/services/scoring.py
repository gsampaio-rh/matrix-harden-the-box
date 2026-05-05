from app.config import settings
from app.models import DefenseConfig, ProbeResult

PROBE_RULES: list[tuple[str, str]] = [
    ("NET-01", "network_egress_blocked"),
    ("NET-02", "api_server_egress_blocked"),
    ("NET-03", "ingress_blocked"),
    ("RBAC-01", "cluster_role_removed"),
    ("RBAC-02", "secrets_access_removed"),
    ("RBAC-03", "delete_verb_removed"),
    ("SEC-01", "readonly_root_fs"),
    ("SEC-02", "non_root_user"),
    ("ESC-01", "kata_runtime"),
]

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


def _is_blocked(rule: str, config: DefenseConfig) -> bool:
    net = config.network_policy
    rbac = config.rbac
    sec = config.security_context

    match rule:
        case "network_egress_blocked":
            return net.deny_all_egress
        case "api_server_egress_blocked":
            return net.deny_all_egress
        case "ingress_blocked":
            return net.deny_all_ingress
        case "cluster_role_removed":
            return rbac.delete_cluster_role_binding
        case "secrets_access_removed":
            return (
                rbac.create_namespaced_role
                and "secrets" not in rbac.allowed_resources
            )
        case "delete_verb_removed":
            return (
                rbac.create_namespaced_role
                and "delete" not in rbac.allowed_verbs
            )
        case "readonly_root_fs":
            return sec.read_only_root_filesystem
        case "non_root_user":
            return sec.run_as_non_root
        case "kata_runtime":
            return False
        case _:
            return False


def evaluate_defenses(config: DefenseConfig) -> list[ProbeResult]:
    results = []
    for probe_id, rule in PROBE_RULES:
        status = "BLOCKED" if _is_blocked(rule, config) else "PASSED"
        results.append(ProbeResult(probe=probe_id, status=status))
    return results


def build_score_response(
    team_id: str,
    probes: list[ProbeResult],
    achievements: list[str],
) -> dict:
    total_points = 0
    blocked_count = 0
    probe_details = []

    for p in probes:
        max_pts = settings.probe_points.get(p.probe, 0)
        earned = max_pts if p.status == "BLOCKED" else 0
        if p.status == "BLOCKED":
            blocked_count += 1
        total_points += earned
        probe_details.append({
            "id": p.probe,
            "status": p.status,
            "points": earned,
            "max_points": max_pts,
        })

    return {
        "team": team_id,
        "score": total_points,
        "max_score": sum(settings.probe_points.values()),
        "blocked_count": blocked_count,
        "total_probes": len(settings.probe_points),
        "probes": probe_details,
        "achievements": achievements,
    }


def compute_achievements(
    probes: list[ProbeResult],
    is_first_submission: bool,
) -> list[str]:
    blocked_set = {p.probe for p in probes if p.status == "BLOCKED"}
    earned = []

    for ach_id, ach in ACHIEVEMENTS.items():
        if ach_id == "perfect_score":
            scorable = sum(
                settings.probe_points.get(p.probe, 0)
                for p in probes
                if p.status == "BLOCKED"
            )
            if scorable >= sum(settings.probe_points.values()) and scorable > 0:
                earned.append(ach_id)
        elif all(pid in blocked_set for pid in ach["probes"]):
            earned.append(ach_id)

    if is_first_submission:
        earned.append("first_blood")

    return earned
