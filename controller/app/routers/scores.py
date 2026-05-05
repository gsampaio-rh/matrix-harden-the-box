import logging

from fastapi import APIRouter

from app import state
from app.services.scoring import ALL_PROBE_IDS, build_score_response, max_score

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("")
async def leaderboard():
    all_teams = []
    for team_id in state.get_all_teams():
        probes = state.get_scores(team_id)
        pts = state.get_points(team_id)
        achs = state.get_achievements(team_id)
        if probes:
            all_teams.append(build_score_response(team_id, probes, pts, achs))
        else:
            all_teams.append({
                "team": team_id,
                "score": 0,
                "max_score": max_score(),
                "blocked_count": 0,
                "total_probes": len(ALL_PROBE_IDS),
                "probes": [],
                "achievements": [],
            })

    all_teams.sort(key=lambda t: t["score"], reverse=True)
    return {"teams": all_teams}


@router.get("/{team_id}")
async def team_score(team_id: str):
    probes = state.get_scores(team_id)
    pts = state.get_points(team_id)
    achs = state.get_achievements(team_id)
    if probes is None:
        return {
            "team": team_id, "probes": [], "score": 0,
            "achievements": [], "message": "No scores yet",
        }
    return build_score_response(team_id, probes, pts, achs)
