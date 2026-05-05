# Plan: Harden the Box

**Status:** Sprint 5.1 (complete) | Sprint 5.2 (pending)
**Date:** 2026-05-05
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

## Sprint 5.2 — Victim Pod Deployment

```
Progress: [..........] 0%
```

- [ ] Define the victim pod spec (base image, exposed services, intentional weaknesses)
- [ ] Build deployment mechanism to apply the winning team's `DefenseConfig` as a real pod
- [ ] Automate pod creation from controller (API endpoint or script triggered post-exercise)
- [ ] Verify pod is reachable and probes can target it from within the cluster
- [ ] Document the minimal cluster requirements (namespace, RBAC, network policies)

**Gate:** Winning team's config can be deployed as a running pod with a single action.

## Sprint 5.3 — LLM Attack Agent Investigation

```
Progress: [..........] 0%
```

- [ ] Research LLM agent frameworks and approaches (tool-use, ReAct, function calling)
- [ ] Design agent tooling: which tools the LLM can invoke (kubectl exec, curl, network scan, etc.)
- [ ] Define guardrails and scope boundaries (read-only recon vs controlled exploitation, timeouts)
- [ ] Build a minimal prototype that runs ≥1 attack vector against a test pod
- [ ] Evaluate cost, latency, and reliability of LLM-driven attack sequences
- [ ] Plan UI integration for streaming attack output as a live demo

**Gate:** Prototype agent can attempt at least 3 distinct attack vectors against a deployed pod.

## Sprint 6 — Polish & Workshop Integration

```
Progress: [..........] 0%
```

- [ ] Integrate with `the-matrix-infra` (config.sh, deploy-exercise.sh, Makefile target)
- [ ] Write facilitator run-book (step-by-step for running the exercise)
- [ ] Create `kubeconfig` generation script for participant access (if needed for Sprint 4)
- [ ] Add sound effects / visual polish to attack simulation
- [ ] Test with workshop participants (dry run)

**Gate:** Dry run with 4+ teams completes without facilitator intervention beyond scripted steps.
