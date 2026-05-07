from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Accept both camelCase (frontend) and snake_case (internal) field names."""
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class ScenarioAnswer(CamelModel):
    scenario_id: str
    selected_option: str


class SubmissionPayload(CamelModel):
    answers: list[ScenarioAnswer]


class ProbeResult(BaseModel):
    probe: str
    status: str


class TeamStatus(BaseModel):
    team_id: str
    defenses_applied: bool
    score: int | None = None


# ── Chapter state models ────────────────────────────────────────────

class ContainChapterState(BaseModel):
    submitted: bool = False
    probes: list[ProbeResult] | None = None
    score: int = 0
    achievements: list[str] = []
    submission: list[ScenarioAnswer] | None = None


class ConfigureChapterState(BaseModel):
    submitted: bool = False
    score: int = 0
    achievements: list[str] = []
    submission: dict | None = None
    breakdown: dict | None = None


class TeamState(BaseModel):
    contain: ContainChapterState = ContainChapterState()
    configure: ConfigureChapterState = ConfigureChapterState()


# ── Request models ──────────────────────────────────────────────────

class DimensionChoice(BaseModel):
    dimension_id: str
    option_id: str
    justification: str = ""


class ConfigureSubmission(BaseModel):
    team_id: str
    choices: list[DimensionChoice]
    philosophy: str = ""
