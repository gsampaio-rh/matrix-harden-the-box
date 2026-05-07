"""In-memory state for the exercise, persisted to disk when available.

WARNING: single-worker only. Running with multiple uvicorn workers will
fragment state across processes. Use a shared store (Redis, SQLite) if
multi-worker is needed.
"""

from datetime import datetime
from typing import Callable

from app.models import (
    ConfigureChapterState,
    ContainChapterState,
    ProbeResult,
    ScenarioAnswer,
    TeamState,
)

CHAPTERS = ("contain", "configure")

teams: dict[str, TeamState] = {}
timer_end: datetime | None = None
first_submission: dict[str, str | None] = {ch: None for ch in CHAPTERS}

_persist_fn: Callable[[], None] | None = None


def set_persist_fn(fn: Callable[[], None]) -> None:
    global _persist_fn
    _persist_fn = fn


def persist() -> None:
    if _persist_fn:
        _persist_fn()


def register_team(team_id: str) -> None:
    if team_id not in teams:
        teams[team_id] = TeamState()
        persist()


def get_team(team_id: str) -> TeamState | None:
    return teams.get(team_id)


def get_chapter(team_id: str, chapter: str) -> ContainChapterState | ConfigureChapterState | None:
    team = teams.get(team_id)
    if not team:
        return None
    return getattr(team, chapter, None)


def has_submitted(team_id: str, chapter: str) -> bool:
    ch = get_chapter(team_id, chapter)
    return ch is not None and ch.submitted


def mark_submitted(team_id: str, chapter: str) -> None:
    ch = get_chapter(team_id, chapter)
    if ch is not None:
        ch.submitted = True


# ── Contain-specific helpers ─────────────────────────────────────────

def set_contain_submission(team_id: str, answers: list[ScenarioAnswer]) -> None:
    team = teams.get(team_id)
    if team:
        team.contain.submission = answers


def get_contain_submission(team_id: str) -> list[ScenarioAnswer] | None:
    team = teams.get(team_id)
    return team.contain.submission if team else None


def set_contain_probes(team_id: str, probes: list[ProbeResult]) -> None:
    team = teams.get(team_id)
    if team:
        team.contain.probes = probes


def get_contain_probes(team_id: str) -> list[ProbeResult] | None:
    team = teams.get(team_id)
    return team.contain.probes if team else None


# ── Configure-specific helpers ───────────────────────────────────────

def set_configure_submission(team_id: str, submission: dict) -> None:
    team = teams.get(team_id)
    if team:
        team.configure.submission = submission


def get_configure_submission(team_id: str) -> dict | None:
    team = teams.get(team_id)
    return team.configure.submission if team else None


def set_configure_breakdown(team_id: str, breakdown: dict) -> None:
    team = teams.get(team_id)
    if team:
        team.configure.breakdown = breakdown


def get_configure_breakdown(team_id: str) -> dict | None:
    team = teams.get(team_id)
    return team.configure.breakdown if team else None


def set_configure_vectors(team_id: str, vectors: list[dict]) -> None:
    team = teams.get(team_id)
    if team:
        team.configure.vectors = vectors


def get_configure_vectors(team_id: str) -> list[dict] | None:
    team = teams.get(team_id)
    return team.configure.vectors if team else None


# ── Shared chapter helpers ───────────────────────────────────────────

def set_score(team_id: str, chapter: str, pts: int) -> None:
    ch = get_chapter(team_id, chapter)
    if ch is not None:
        ch.score = pts


def get_score(team_id: str, chapter: str) -> int:
    ch = get_chapter(team_id, chapter)
    return ch.score if ch else 0


def set_achievements(team_id: str, chapter: str, achs: list[str]) -> None:
    ch = get_chapter(team_id, chapter)
    if ch is not None:
        ch.achievements = achs


def get_achievements(team_id: str, chapter: str) -> list[str]:
    ch = get_chapter(team_id, chapter)
    return ch.achievements if ch else []


def get_all_teams() -> dict[str, TeamState]:
    return teams


def build_chapter_summary(team_id: str) -> dict[str, dict]:
    result = {}
    for ch_name in CHAPTERS:
        ch = get_chapter(team_id, ch_name)
        result[ch_name] = {
            "submitted": ch.submitted if ch else False,
            "score": ch.score if ch else 0,
            "achievements": ch.achievements if ch else [],
        }
    return result


def record_first_submission(team_id: str, chapter: str) -> bool:
    if first_submission.get(chapter) is None:
        first_submission[chapter] = team_id
        persist()
        return True
    return False


def set_timer(end: datetime | None) -> None:
    global timer_end
    timer_end = end
    persist()


def get_timer() -> datetime | None:
    return timer_end


def restore_from_snapshot(
    saved_teams: dict[str, TeamState],
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
    persist()
