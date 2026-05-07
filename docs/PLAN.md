# Plan: Harden the Box

**Status:** No active sprint
**Date:** 2026-05-07
**Last delivery:** Code review refactoring — security, architecture, persistence, correctness, DRY
**Related:** [Architecture](ARCHITECTURE.md) | [Changelog](CHANGELOG.md)

---

Conventions: `[ ]` = pending | `[!]` = blocked | **Gate** = required criterion

## Backlog

No pending items.

---

## Future Explorations

Ideas descoped from the current roadmap. May revisit post-workshop.

### Polish & Workshop Integration (was Sprint 5.2)

- Integrate with `the-matrix-infra` (config.sh, deploy-exercise.sh, Makefile target)
- Write facilitator run-book (step-by-step for running the exercise)
- Create `kubeconfig` generation script for participant access
- Add sound effects / visual polish to attack simulation
- Test with workshop participants (dry run)

### Victim Pod Deployment (was Sprint 5.2)

Deploy the winning team's defense config as a real pod on the cluster for live attack demonstration.

- Define victim pod spec (base image, exposed services, intentional weaknesses)
- Build manifest composer: translate scenario answers → K8s YAML (NetworkPolicy, Role, SecurityContext)
- Deploy via `kubernetes` Python client or `kubectl` from the controller
- Configurable target namespace via env var
- Requires cluster integration and RBAC for the controller's service account

### LLM Attack Agent (was Sprint 5.3)

Use an LLM agent to autonomously probe the deployed victim pod with real attack vectors.

- Research agent frameworks (tool-use, ReAct, function calling)
- Design tooling: kubectl exec, curl, network scan, etc.
- Define guardrails and scope boundaries (read-only recon vs controlled exploitation, timeouts)
- Stream attack output to the UI as a live demo
- Evaluate cost, latency, and reliability
