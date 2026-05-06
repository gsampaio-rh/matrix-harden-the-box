"""Chapter 1 (Contain) — Harden the Box exercise endpoints."""

import logging

from fastapi import APIRouter, HTTPException

from app import state
from app.models import SubmissionPayload
from app.scenarios import SCENARIOS
from app.services.contain_scoring import (
    build_score_response,
    compute_achievements,
    evaluate_submission,
    max_score,
)
from app.ws import manager

logger = logging.getLogger(__name__)
router = APIRouter()

CHAPTER = "contain"


@router.post("/{team_id}/submit")
async def submit_answers(team_id: str, payload: SubmissionPayload):
    team_id = team_id.strip().lower()
    team = state.get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")

    if state.has_submitted(team_id, CHAPTER):
        raise HTTPException(status_code=409, detail="Already submitted — one shot only")

    state.set_contain_submission(team_id, payload.answers)
    probes, total_points = evaluate_submission(payload.answers)
    is_first = state.record_first_submission(team_id, CHAPTER)
    achs = compute_achievements(probes, total_points, is_first)

    state.mark_submitted(team_id, CHAPTER)
    state.set_contain_probes(team_id, probes)
    state.set_score(team_id, CHAPTER, total_points)
    state.set_achievements(team_id, CHAPTER, achs)

    score_data = build_score_response(team_id, probes, total_points, achs)
    await manager.broadcast("score_updated", score_data)
    logger.info(
        "Submission scored for %s: %d/%d",
        team_id, score_data["score"], score_data["max_score"],
    )

    return score_data


@router.get("/results/{team_id}")
async def get_team_results(team_id: str):
    team_id = team_id.strip().lower()
    team = state.get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")

    if not state.has_submitted(team_id, CHAPTER):
        raise HTTPException(status_code=404, detail="Team has not submitted yet")

    answers = state.get_contain_submission(team_id) or []
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
        "score": state.get_score(team_id, CHAPTER),
        "max_score": max_score(),
        "achievements": state.get_achievements(team_id, CHAPTER),
        "scenarios": scenario_details,
    }
