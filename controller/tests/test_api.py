import pytest
from httpx import ASGITransport, AsyncClient

from app import state
from app.main import app


@pytest.fixture(autouse=True)
def clean_state():
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
    return res


class TestRegister:
    async def test_register_team(self, client: AsyncClient):
        res = await register(client, "team-01")
        data = res.json()
        assert data["team_id"] == "team-01"
        assert data["status"] == "registered"

    async def test_register_is_idempotent(self, client: AsyncClient):
        await register(client, "team-01")
        res = await register(client, "team-01")
        assert res.status_code == 200
        teams = await client.get("/api/admin/teams")
        assert len(teams.json()["teams"]) == 1

    async def test_register_normalizes_name(self, client: AsyncClient):
        await register(client, "  Team-01 ")
        teams = await client.get("/api/admin/teams")
        assert teams.json()["teams"][0]["team_id"] == "team-01"

    async def test_register_empty_rejected(self, client: AsyncClient):
        res = await client.post("/api/teams/register", json={"team_id": "  "})
        assert res.status_code == 400

    async def test_team_appears_in_leaderboard(self, client: AsyncClient):
        await register(client, "team-alpha")
        res = await client.get("/api/scores")
        teams = res.json()["teams"]
        team_ids = [t["team"] for t in teams]
        assert "team-alpha" in team_ids


class TestDefenses:
    async def test_apply_defenses_returns_score(self, client: AsyncClient):
        await register(client, "team-01")
        config = {
            "network_policy": {"deny_all_egress": True, "deny_all_ingress": True},
            "rbac": {},
            "security_context": {},
        }
        res = await client.post("/api/teams/team-01/defenses", json=config)
        assert res.status_code == 200
        data = res.json()
        assert data["team"] == "team-01"
        assert data["score"] == 35
        assert data["max_score"] == 90
        assert len(data["probes"]) == 9

    async def test_apply_returns_achievements(self, client: AsyncClient):
        await register(client, "team-01")
        config = {
            "network_policy": {"deny_all_egress": True, "deny_all_ingress": True},
            "rbac": {},
            "security_context": {},
        }
        res = await client.post("/api/teams/team-01/defenses", json=config)
        data = res.json()
        assert "network_guardian" in data["achievements"]
        assert "first_blood" in data["achievements"]

    async def test_apply_404_unknown_team(self, client: AsyncClient):
        res = await client.post("/api/teams/team-99/defenses", json={})
        assert res.status_code == 404

    async def test_get_defenses(self, client: AsyncClient):
        await register(client, "team-01")
        config = {"network_policy": {"denyAllEgress": True}}
        await client.post("/api/teams/team-01/defenses", json=config)
        res = await client.get("/api/teams/team-01/defenses")
        assert res.status_code == 200
        assert res.json()["defenses"]["networkPolicy"]["denyAllEgress"] is True

    async def test_apply_camelcase_fields(self, client: AsyncClient):
        """Frontend sends camelCase — backend must accept it."""
        await register(client, "team-01")
        config = {
            "network_policy": {"denyAllEgress": True, "denyAllIngress": True},
            "rbac": {},
            "security_context": {"runAsNonRoot": True},
        }
        res = await client.post("/api/teams/team-01/defenses", json=config)
        assert res.status_code == 200
        assert res.json()["score"] == 45  # NET-01(10)+NET-02(10)+NET-03(15)+SEC-02(10)

    async def test_first_blood_only_first_team(self, client: AsyncClient):
        await register(client, "team-01")
        await register(client, "team-02")
        r1 = await client.post("/api/teams/team-01/defenses", json={})
        assert "first_blood" in r1.json()["achievements"]
        r2 = await client.post("/api/teams/team-02/defenses", json={})
        assert "first_blood" not in r2.json()["achievements"]


class TestLeaderboard:
    async def test_leaderboard_sorted_by_score(self, client: AsyncClient):
        await register(client, "team-01")
        await register(client, "team-02")
        await client.post("/api/teams/team-02/defenses", json={
            "network_policy": {"deny_all_egress": True, "deny_all_ingress": True},
        })
        await client.post("/api/teams/team-01/defenses", json={})
        res = await client.get("/api/scores")
        data = res.json()
        assert data["teams"][0]["team"] == "team-02"
        assert data["teams"][0]["score"] > data["teams"][1]["score"]

    async def test_leaderboard_includes_unscored_teams(self, client: AsyncClient):
        await register(client, "team-01")
        await register(client, "team-02")
        await client.post("/api/teams/team-01/defenses", json={})
        res = await client.get("/api/scores")
        teams = res.json()["teams"]
        assert len(teams) == 2

    async def test_team_score_endpoint(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post("/api/teams/team-01/defenses", json={
            "security_context": {"run_as_non_root": True},
        })
        res = await client.get("/api/scores/team-01")
        assert res.json()["score"] == 10


class TestTimer:
    async def test_start_timer(self, client: AsyncClient):
        res = await client.post(
            "/api/admin/timer", json={"duration_minutes": 15}
        )
        assert res.status_code == 200
        assert "end_time" in res.json()

    async def test_get_timer_active(self, client: AsyncClient):
        await client.post("/api/admin/timer", json={"duration_minutes": 15})
        res = await client.get("/api/admin/timer")
        data = res.json()
        assert data["active"] is True
        assert data["end_time"] is not None

    async def test_get_timer_inactive(self, client: AsyncClient):
        res = await client.get("/api/admin/timer")
        data = res.json()
        assert data["active"] is False

    async def test_stop_timer(self, client: AsyncClient):
        await client.post("/api/admin/timer", json={"duration_minutes": 15})
        res = await client.delete("/api/admin/timer")
        assert res.status_code == 200
        res = await client.get("/api/admin/timer")
        assert res.json()["active"] is False

    async def test_invalid_duration(self, client: AsyncClient):
        res = await client.post(
            "/api/admin/timer", json={"duration_minutes": 0}
        )
        assert res.status_code == 400


class TestReset:
    async def test_reset_clears_everything(self, client: AsyncClient):
        await register(client, "team-01")
        await register(client, "team-02")
        await client.post("/api/teams/team-01/defenses", json={})
        await client.post("/api/admin/timer", json={"duration_minutes": 10})
        res = await client.post("/api/admin/reset")
        assert res.status_code == 200

        teams = await client.get("/api/admin/teams")
        assert len(teams.json()["teams"]) == 0

        timer = await client.get("/api/admin/timer")
        assert timer.json()["active"] is False


class TestHealthz:
    async def test_healthz(self, client: AsyncClient):
        res = await client.get("/healthz")
        assert res.status_code == 200
        assert res.json()["status"] == "ok"
