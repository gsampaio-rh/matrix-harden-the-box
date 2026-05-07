import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app import state
from app.persistence import load_snapshot
from app.routers import admin, configure, contain, scores, teams
from app.scenarios import get_public_scenarios
from app.ws import manager

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

STATIC_DIR = Path(__file__).parent.parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger = logging.getLogger(__name__)
    logger.info("Exercise Controller starting")
    snapshot = load_snapshot()
    if snapshot:
        saved_teams, saved_timer, saved_first = snapshot
        state.restore_from_snapshot(saved_teams, saved_timer, saved_first)
        logger.info("Restored %d teams from disk", len(saved_teams))
    yield
    logger.info("Exercise Controller shutting down")


app = FastAPI(
    title="Harden the Box — Exercise Controller",
    version="0.3.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teams.router, prefix="/api/teams", tags=["teams"])
app.include_router(contain.router, prefix="/api/contain", tags=["contain"])
app.include_router(configure.router, prefix="/api/configure", tags=["configure"])
app.include_router(scores.router, prefix="/api/scores", tags=["scores"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])


@app.get("/api/scenarios")
async def list_scenarios():
    return {"scenarios": get_public_scenarios()}


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.websocket("/ws/scoreboard")
async def scoreboard_ws(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws)


if STATIC_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(STATIC_DIR / "index.html")
