
from app.models import (
    DefenseConfig,
    NetworkPolicyConfig,
    RbacConfig,
    SecurityContextConfig,
)
from app.services.scoring import (
    build_score_response,
    compute_achievements,
    evaluate_defenses,
)


def test_empty_config_all_passed():
    config = DefenseConfig()
    probes = evaluate_defenses(config)
    assert all(p.status == "PASSED" for p in probes)
    assert len(probes) == 9


def test_full_hardening_blocks_all_scorable():
    config = DefenseConfig(
        network_policy=NetworkPolicyConfig(deny_all_egress=True, deny_all_ingress=True),
        rbac=RbacConfig(
            delete_cluster_role_binding=True,
            create_namespaced_role=True,
            allowed_resources=["pods"],
            allowed_verbs=["get", "list"],
        ),
        security_context=SecurityContextConfig(
            run_as_non_root=True,
            read_only_root_filesystem=True,
        ),
    )
    probes = evaluate_defenses(config)
    blocked = {p.probe for p in probes if p.status == "BLOCKED"}
    expected = {"NET-01", "NET-02", "NET-03", "RBAC-01", "RBAC-02", "RBAC-03", "SEC-01", "SEC-02"}
    assert blocked == expected
    passed = {p.probe for p in probes if p.status == "PASSED"}
    assert passed == {"ESC-01"}


def test_esc01_always_passed():
    config = DefenseConfig(
        network_policy=NetworkPolicyConfig(deny_all_egress=True, deny_all_ingress=True),
        rbac=RbacConfig(delete_cluster_role_binding=True, create_namespaced_role=True),
        security_context=SecurityContextConfig(
            run_as_non_root=True, read_only_root_filesystem=True,
        ),
    )
    probes = evaluate_defenses(config)
    esc = next(p for p in probes if p.probe == "ESC-01")
    assert esc.status == "PASSED"


class TestNetworkProbes:
    def test_net01_blocked_by_deny_egress(self):
        config = DefenseConfig(
            network_policy=NetworkPolicyConfig(deny_all_egress=True),
        )
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "NET-01").status == "BLOCKED"

    def test_net01_passed_without_deny_egress(self):
        config = DefenseConfig()
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "NET-01").status == "PASSED"

    def test_net02_blocked_by_deny_egress(self):
        config = DefenseConfig(
            network_policy=NetworkPolicyConfig(deny_all_egress=True),
        )
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "NET-02").status == "BLOCKED"

    def test_net03_blocked_by_deny_ingress(self):
        config = DefenseConfig(
            network_policy=NetworkPolicyConfig(deny_all_ingress=True),
        )
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "NET-03").status == "BLOCKED"

    def test_net03_passed_without_deny_ingress(self):
        config = DefenseConfig()
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "NET-03").status == "PASSED"


class TestRbacProbes:
    def test_rbac01_blocked_by_delete_crb(self):
        config = DefenseConfig(
            rbac=RbacConfig(delete_cluster_role_binding=True),
        )
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "RBAC-01").status == "BLOCKED"

    def test_rbac01_passed_without_delete_crb(self):
        config = DefenseConfig()
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "RBAC-01").status == "PASSED"

    def test_rbac02_blocked_when_namespaced_role_without_secrets(self):
        config = DefenseConfig(
            rbac=RbacConfig(
                create_namespaced_role=True,
                allowed_resources=["pods"],
            ),
        )
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "RBAC-02").status == "BLOCKED"

    def test_rbac02_passed_when_secrets_in_resources(self):
        config = DefenseConfig(
            rbac=RbacConfig(
                create_namespaced_role=True,
                allowed_resources=["pods", "secrets"],
            ),
        )
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "RBAC-02").status == "PASSED"

    def test_rbac02_passed_without_namespaced_role(self):
        config = DefenseConfig(
            rbac=RbacConfig(create_namespaced_role=False),
        )
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "RBAC-02").status == "PASSED"

    def test_rbac03_blocked_when_namespaced_role_without_delete(self):
        config = DefenseConfig(
            rbac=RbacConfig(
                create_namespaced_role=True,
                allowed_verbs=["get", "list"],
            ),
        )
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "RBAC-03").status == "BLOCKED"

    def test_rbac03_passed_when_delete_in_verbs(self):
        config = DefenseConfig(
            rbac=RbacConfig(
                create_namespaced_role=True,
                allowed_verbs=["get", "list", "delete"],
            ),
        )
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "RBAC-03").status == "PASSED"


class TestSecurityProbes:
    def test_sec01_blocked_by_readonly_rootfs(self):
        config = DefenseConfig(
            security_context=SecurityContextConfig(read_only_root_filesystem=True),
        )
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "SEC-01").status == "BLOCKED"

    def test_sec01_passed_without_readonly(self):
        config = DefenseConfig()
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "SEC-01").status == "PASSED"

    def test_sec02_blocked_by_nonroot(self):
        config = DefenseConfig(
            security_context=SecurityContextConfig(run_as_non_root=True),
        )
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "SEC-02").status == "BLOCKED"

    def test_sec02_passed_without_nonroot(self):
        config = DefenseConfig()
        probes = evaluate_defenses(config)
        assert next(p for p in probes if p.probe == "SEC-02").status == "PASSED"


class TestScoreResponse:
    def test_score_calculation(self):
        config = DefenseConfig(
            network_policy=NetworkPolicyConfig(deny_all_egress=True),
        )
        probes = evaluate_defenses(config)
        resp = build_score_response("team-01", probes, [])
        assert resp["score"] == 20  # NET-01 (10) + NET-02 (10)
        assert resp["max_score"] == 90
        assert resp["blocked_count"] == 2
        assert resp["team"] == "team-01"

    def test_zero_score_empty_config(self):
        probes = evaluate_defenses(DefenseConfig())
        resp = build_score_response("team-01", probes, [])
        assert resp["score"] == 0
        assert resp["blocked_count"] == 0


class TestAchievements:
    def test_network_guardian(self):
        config = DefenseConfig(
            network_policy=NetworkPolicyConfig(deny_all_egress=True, deny_all_ingress=True),
        )
        probes = evaluate_defenses(config)
        achs = compute_achievements(probes, is_first_submission=False)
        assert "network_guardian" in achs
        assert "rbac_master" not in achs

    def test_rbac_master(self):
        config = DefenseConfig(
            rbac=RbacConfig(
                delete_cluster_role_binding=True,
                create_namespaced_role=True,
                allowed_resources=["pods"],
                allowed_verbs=["get"],
            ),
        )
        probes = evaluate_defenses(config)
        achs = compute_achievements(probes, is_first_submission=False)
        assert "rbac_master" in achs

    def test_lockdown(self):
        config = DefenseConfig(
            security_context=SecurityContextConfig(
                run_as_non_root=True, read_only_root_filesystem=True,
            ),
        )
        probes = evaluate_defenses(config)
        achs = compute_achievements(probes, is_first_submission=False)
        assert "lockdown" in achs

    def test_perfect_score(self):
        config = DefenseConfig(
            network_policy=NetworkPolicyConfig(deny_all_egress=True, deny_all_ingress=True),
            rbac=RbacConfig(
                delete_cluster_role_binding=True,
                create_namespaced_role=True,
                allowed_resources=["pods"],
                allowed_verbs=["get"],
            ),
            security_context=SecurityContextConfig(
                run_as_non_root=True, read_only_root_filesystem=True,
            ),
        )
        probes = evaluate_defenses(config)
        achs = compute_achievements(probes, is_first_submission=False)
        assert "perfect_score" in achs

    def test_first_blood(self):
        probes = evaluate_defenses(DefenseConfig())
        achs = compute_achievements(probes, is_first_submission=True)
        assert "first_blood" in achs

    def test_no_first_blood_when_not_first(self):
        probes = evaluate_defenses(DefenseConfig())
        achs = compute_achievements(probes, is_first_submission=False)
        assert "first_blood" not in achs

    def test_no_achievements_empty_config(self):
        probes = evaluate_defenses(DefenseConfig())
        achs = compute_achievements(probes, is_first_submission=False)
        assert achs == []
