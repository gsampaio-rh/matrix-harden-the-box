# Plan: Harden the Box

**Status:** Sprint 5.1 (complete) | Sprint 5.2 (pending)
**Date:** 2026-05-05
**Updated:** Sprints 5.2–5.3 (Victim Pod, LLM Agent) descoped → Future Explorations
**Related:** [Architecture](ARCHITECTURE.md) | [Changelog](CHANGELOG.md)

---

Conventions: `[ ]` = pending | `[!]` = blocked | **Gate** = required criterion

## Sprint 5.1 — Kata Containers Visual Demo

```
Progress: [##########] 100%  ✓ complete
```

- [x] Design visual explainer comparing runc vs Kata (shared kernel vs microVM isolation)
- [x] Build UI page/section that walks through the Kata isolation model step by step
- [x] Show how Kata protects against container escape, kernel exploits, and noisy-neighbor attacks
- [x] Integrate demo into the workshop flow (standalone `/kata` route with nav link)

**Gate:** ✓ Facilitator can present Kata Containers benefits visually without leaving the app.

## Sprint 5.2 — Polish & Workshop Integration

```
Progress: [..........] 0%
```

- [ ] Integrate with `the-matrix-infra` (config.sh, deploy-exercise.sh, Makefile target)
- [ ] Write facilitator run-book (step-by-step for running the exercise)
- [ ] Create `kubeconfig` generation script for participant access (if needed for Sprint 4)
- [ ] Add sound effects / visual polish to attack simulation
- [ ] Test with workshop participants (dry run)

**Gate:** Dry run with 4+ teams completes without facilitator intervention beyond scripted steps.

---

## Future Explorations

Ideas descoped from the current roadmap. May revisit post-workshop.

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
