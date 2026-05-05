import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app import state
from app.models import SubmissionPayload
from app.scenarios import SCENARIOS
from app.services.scoring import (
    build_score_response,
    compute_achievements,
    evaluate_submission,
    max_score,
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


@router.post("/{team_id}/submit")
async def submit_answers(team_id: str, payload: SubmissionPayload):
    team = state.get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")

    if state.has_submitted(team_id):
        raise HTTPException(status_code=409, detail="Already submitted — one shot only")

    state.set_submission(team_id, payload.answers)
    probes, total_points = evaluate_submission(payload.answers)
    is_first = state.record_first_submission(team_id)
    achs = compute_achievements(probes, total_points, is_first)

    state.mark_submitted(team_id)
    state.set_scores(team_id, probes)
    state.set_points(team_id, total_points)
    state.set_achievements(team_id, achs)

    score_data = build_score_response(team_id, probes, total_points, achs)
    await manager.broadcast("score_updated", score_data)
    logger.info(
        "Submission scored for %s: %d/%d",
        team_id, score_data["score"], score_data["max_score"],
    )

    return score_data


@router.get("/{team_id}/status")
async def get_team_status(team_id: str):
    team = state.get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")

    return {
        "team": team_id,
        "submitted": state.has_submitted(team_id),
        "achievements": state.get_achievements(team_id),
    }


@router.get("/{team_id}/results")
async def get_team_results(team_id: str):
    team = state.get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")

    if not state.has_submitted(team_id):
        raise HTTPException(status_code=404, detail="Team has not submitted yet")

    answers = state.get_submission(team_id) or []
    answer_map = {a.scenario_id: a.selected_option for a in answers}

    scenario_details = []
    for scenario in SCENARIOS:
        sid = scenario["id"]
        selected_key = answer_map.get(sid)
        selected_opt = scenario["options"].get(selected_key) if selected_key else None
        best_key = scenario["best"]
        best_opt = scenario["options"][best_key]

        scenario_details.append({
            "id": sid,
            "category": scenario["category"],
            "title": scenario["title"],
            "selected_option": selected_key,
            "selected_label": selected_opt["label"] if selected_opt else None,
            "best_option": best_key,
            "best_label": best_opt["label"],
            "points_earned": selected_opt["points"] if selected_opt else 0,
            "max_points": best_opt["points"],
            "is_best": selected_key == best_key,
            "explanation": scenario["explanation"],
        })

    return {
        "team": team_id,
        "score": state.get_points(team_id),
        "max_score": max_score(),
        "achievements": state.get_achievements(team_id),
        "scenarios": scenario_details,
    }
