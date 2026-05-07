import pytest
from httpx import ASGITransport, AsyncClient

from app import state
from app.main import app


@pytest.fixture(autouse=True)
def clean_state():
    state.set_persist_fn(lambda: None)
    state.clear_all()
    yield
    state.clear_all()


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


async def register(client: AsyncClient, team_id: str):
    res = await client.post("/api/teams/register", json={"team_id": team_id})
    assert res.status_code == 200


GOOD_PAYLOAD = {
    "team_id": "team-01",
    "choices": [
        {"dimension_id": "context_strategy", "option_id": "B",
         "justification": "Context resets give a clean slate, but we lose nuance from prior sessions."},
        {"dimension_id": "work_decomposition", "option_id": "D",
         "justification": "Incremental checkpoints keep things simple, however we risk losing big-picture direction."},
        {"dimension_id": "evaluation_strategy", "option_id": "B",
         "justification": "External evaluator catches bugs we'd miss, but doubles our cost and latency."},
        {"dimension_id": "autonomy_boundaries", "option_id": "B",
         "justification": "Scoped mutation gives speed within boundaries, although tuning scope is tricky."},
        {"dimension_id": "knowledge_architecture", "option_id": "B",
         "justification": "Map + pointers scales well, but the agent might not find what it needs."},
        {"dimension_id": "recovery_resilience", "option_id": "C",
         "justification": "Checkpoint rollback is clean recovery, but adds overhead and misses subtle errors."},
    ],
    "philosophy": (
        "We prioritize clean context resets with minimal handoff artifacts, "
        "accepting the cost of rebuilding state each session. External evaluation "
        "justifies scoped autonomy — the tradeoff is higher cost for higher confidence."
    ),
}


class TestConfigureContent:
    async def test_get_content(self, client: AsyncClient):
        res = await client.get("/api/configure/content")
        assert res.status_code == 200
        data = res.json()
        assert "briefing" in data
        assert "dimensions" in data
        assert len(data["dimensions"]) == 6

    async def test_dimensions_have_options(self, client: AsyncClient):
        res = await client.get("/api/configure/content")
        dims = res.json()["dimensions"]
        for dim in dims:
            assert "id" in dim
            assert "title" in dim
            assert "options" in dim
            assert len(dim["options"]) == 4


class TestConfigureSubmission:
    async def test_submit_good_config(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.post("/api/configure/submit", json=GOOD_PAYLOAD)
        assert res.status_code == 200
        data = res.json()
        assert data["team"] == "team-01"
        assert data["score"] > 20
        assert data["max_score"] == 30
        assert "awareness" in data
        assert "coherence" in data
        assert "philosophy" in data
        assert "completeness" in data

    async def test_submit_empty_config(self, client: AsyncClient):
        await register(client, "team-01")
        payload = {
            "team_id": "team-01",
            "choices": [],
            "philosophy": "",
        }
        res = await client.post("/api/configure/submit", json=payload)
        assert res.status_code == 200
        assert res.json()["score"] <= 5

    async def test_one_shot_enforcement(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post("/api/configure/submit", json=GOOD_PAYLOAD)
        res = await client.post("/api/configure/submit", json=GOOD_PAYLOAD)
        assert res.status_code == 409

    async def test_submit_404_unknown_team(self, client: AsyncClient):
        payload = {**GOOD_PAYLOAD, "team_id": "ghost"}
        res = await client.post("/api/configure/submit", json=payload)
        assert res.status_code == 404

    async def test_submit_returns_achievements(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.post("/api/configure/submit", json=GOOD_PAYLOAD)
        achs = res.json()["achievements"]
        assert "complete_architect" in achs
        assert "tradeoff_aware" in achs


class TestConfigureResults:
    async def test_results_404_unknown_team(self, client: AsyncClient):
        res = await client.get("/api/configure/results/unknown")
        assert res.status_code == 404

    async def test_results_404_before_submit(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.get("/api/configure/results/team-01")
        assert res.status_code == 404

    async def test_results_after_submit(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post("/api/configure/submit", json=GOOD_PAYLOAD)
        res = await client.get("/api/configure/results/team-01")
        assert res.status_code == 200
        data = res.json()
        assert data["team"] == "team-01"
        assert data["score"] > 20
        assert "breakdown" in data


class TestCrossChapterScoreboard:
    async def test_scoreboard_includes_configure_score(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post("/api/configure/submit", json=GOOD_PAYLOAD)
        res = await client.get("/api/scores")
        team = res.json()["teams"][0]
        assert team["chapters"]["configure"]["score"] > 20
        assert team["chapters"]["configure"]["submitted"] is True

    async def test_scoreboard_sums_both_chapters(self, client: AsyncClient):
        await register(client, "team-01")
        from app.scenarios import SCENARIOS
        best = [{"scenarioId": s["id"], "selectedOption": s["best"]} for s in SCENARIOS]
        await client.post("/api/contain/team-01/submit", json={"answers": best})
        await client.post("/api/configure/submit", json=GOOD_PAYLOAD)
        res = await client.get("/api/scores")
        team = res.json()["teams"][0]
        assert team["chapters"]["contain"]["score"] == 140
        assert team["chapters"]["configure"]["score"] > 20
        assert team["total_score"] > 160


class TestTeamIdNormalization:
    async def test_submit_with_different_casing(self, client: AsyncClient):
        await register(client, "team-01")
        payload = {**GOOD_PAYLOAD, "team_id": "Team-01"}
        res = await client.post("/api/configure/submit", json=payload)
        assert res.status_code == 200
        assert res.json()["team"] == "team-01"

    async def test_results_with_different_casing(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post("/api/configure/submit", json=GOOD_PAYLOAD)
        res = await client.get("/api/configure/results/Team-01")
        assert res.status_code == 200
        assert res.json()["team"] == "team-01"


class TestFirstSubmission:
    async def test_first_submission_only_first_team(self, client: AsyncClient):
        await register(client, "team-a")
        await register(client, "team-b")
        payload_a = {**GOOD_PAYLOAD, "team_id": "team-a"}
        payload_b = {**GOOD_PAYLOAD, "team_id": "team-b"}
        res_a = await client.post("/api/configure/submit", json=payload_a)
        res_b = await client.post("/api/configure/submit", json=payload_b)
        assert "first_blood" in res_a.json()["achievements"]
        assert "first_blood" not in res_b.json()["achievements"]


class TestMalformedBodies:
    async def test_missing_choices_returns_422(self, client: AsyncClient):
        await register(client, "team-01")
        payload = {"team_id": "team-01", "philosophy": "test"}
        res = await client.post("/api/configure/submit", json=payload)
        assert res.status_code == 422

    async def test_missing_team_id_returns_422(self, client: AsyncClient):
        payload = {"choices": [], "philosophy": ""}
        res = await client.post("/api/configure/submit", json=payload)
        assert res.status_code == 422
