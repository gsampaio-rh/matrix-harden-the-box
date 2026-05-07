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

from app.models import TeamState

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


def save_snapshot(teams: dict[str, TeamState], timer_end: datetime | None, first_submission: dict) -> None:
    """Atomically write current state to disk."""
    if not _check_writable():
        return
    try:
        snapshot = {
            "teams": {tid: ts.model_dump() for tid, ts in teams.items()},
            "timer_end": timer_end.isoformat() if timer_end else None,
            "first_submission": first_submission,
        }
        TMP_FILE.write_text(json.dumps(snapshot, indent=2))
        TMP_FILE.rename(STATE_FILE)
    except OSError:
        logger.exception("Failed to save state snapshot")


def load_snapshot() -> tuple[dict[str, TeamState], datetime | None, dict[str, str | None]] | None:
    """Load state from disk. Returns None if no snapshot exists or on error."""
    if not STATE_FILE.exists():
        logger.info("No state snapshot found at %s — starting fresh", STATE_FILE)
        return None
    try:
        raw = json.loads(STATE_FILE.read_text())
        teams = {
            tid: TeamState.model_validate(data)
            for tid, data in raw.get("teams", {}).items()
        }
        timer_end = datetime.fromisoformat(raw["timer_end"]) if raw.get("timer_end") else None
        first_sub = raw.get("first_submission", {})
        logger.info("Restored state snapshot: %d teams", len(teams))
        return teams, timer_end, first_sub
    except (json.JSONDecodeError, KeyError, TypeError, ValueError):
        logger.exception("Corrupted state snapshot at %s — starting fresh", STATE_FILE)
        return None
