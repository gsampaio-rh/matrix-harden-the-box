# Plan: Harden the Box

**Status:** Sprint 3 (pending)
**Date:** 2026-05-05
**Related:** [Architecture](ARCHITECTURE.md) | [Changelog](CHANGELOG.md)

---

Conventions: `[ ]` = pending | `[!]` = blocked | **Gate** = required criterion

## Sprint 3 — Build & Deploy Pipeline

```
Progress: [..........] 0%
```

- [ ] Set up GitHub repo `matrix-harden-the-box` with branch protection
- [ ] Configure container image build (GitHub Actions)
- [ ] Push image to `quay.io/matrix-workshop/harden-the-box:latest`
- [ ] Update Helm chart for single-container deployment
- [ ] End-to-end deploy on OpenShift test cluster via `make deploy`
- [ ] Verify Routes, health checks, and WebSocket connectivity
- [ ] Load test with 20 concurrent browser sessions

**Gate:** Full exercise cycle completes on a deployed instance with at least 10 teams.

## Sprint 4 — Real Cluster Deployment + LLM Attack (Future Exploration)

```
Progress: [..........] 0%
```

- [ ] Deploy the winning team's `DefenseConfig` as a real pod on the cluster
- [ ] Build LLM attack agent that attempts to penetrate the deployed config
- [ ] Integrate attack agent output into the UI as a live demo
- [ ] Kata Containers reveal — demonstrate kernel-level isolation
- [ ] Design agent tooling (kubectl exec, curl, network scanning)
- [ ] Define guardrails for LLM agent scope (read-only vs destructive)

**Gate:** LLM agent can attempt at least 3 distinct attack vectors against a deployed pod.

## Sprint 5 — Polish & Workshop Integration

```
Progress: [..........] 0%
```

- [ ] Integrate with `the-matrix-infra` (config.sh, deploy-exercise.sh, Makefile target)
- [ ] Write facilitator run-book (step-by-step for running the exercise)
- [ ] Create `kubeconfig` generation script for participant access (if needed for Sprint 4)
- [ ] Add sound effects / visual polish to attack simulation
- [ ] Test with workshop participants (dry run)

**Gate:** Dry run with 4+ teams completes without facilitator intervention beyond scripted steps.
