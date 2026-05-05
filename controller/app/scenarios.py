"""
Scenario definitions for the Harden the Box exercise.

Loaded from scenarios.yaml at import time. To customize the exercise,
edit the YAML file — no code changes needed.
"""

from pathlib import Path

import yaml

_YAML_PATH = Path(__file__).with_name("scenarios.yaml")

SCENARIOS: list[dict] = yaml.safe_load(_YAML_PATH.read_text())

SCENARIO_INDEX: dict[str, dict] = {s["id"]: s for s in SCENARIOS}


def get_public_scenarios() -> list[dict]:
    """Return scenarios safe for the frontend — strip points, probes_blocked, best."""
    public = []
    for s in SCENARIOS:
        options = {}
        for key, opt in s["options"].items():
            entry: dict[str, str] = {"label": opt["label"]}
            if "hint" in opt:
                entry["hint"] = opt["hint"]
            options[key] = entry
        public.append({
            "id": s["id"],
            "category": s["category"],
            "title": s["title"],
            "situation": s["situation"],
            "options": options,
        })
    return public
