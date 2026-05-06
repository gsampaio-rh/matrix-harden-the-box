"""Team registration and cross-chapter status."""

import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app import state
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
        await manager.broadcast("team_joined", {"team": team_id})
        logger.info("Team %s registered via self-signup", team_id)

    return {"team": team_id, "status": "registered"}


@router.get("/{team_id}/status")
async def get_team_status(team_id: str):
    team_id = team_id.strip().lower()
    team = state.get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")

    chapters = {}
    for ch_name in state.CHAPTERS:
        ch = state.get_chapter(team_id, ch_name)
        chapters[ch_name] = {
            "submitted": ch["submitted"] if ch else False,
            "score": ch["score"] if ch else 0,
            "achievements": ch["achievements"] if ch else [],
        }

    return {
        "team": team_id,
        "submitted": state.has_submitted(team_id, "contain"),
        "chapters": chapters,
        "achievements": state.get_achievements(team_id, "contain"),
    }
