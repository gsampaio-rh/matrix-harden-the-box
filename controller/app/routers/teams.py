import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app import state
from app.models import DefenseConfig
from app.services.scoring import (
    build_score_response,
    compute_achievements,
    evaluate_defenses,
)
from app.ws import manager

logger = logging.getLogger(__name__)
router = APIRouter()


class RegisterRequest(BaseModel):
    team_id: str


@router.post("/register")
async def register_team(req: RegisterRequest):
    team_id = req.team_id.strip().lower()
    if not team_id:
        raise HTTPException(status_code=400, detail="team_id is required")

    is_new = state.get_team(team_id) is None
    state.register_team(team_id)

    if is_new:
        await manager.broadcast("team_joined", {"team_id": team_id})
        logger.info("Team %s registered via self-signup", team_id)

    return {"team_id": team_id, "status": "registered"}


@router.post("/{team_id}/defenses")
async def set_defenses(team_id: str, config: DefenseConfig):
    team = state.get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")

    probes = evaluate_defenses(config)
    is_first = state.record_first_submission(team_id)
    achs = compute_achievements(probes, is_first)

    state.set_defenses(team_id, config)
    state.set_scores(team_id, probes)
    state.set_achievements(team_id, achs)

    score_data = build_score_response(team_id, probes, achs)
    await manager.broadcast("score_updated", score_data)
    logger.info(
        "Defenses scored for %s: %d/%d", team_id, score_data["score"], score_data["max_score"],
    )

    return score_data


@router.get("/{team_id}/defenses")
async def get_defenses(team_id: str):
    team = state.get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")

    defenses = state.get_defenses(team_id)
    return {"team": team_id, "defenses": defenses}


@router.get("/{team_id}/status")
async def get_team_status(team_id: str):
    team = state.get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")

    return {
        "team": team_id,
        "defenses_applied": team.get("defenses") is not None,
        "achievements": state.get_achievements(team_id),
    }
