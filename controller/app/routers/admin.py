import logging
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app import state
from app.ws import manager

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/reset")
async def reset_exercise():
    state.clear_all()
    await manager.broadcast("exercise_reset", {})
    logger.info("Exercise reset complete")
    return {"status": "reset complete"}


@router.get("/teams")
async def list_teams():
    result = []
    for team_id in state.get_all_teams():
        chapters = {}
        for ch_name in state.CHAPTERS:
            ch = state.get_chapter(team_id, ch_name)
            chapters[ch_name] = {
                "submitted": ch["submitted"] if ch else False,
                "score": ch["score"] if ch else 0,
                "achievements": ch["achievements"] if ch else [],
            }

        contain_ch = chapters.get("contain", {})
        result.append({
            "team": team_id,
            "submitted": contain_ch.get("submitted", False),
            "score": contain_ch.get("score", 0) if contain_ch.get("submitted") else None,
            "achievements": contain_ch.get("achievements", []),
            "chapters": chapters,
        })
    return {"teams": result}


class TimerRequest(BaseModel):
    duration_minutes: int


@router.post("/timer")
async def start_timer(req: TimerRequest):
    if req.duration_minutes <= 0:
        raise HTTPException(status_code=400, detail="Duration must be positive")

    duration_ms = req.duration_minutes * 60 * 1000
    end = datetime.now(UTC) + timedelta(minutes=req.duration_minutes)
    state.set_timer(end)
    await manager.broadcast(
        "timer_started",
        {"end_time": end.isoformat(), "duration_ms": duration_ms},
    )
    logger.info("Timer started: %d minutes", req.duration_minutes)
    return {"status": "timer started", "end_time": end.isoformat()}


@router.delete("/timer")
async def stop_timer():
    state.set_timer(None)
    await manager.broadcast("timer_stopped", {})
    logger.info("Timer stopped")
    return {"status": "timer stopped"}


@router.get("/timer")
async def get_timer():
    end = state.get_timer()
    if end is None:
        return {"active": False, "end_time": None}
    return {"active": True, "end_time": end.isoformat()}
