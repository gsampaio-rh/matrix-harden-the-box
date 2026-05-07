from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    team_prefix: str = "team"
    default_team_count: int = 10
    controller_port: int = 8080
    admin_key: str = ""
    cors_origins: str = ""

    model_config = {"env_prefix": "HTB_"}


settings = Settings()
