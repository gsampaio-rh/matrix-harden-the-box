"""In-memory state for the exercise, persisted to disk when available."""

from datetime import datetime

from app.models import ProbeResult, ScenarioAnswer

CHAPTERS = ("contain", "configure")

teams: dict[str, dict] = {}
"""
team_id -> {
    "chapters": {
        "contain":   {"submitted": False, "probes": None, "score": 0, "achievements": [], "submission": None},
        "configure": {"submitted": False, "score": 0, "achievements": [], "submission": None, "breakdown": None, "vectors": None},
    }
}
"""

timer_end: datetime | None = None

first_submission: dict[str, str | None] = {ch: None for ch in CHAPTERS}


def _new_team() -> dict:
    return {
        "chapters": {
            "contain": {
                "submitted": False,
                "probes": None,
                "score": 0,
                "achievements": [],
                "submission": None,
            },
            "configure": {
                "submitted": False,
                "score": 0,
                "achievements": [],
                "submission": None,
                "breakdown": None,
                "vectors": None,
            },
        }
    }


def _persist() -> None:
    from app.persistence import save_snapshot
    save_snapshot(teams, timer_end, first_submission)


def register_team(team_id: str) -> None:
    if team_id not in teams:
        teams[team_id] = _new_team()
        _persist()


def get_team(team_id: str) -> dict | None:
    return teams.get(team_id)


def get_chapter(team_id: str, chapter: str) -> dict | None:
    team = teams.get(team_id)
    if not team:
        return None
    return team["chapters"].get(chapter)


def has_submitted(team_id: str, chapter: str) -> bool:
    ch = get_chapter(team_id, chapter)
    return ch is not None and ch.get("submitted", False)


def mark_submitted(team_id: str, chapter: str) -> None:
    ch = get_chapter(team_id, chapter)
    if ch is not None:
        ch["submitted"] = True
        _persist()


# ── Contain-specific helpers ─────────────────────────────────────────

def set_contain_submission(team_id: str, answers: list[ScenarioAnswer]) -> None:
    ch = get_chapter(team_id, "contain")
    if ch is not None:
        ch["submission"] = answers
        _persist()


def get_contain_submission(team_id: str) -> list[ScenarioAnswer] | None:
    ch = get_chapter(team_id, "contain")
    return ch["submission"] if ch else None


def set_contain_probes(team_id: str, probes: list[ProbeResult]) -> None:
    ch = get_chapter(team_id, "contain")
    if ch is not None:
        ch["probes"] = probes
        _persist()


def get_contain_probes(team_id: str) -> list[ProbeResult] | None:
    ch = get_chapter(team_id, "contain")
    return ch["probes"] if ch else None


# ── Configure-specific helpers ───────────────────────────────────────

def set_configure_submission(team_id: str, submission: dict) -> None:
    ch = get_chapter(team_id, "configure")
    if ch is not None:
        ch["submission"] = submission
        _persist()


def get_configure_submission(team_id: str) -> dict | None:
    ch = get_chapter(team_id, "configure")
    return ch["submission"] if ch else None


def set_configure_breakdown(team_id: str, breakdown: dict) -> None:
    ch = get_chapter(team_id, "configure")
    if ch is not None:
        ch["breakdown"] = breakdown
        _persist()


def get_configure_breakdown(team_id: str) -> dict | None:
    ch = get_chapter(team_id, "configure")
    return ch["breakdown"] if ch else None


def set_configure_vectors(team_id: str, vectors: list[dict]) -> None:
    ch = get_chapter(team_id, "configure")
    if ch is not None:
        ch["vectors"] = vectors
        _persist()


def get_configure_vectors(team_id: str) -> list[dict] | None:
    ch = get_chapter(team_id, "configure")
    return ch["vectors"] if ch else None


# ── Shared chapter helpers ───────────────────────────────────────────

def set_score(team_id: str, chapter: str, pts: int) -> None:
    ch = get_chapter(team_id, chapter)
    if ch is not None:
        ch["score"] = pts
        _persist()


def get_score(team_id: str, chapter: str) -> int:
    ch = get_chapter(team_id, chapter)
    return ch["score"] if ch else 0


def set_achievements(team_id: str, chapter: str, achs: list[str]) -> None:
    ch = get_chapter(team_id, chapter)
    if ch is not None:
        ch["achievements"] = achs
        _persist()


def get_achievements(team_id: str, chapter: str) -> list[str]:
    ch = get_chapter(team_id, chapter)
    return ch["achievements"] if ch else []


def get_all_teams() -> dict[str, dict]:
    return teams


def record_first_submission(team_id: str, chapter: str) -> bool:
    if first_submission.get(chapter) is None:
        first_submission[chapter] = team_id
        _persist()
        return True
    return False


def set_timer(end: datetime | None) -> None:
    global timer_end
    timer_end = end
    _persist()


def get_timer() -> datetime | None:
    return timer_end


def restore_from_snapshot(
    saved_teams: dict[str, dict],
    saved_timer: datetime | None,
    saved_first: dict[str, str | None],
) -> None:
    global timer_end
    teams.clear()
    teams.update(saved_teams)
    timer_end = saved_timer
    for ch in CHAPTERS:
        first_submission[ch] = saved_first.get(ch)


def clear_all() -> None:
    global timer_end
    teams.clear()
    for ch in CHAPTERS:
        first_submission[ch] = None
    timer_end = None
    _persist()
