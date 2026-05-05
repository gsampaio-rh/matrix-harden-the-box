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
