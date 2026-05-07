"""Tests for file-based state persistence."""

import json
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

import pytest

from app.models import ProbeResult, ScenarioAnswer
from app.persistence import (
    _deserialize_teams,
    _serialize_teams,
    load_snapshot,
    save_snapshot,
)


@pytest.fixture()
def data_dir(tmp_path: Path):
    """Patch persistence to use a temp directory."""
    with (
        patch("app.persistence.DATA_DIR", tmp_path),
        patch("app.persistence.STATE_FILE", tmp_path / "state.json"),
        patch("app.persistence.TMP_FILE", tmp_path / "state.json.tmp"),
        patch("app.persistence._writable", None),
    ):
        yield tmp_path


def _sample_teams() -> dict[str, dict]:
    return {
        "team-alpha": {
            "chapters": {
                "contain": {
                    "submitted": True,
                    "probes": [ProbeResult(probe="net-egress", status="blocked")],
                    "score": 18,
                    "achievements": ["quick_start"],
                    "submission": [
                        ScenarioAnswer(scenario_id="s1", selected_option="deny-all"),
                    ],
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
    }


class TestSerializeDeserialize:
    def test_round_trip_with_pydantic_objects(self):
        teams = _sample_teams()
        serialized = _serialize_teams(teams)
        assert isinstance(serialized["team-alpha"]["chapters"]["contain"]["submission"][0], dict)
        assert isinstance(serialized["team-alpha"]["chapters"]["contain"]["probes"][0], dict)

        restored = _deserialize_teams(serialized)
        contain = restored["team-alpha"]["chapters"]["contain"]
        assert isinstance(contain["submission"][0], ScenarioAnswer)
        assert contain["submission"][0].scenario_id == "s1"
        assert isinstance(contain["probes"][0], ProbeResult)
        assert contain["probes"][0].probe == "net-egress"

    def test_round_trip_preserves_scores_and_achievements(self):
        teams = _sample_teams()
        serialized = _serialize_teams(teams)
        restored = _deserialize_teams(serialized)
        contain = restored["team-alpha"]["chapters"]["contain"]
        assert contain["score"] == 18
        assert contain["achievements"] == ["quick_start"]
        assert contain["submitted"] is True

    def test_configure_chapter_no_pydantic(self):
        teams = {
            "team-beta": {
                "chapters": {
                    "contain": {"submitted": False, "probes": None, "score": 0, "achievements": [], "submission": None},
                    "configure": {
                        "submitted": True,
                        "score": 15,
                        "achievements": ["constitutional_author"],
                        "submission": {"sections": {"role": "SRE agent"}},
                        "breakdown": {"constitution": 8},
                        "vectors": [{"name": "secret_exfil", "blocked": True}],
                    },
                }
            }
        }
        serialized = _serialize_teams(teams)
        restored = _deserialize_teams(serialized)
        configure = restored["team-beta"]["chapters"]["configure"]
        assert configure["score"] == 15
        assert configure["submission"]["sections"]["role"] == "SRE agent"

    def test_null_submission_and_probes(self):
        teams = {
            "team-gamma": {
                "chapters": {
                    "contain": {"submitted": False, "probes": None, "score": 0, "achievements": [], "submission": None},
                    "configure": {"submitted": False, "score": 0, "achievements": [], "submission": None, "breakdown": None, "vectors": None},
                }
            }
        }
        serialized = _serialize_teams(teams)
        restored = _deserialize_teams(serialized)
        assert restored["team-gamma"]["chapters"]["contain"]["submission"] is None
        assert restored["team-gamma"]["chapters"]["contain"]["probes"] is None


class TestSaveLoad:
    def test_save_and_load_round_trip(self, data_dir: Path):
        teams = _sample_teams()
        timer = datetime(2026, 5, 6, 18, 0, 0, tzinfo=timezone.utc)
        first_sub = {"contain": "team-alpha", "configure": None}

        save_snapshot(teams, timer, first_sub)

        state_file = data_dir / "state.json"
        assert state_file.exists()
        raw = json.loads(state_file.read_text())
        assert "teams" in raw
        assert raw["timer_end"] == "2026-05-06T18:00:00+00:00"

        result = load_snapshot()
        assert result is not None
        loaded_teams, loaded_timer, loaded_first = result
        assert len(loaded_teams) == 1
        assert loaded_timer == timer
        assert loaded_first["contain"] == "team-alpha"
        assert loaded_first["configure"] is None

        contain = loaded_teams["team-alpha"]["chapters"]["contain"]
        assert isinstance(contain["submission"][0], ScenarioAnswer)
        assert contain["score"] == 18

    def test_load_returns_none_when_no_file(self, data_dir: Path):
        result = load_snapshot()
        assert result is None

    def test_load_returns_none_on_corrupted_json(self, data_dir: Path):
        state_file = data_dir / "state.json"
        state_file.write_text("{invalid json")
        result = load_snapshot()
        assert result is None

    def test_save_creates_directory(self, tmp_path: Path):
        nested = tmp_path / "sub" / "dir"
        with (
            patch("app.persistence.DATA_DIR", nested),
            patch("app.persistence.STATE_FILE", nested / "state.json"),
            patch("app.persistence.TMP_FILE", nested / "state.json.tmp"),
            patch("app.persistence._writable", None),
        ):
            save_snapshot({}, None, {"contain": None, "configure": None})
            assert (nested / "state.json").exists()

    def test_atomic_write_no_tmp_left(self, data_dir: Path):
        save_snapshot(_sample_teams(), None, {"contain": None, "configure": None})
        assert not (data_dir / "state.json.tmp").exists()
        assert (data_dir / "state.json").exists()

    def test_save_with_none_timer(self, data_dir: Path):
        save_snapshot({}, None, {"contain": None, "configure": None})
        result = load_snapshot()
        assert result is not None
        _, timer, _ = result
        assert timer is None

    def test_graceful_on_unwritable_dir(self, tmp_path: Path):
        unwritable = tmp_path / "readonly"
        unwritable.mkdir()
        unwritable.chmod(0o444)
        with (
            patch("app.persistence.DATA_DIR", unwritable / "nested"),
            patch("app.persistence.STATE_FILE", unwritable / "nested" / "state.json"),
            patch("app.persistence.TMP_FILE", unwritable / "nested" / "state.json.tmp"),
            patch("app.persistence._writable", None),
        ):
            save_snapshot(_sample_teams(), None, {})
        unwritable.chmod(0o755)
