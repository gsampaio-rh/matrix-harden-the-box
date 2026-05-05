from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    team_prefix: str = "team"
    default_team_count: int = 10
    controller_port: int = 8080

    probe_points: dict[str, int] = {
        "NET-01": 10,
        "NET-02": 10,
        "NET-03": 15,
        "RBAC-01": 10,
        "RBAC-02": 15,
        "RBAC-03": 10,
        "SEC-01": 10,
        "SEC-02": 10,
        "ESC-01": 0,
    }

    model_config = {"env_prefix": "HTB_"}


settings = Settings()
