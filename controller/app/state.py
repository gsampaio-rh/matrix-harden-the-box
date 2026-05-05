"""In-memory state for the exercise. Intentionally ephemeral — workshop lasts hours, not days."""

from datetime import datetime

from app.models import DefenseConfig, ProbeResult

teams: dict[str, dict] = {}
"""team_id -> {"defenses": DefenseConfig | None}"""

scores: dict[str, list[ProbeResult]] = {}
"""team_id -> list of probe results from last evaluation"""

achievements: dict[str, list[str]] = {}
"""team_id -> list of achievement IDs"""

timer_end: datetime | None = None
"""UTC timestamp when the hardening phase ends, None if no timer is active"""

first_submission_team: str | None = None
"""The first team to submit defenses — earns 'First Blood'"""


def register_team(team_id: str) -> None:
    teams[team_id] = {"defenses": None}


def get_team(team_id: str) -> dict | None:
    return teams.get(team_id)


def set_defenses(team_id: str, defenses: DefenseConfig) -> None:
    if team_id in teams:
        teams[team_id]["defenses"] = defenses


def get_defenses(team_id: str) -> DefenseConfig | None:
    team = teams.get(team_id)
    if team:
        return team.get("defenses")
    return None


def set_scores(team_id: str, probes: list[ProbeResult]) -> None:
    scores[team_id] = probes


def get_scores(team_id: str) -> list[ProbeResult] | None:
    return scores.get(team_id)


def set_achievements(team_id: str, achs: list[str]) -> None:
    achievements[team_id] = achs


def get_achievements(team_id: str) -> list[str]:
    return achievements.get(team_id, [])


def get_all_teams() -> dict[str, dict]:
    return teams


def record_first_submission(team_id: str) -> bool:
    """Record the first team to submit. Returns True if this team is first."""
    global first_submission_team
    if first_submission_team is None:
        first_submission_team = team_id
        return True
    return False


def set_timer(end: datetime | None) -> None:
    global timer_end
    timer_end = end


def get_timer() -> datetime | None:
    return timer_end


def clear_all() -> None:
    global first_submission_team, timer_end
    teams.clear()
    scores.clear()
    achievements.clear()
    first_submission_team = None
    timer_end = None


def clear_scores() -> None:
    scores.clear()
    achievements.clear()
