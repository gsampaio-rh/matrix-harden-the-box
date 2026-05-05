from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Accept both camelCase (frontend) and snake_case (internal) field names."""
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class NetworkPolicyConfig(CamelModel):
    deny_all_egress: bool = False
    allow_llm_egress: bool = False
    allow_dns: bool = False
    deny_all_ingress: bool = False
    allow_health_checks: bool = False


class RbacConfig(CamelModel):
    delete_cluster_role_binding: bool = False
    create_namespaced_role: bool = False
    allowed_resources: list[str] = []
    allowed_verbs: list[str] = []


class SecurityContextConfig(CamelModel):
    run_as_non_root: bool = False
    drop_all_capabilities: bool = False
    read_only_root_filesystem: bool = False
    mount_tmp_empty_dir: bool = False
    seccomp_runtime_default: bool = False
    disallow_privilege_escalation: bool = False


class DefenseConfig(CamelModel):
    network_policy: NetworkPolicyConfig = NetworkPolicyConfig()
    rbac: RbacConfig = RbacConfig()
    security_context: SecurityContextConfig = SecurityContextConfig()


class ProbeResult(BaseModel):
    probe: str
    status: str


class TeamStatus(BaseModel):
    team_id: str
    defenses_applied: bool
    score: int | None = None
