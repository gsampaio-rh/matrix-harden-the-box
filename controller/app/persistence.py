"""File-based state persistence for surviving pod restarts.

Writes a JSON snapshot of all team data to disk after every mutation.
On startup, loads the snapshot if it exists. Degrades gracefully if
the data directory is not writable (logs a warning, continues in-memory).
"""

import json
import logging
import os
from datetime import datetime
from pathlib import Path

from app.models import ProbeResult, ScenarioAnswer

logger = logging.getLogger(__name__)

DATA_DIR = Path(os.environ.get("HTB_DATA_DIR", "/app/data"))
STATE_FILE = DATA_DIR / "state.json"
TMP_FILE = DATA_DIR / "state.json.tmp"

_writable: bool | None = None


def _check_writable() -> bool:
    global _writable
    if _writable is not None:
        return _writable
    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        test_file = DATA_DIR / ".write_test"
        test_file.write_text("ok")
        test_file.unlink()
        _writable = True
    except OSError:
        logger.warning("Data directory %s is not writable — state will not persist across restarts", DATA_DIR)
        _writable = False
    return _writable


def _serialize_teams(teams: dict[str, dict]) -> dict[str, dict]:
    """Convert in-memory team data to JSON-serializable dicts."""
    result: dict[str, dict] = {}
    for team_id, team_data in teams.items():
        chapters = {}
        for ch_name, ch_data in team_data.get("chapters", {}).items():
            serialized = dict(ch_data)
            if ch_name == "contain":
                if serialized.get("submission") is not None:
                    serialized["submission"] = [
                        a.model_dump() if isinstance(a, ScenarioAnswer) else a
                        for a in serialized["submission"]
                    ]
                if serialized.get("probes") is not None:
                    serialized["probes"] = [
                        p.model_dump() if isinstance(p, ProbeResult) else p
                        for p in serialized["probes"]
                    ]
            chapters[ch_name] = serialized
        result[team_id] = {"chapters": chapters}
    return result


def _deserialize_teams(raw: dict[str, dict]) -> dict[str, dict]:
    """Restore Pydantic objects from deserialized JSON dicts."""
    result: dict[str, dict] = {}
    for team_id, team_data in raw.items():
        chapters = {}
        for ch_name, ch_data in team_data.get("chapters", {}).items():
            restored = dict(ch_data)
            if ch_name == "contain":
                if restored.get("submission") is not None:
                    restored["submission"] = [
                        ScenarioAnswer(**a) for a in restored["submission"]
                    ]
                if restored.get("probes") is not None:
                    restored["probes"] = [
                        ProbeResult(**p) for p in restored["probes"]
                    ]
            chapters[ch_name] = restored
        result[team_id] = {"chapters": chapters}
    return result


def save_snapshot(teams: dict, timer_end: datetime | None, first_submission: dict) -> None:
    """Atomically write current state to disk."""
    if not _check_writable():
        return
    try:
        snapshot = {
            "teams": _serialize_teams(teams),
            "timer_end": timer_end.isoformat() if timer_end else None,
            "first_submission": first_submission,
        }
        TMP_FILE.write_text(json.dumps(snapshot, indent=2))
        TMP_FILE.rename(STATE_FILE)
    except OSError:
        logger.exception("Failed to save state snapshot")


def load_snapshot() -> tuple[dict[str, dict], datetime | None, dict[str, str | None]] | None:
    """Load state from disk. Returns None if no snapshot exists or on error."""
    if not STATE_FILE.exists():
        logger.info("No state snapshot found at %s — starting fresh", STATE_FILE)
        return None
    try:
        raw = json.loads(STATE_FILE.read_text())
        teams = _deserialize_teams(raw.get("teams", {}))
        timer_end = datetime.fromisoformat(raw["timer_end"]) if raw.get("timer_end") else None
        first_sub = raw.get("first_submission", {})
        logger.info("Restored state snapshot: %d teams", len(teams))
        return teams, timer_end, first_sub
    except (json.JSONDecodeError, KeyError, TypeError, ValueError):
        logger.exception("Corrupted state snapshot at %s — starting fresh", STATE_FILE)
        return None
