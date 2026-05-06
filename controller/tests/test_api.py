import pytest
from httpx import ASGITransport, AsyncClient

from app import state
from app.main import app
from app.scenarios import SCENARIOS


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


def _best_answers() -> list[dict]:
    return [
        {"scenarioId": s["id"], "selectedOption": s["best"]}
        for s in SCENARIOS
    ]


def _worst_answers() -> list[dict]:
    return [
        {"scenarioId": s["id"], "selectedOption": "a"}
        for s in SCENARIOS
    ]


class TestRegister:
    async def test_register_team(self, client: AsyncClient):
        res = await register(client, "team-01")
        data = res.json()
        assert data["team"] == "team-01"
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
        assert teams.json()["teams"][0]["team"] == "team-01"

    async def test_register_empty_rejected(self, client: AsyncClient):
        res = await client.post("/api/teams/register", json={"team_id": "  "})
        assert res.status_code == 400

    async def test_team_appears_in_leaderboard(self, client: AsyncClient):
        await register(client, "team-alpha")
        res = await client.get("/api/scores")
        team_ids = [t["team"] for t in res.json()["teams"]]
        assert "team-alpha" in team_ids


class TestScenarios:
    async def test_list_scenarios(self, client: AsyncClient):
        res = await client.get("/api/scenarios")
        assert res.status_code == 200
        scenarios = res.json()["scenarios"]
        assert len(scenarios) == 7

    async def test_scenarios_hide_answers(self, client: AsyncClient):
        res = await client.get("/api/scenarios")
        for s in res.json()["scenarios"]:
            for _key, opt in s["options"].items():
                assert "points" not in opt
                assert "probes_blocked" not in opt
            assert "best" not in s
            assert "explanation" not in s


class TestSubmission:
    async def test_submit_best_answers(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _best_answers()},
        )
        assert res.status_code == 200
        data = res.json()
        assert data["team"] == "team-01"
        assert data["score"] > 0
        assert data["score"] == data["max_score"]
        assert len(data["probes"]) > 0

    async def test_submit_worst_answers_zero(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _worst_answers()},
        )
        assert res.json()["score"] == 0

    async def test_one_shot_enforcement(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _worst_answers()},
        )
        res = await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _best_answers()},
        )
        assert res.status_code == 409

    async def test_submit_404_unknown_team(self, client: AsyncClient):
        res = await client.post(
            "/api/contain/team-99/submit",
            json={"answers": []},
        )
        assert res.status_code == 404

    async def test_submit_returns_achievements(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _best_answers()},
        )
        data = res.json()
        assert "perfect_score" in data["achievements"]
        assert "first_blood" in data["achievements"]

    async def test_first_blood_only_first_team(self, client: AsyncClient):
        await register(client, "team-01")
        await register(client, "team-02")
        r1 = await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _worst_answers()},
        )
        assert "first_blood" in r1.json()["achievements"]
        r2 = await client.post(
            "/api/contain/team-02/submit",
            json={"answers": _worst_answers()},
        )
        assert "first_blood" not in r2.json()["achievements"]

    async def test_partial_answers(self, client: AsyncClient):
        await register(client, "team-01")
        partial = [{"scenarioId": "net-egress", "selectedOption": "c"}]
        res = await client.post(
            "/api/contain/team-01/submit",
            json={"answers": partial},
        )
        data = res.json()
        assert data["score"] == 20
        assert data["score"] < data["max_score"]


class TestTeamStatus:
    async def test_status_before_submit(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.get("/api/teams/team-01/status")
        assert res.status_code == 200
        data = res.json()
        assert data["submitted"] is False
        assert data["achievements"] == []

    async def test_status_after_submit(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _best_answers()},
        )
        res = await client.get("/api/teams/team-01/status")
        data = res.json()
        assert data["submitted"] is True
        assert len(data["achievements"]) > 0

    async def test_status_404_unknown_team(self, client: AsyncClient):
        res = await client.get("/api/teams/unknown/status")
        assert res.status_code == 404

    async def test_status_has_chapter_breakdown(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.get("/api/teams/team-01/status")
        data = res.json()
        assert "chapters" in data
        assert "contain" in data["chapters"]
        assert "configure" in data["chapters"]


class TestResults:
    async def test_results_404_unknown_team(self, client: AsyncClient):
        res = await client.get("/api/contain/results/unknown")
        assert res.status_code == 404

    async def test_results_404_before_submit(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.get("/api/contain/results/team-01")
        assert res.status_code == 404

    async def test_results_after_submit(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _best_answers()},
        )
        res = await client.get("/api/contain/results/team-01")
        assert res.status_code == 200
        data = res.json()
        assert data["team"] == "team-01"
        assert data["score"] == data["max_score"]
        assert len(data["scenarios"]) == 7
        assert isinstance(data["achievements"], list)

    async def test_results_scenario_shape(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _best_answers()},
        )
        res = await client.get("/api/contain/results/team-01")
        scenario = res.json()["scenarios"][0]
        assert "id" in scenario
        assert "category" in scenario
        assert "title" in scenario
        assert "selected_option" in scenario
        assert "selected_label" in scenario
        assert "best_option" in scenario
        assert "best_label" in scenario
        assert "points_earned" in scenario
        assert "max_points" in scenario
        assert "is_best" in scenario
        assert "explanation" in scenario
        assert len(scenario["explanation"]) > 0

    async def test_results_best_answers_all_correct(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _best_answers()},
        )
        res = await client.get("/api/contain/results/team-01")
        for scenario in res.json()["scenarios"]:
            assert scenario["is_best"] is True
            assert scenario["points_earned"] == scenario["max_points"]

    async def test_results_worst_answers_none_correct(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _worst_answers()},
        )
        res = await client.get("/api/contain/results/team-01")
        for scenario in res.json()["scenarios"]:
            assert scenario["is_best"] is False
            assert scenario["points_earned"] == 0


class TestLeaderboard:
    async def test_leaderboard_sorted_by_score(self, client: AsyncClient):
        await register(client, "team-01")
        await register(client, "team-02")
        await client.post(
            "/api/contain/team-02/submit",
            json={"answers": _best_answers()},
        )
        await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _worst_answers()},
        )
        res = await client.get("/api/scores")
        teams = res.json()["teams"]
        assert teams[0]["team"] == "team-02"
        assert teams[0]["total_score"] > teams[1]["total_score"]

    async def test_leaderboard_includes_unscored_teams(self, client: AsyncClient):
        await register(client, "team-01")
        await register(client, "team-02")
        await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _worst_answers()},
        )
        res = await client.get("/api/scores")
        assert len(res.json()["teams"]) == 2

    async def test_team_score_endpoint(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _best_answers()},
        )
        res = await client.get("/api/scores/team-01")
        assert res.json()["total_score"] > 0

    async def test_team_score_before_submit(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.get("/api/scores/team-01")
        assert res.status_code == 200
        data = res.json()
        assert data["total_score"] == 0

    async def test_team_score_404_unknown_team(self, client: AsyncClient):
        res = await client.get("/api/scores/ghost")
        assert res.status_code == 404

    async def test_leaderboard_has_chapter_breakdown(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.get("/api/scores")
        team = res.json()["teams"][0]
        assert "chapters" in team
        assert "contain" in team["chapters"]
        assert "configure" in team["chapters"]
        assert "total_score" in team
        assert "max_total" in team


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
        assert res.json()["active"] is True

    async def test_get_timer_inactive(self, client: AsyncClient):
        res = await client.get("/api/admin/timer")
        assert res.json()["active"] is False

    async def test_stop_timer(self, client: AsyncClient):
        await client.post("/api/admin/timer", json={"duration_minutes": 15})
        await client.delete("/api/admin/timer")
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
        await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _best_answers()},
        )
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


class TestContainNormalization:
    async def test_submit_with_different_casing(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.post(
            "/api/contain/Team-01/submit",
            json={"answers": _best_answers()},
        )
        assert res.status_code == 200
        assert res.json()["team"] == "team-01"

    async def test_results_with_different_casing(self, client: AsyncClient):
        await register(client, "team-01")
        await client.post(
            "/api/contain/team-01/submit",
            json={"answers": _best_answers()},
        )
        res = await client.get("/api/contain/results/Team-01")
        assert res.status_code == 200
        assert res.json()["team"] == "team-01"

    async def test_status_with_different_casing(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.get("/api/teams/Team-01/status")
        assert res.status_code == 200
        assert res.json()["team"] == "team-01"

    async def test_scores_with_different_casing(self, client: AsyncClient):
        await register(client, "team-01")
        res = await client.get("/api/scores/Team-01")
        assert res.status_code == 200
        assert res.json()["team"] == "team-01"


class TestWsDisconnectSafety:
    def test_double_disconnect_no_error(self):
        from unittest.mock import AsyncMock
        from app.ws import ConnectionManager

        mgr = ConnectionManager()
        fake_ws = AsyncMock()
        mgr._connections.append(fake_ws)
        mgr.disconnect(fake_ws)
        mgr.disconnect(fake_ws)
        assert fake_ws not in mgr._connections
