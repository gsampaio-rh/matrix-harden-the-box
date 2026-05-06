"""Unified cross-chapter scoreboard."""

import logging

from fastapi import APIRouter, HTTPException

from app import state
from app.services.configure_scoring import MAX_SCORE as CONFIGURE_MAX_SCORE
from app.services.contain_scoring import (
    ALL_PROBE_IDS,
    build_score_response,
    max_score as contain_max_score,
)

logger = logging.getLogger(__name__)
router = APIRouter()


def _build_team_entry(team_id: str) -> dict:
    contain_ch = state.get_chapter(team_id, "contain") or {}
    configure_ch = state.get_chapter(team_id, "configure") or {}

    contain_probes = contain_ch.get("probes")
    contain_pts = contain_ch.get("score", 0)
    contain_achs = contain_ch.get("achievements", [])

    if contain_probes:
        contain_data = build_score_response(team_id, contain_probes, contain_pts, contain_achs)
    else:
        contain_data = {
            "team": team_id,
            "score": 0,
            "max_score": contain_max_score(),
            "blocked_count": 0,
            "total_probes": len(ALL_PROBE_IDS),
            "probes": [],
            "achievements": [],
        }

    configure_score = configure_ch.get("score", 0)
    configure_achs = configure_ch.get("achievements", [])

    total_score = contain_pts + configure_score
    max_total = contain_max_score() + CONFIGURE_MAX_SCORE

    return {
        "team": team_id,
        "score": contain_data["score"],
        "max_score": contain_data["max_score"],
        "blocked_count": contain_data["blocked_count"],
        "total_probes": contain_data["total_probes"],
        "probes": contain_data["probes"],
        "achievements": list(dict.fromkeys(contain_achs + configure_achs)),
        "chapters": {
            "contain": {
                "score": contain_pts,
                "max_score": contain_max_score(),
                "achievements": contain_achs,
                "submitted": contain_ch.get("submitted", False),
            },
            "configure": {
                "score": configure_score,
                "max_score": CONFIGURE_MAX_SCORE,
                "achievements": configure_achs,
                "submitted": configure_ch.get("submitted", False),
            },
        },
        "total_score": total_score,
        "max_total": max_total,
    }


@router.get("")
async def leaderboard():
    all_teams = [_build_team_entry(tid) for tid in state.get_all_teams()]
    all_teams.sort(key=lambda t: t["total_score"], reverse=True)
    return {"teams": all_teams}


@router.get("/{team_id}")
async def team_score(team_id: str):
    team_id = team_id.strip().lower()
    if state.get_team(team_id) is None:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")
    return _build_team_entry(team_id)
