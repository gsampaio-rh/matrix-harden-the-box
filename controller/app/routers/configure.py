"""Chapter 2 (Configure) — Build Your Playbook exercise endpoints."""

import logging
from datetime import UTC, datetime

from fastapi import APIRouter, HTTPException

from app import state
from app.configure_content import get_content
from app.models import ConfigureSubmission
from app.services.configure_scoring import compute_achievements, evaluate_submission
from app.ws import manager

logger = logging.getLogger(__name__)
router = APIRouter()

CHAPTER = "configure"


@router.get("/content")
async def get_configure_content():
    return get_content()


@router.post("/submit")
async def submit_configure(payload: ConfigureSubmission):
    payload.team_id = payload.team_id.strip().lower()
    team = state.get_team(payload.team_id)
    if not team:
        raise HTTPException(status_code=404, detail=f"Team {payload.team_id} not found")

    if state.has_submitted(payload.team_id, CHAPTER):
        raise HTTPException(status_code=409, detail="Already submitted — one shot only")

    timer = state.get_timer()
    if timer and datetime.now(UTC) >= timer:
        raise HTTPException(status_code=403, detail="Time's up — submissions are locked")

    limits_dict = payload.limits.model_dump()
    breakdown = evaluate_submission(payload.sections, payload.skills, limits_dict)
    is_first = state.record_first_submission(payload.team_id, CHAPTER)
    achs = compute_achievements(breakdown, is_first)

    state.mark_submitted(payload.team_id, CHAPTER)
    state.set_score(payload.team_id, CHAPTER, breakdown["score"])
    state.set_achievements(payload.team_id, CHAPTER, achs)
    state.set_configure_submission(payload.team_id, {
        "sections": payload.sections,
        "skills": payload.skills,
        "limits": limits_dict,
    })
    state.set_configure_breakdown(payload.team_id, breakdown)
    state.set_configure_vectors(payload.team_id, breakdown["replay"]["vectors"])
    state.persist()

    await manager.broadcast("score_updated", {
        "team": payload.team_id,
        "chapter": CHAPTER,
        "score": breakdown["score"],
        "max_score": breakdown["max_score"],
    })
    logger.info(
        "Configure submission scored for %s: %d/%d",
        payload.team_id, breakdown["score"], breakdown["max_score"],
    )

    return {
        "team": payload.team_id,
        "score": breakdown["score"],
        "max_score": breakdown["max_score"],
        "achievements": achs,
        **breakdown,
    }


@router.get("/results/{team_id}")
async def get_configure_results(team_id: str):
    team_id = team_id.strip().lower()
    team = state.get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")

    if not state.has_submitted(team_id, CHAPTER):
        raise HTTPException(status_code=404, detail="Team has not submitted yet")

    breakdown = state.get_configure_breakdown(team_id)
    vectors = state.get_configure_vectors(team_id)
    achs = state.get_achievements(team_id, CHAPTER)

    return {
        "team": team_id,
        "score": state.get_score(team_id, CHAPTER),
        "max_score": breakdown["max_score"] if breakdown else 25,
        "achievements": achs,
        "breakdown": breakdown,
        "vectors": vectors,
    }
