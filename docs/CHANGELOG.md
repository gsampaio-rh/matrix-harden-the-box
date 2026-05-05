# Changelog: Harden the Box

## Sprint 5.1 — Kata Containers Visual Demo

**Date:** 2026-05-05
**Status:** Complete

### Key Outcomes

- Built standalone `/kata` route with 5 click-through slides explaining Kata Containers isolation model
- Facilitator can present runc vs Kata comparison visually without leaving the app
- 5 inline SVG illustrations following existing wireframe style (monospace, Matrix theme CSS vars)
- Keyboard navigation (arrow keys) + step indicator dots + Back/Next buttons
- 12 new vitest tests covering rendering, navigation, and keyboard interaction
- 60 tests passing total: 58 backend (pytest) + 48 frontend (vitest, up from 36)

### What was added

- `ui/src/pages/KataDemo.tsx` — 5-step click-through demo with keyboard support and `animate-fade-in` transitions
- `ui/src/components/illustrations/KataTraditional.tsx` — shared kernel diagram (3 pods on 1 kernel)
- `ui/src/components/illustrations/KataEscape.tsx` — container escape attack flow (red arrows through shared kernel)
- `ui/src/components/illustrations/KataMicroVM.tsx` — Kata microVM model (per-pod guest kernels + hypervisor layer)
- `ui/src/components/illustrations/KataBlocked.tsx` — attack stopped at microVM boundary (green checkmarks on isolated pods)
- `ui/src/components/illustrations/KataDepth.tsx` — defense in depth (L1 K8s hardening + L2 Kata isolation)
- `ui/src/pages/__tests__/KataDemo.test.tsx` — 12 tests (step rendering, navigation, keyboard, dot indicators)

### What was changed

- `ui/src/App.tsx` — added `/kata` route and "Kata" nav link between Scoreboard and Admin

### Decisions

| Decision | Rationale |
|---|---|
| Standalone route over post-scoring reveal | Facilitator controls when to present; not tied to exercise flow |
| Click-through over auto-play | Facilitator controls pacing like slides; can pause to discuss each step |
| No backend changes | Pure educational content; no state, no API, no WebSocket needed |
| viewBox 400x200/220 for Kata SVGs | More horizontal space needed for 3 microVMs + hypervisor layer |

---

## Sprint 4 — Build & Deploy on OpenShift

**Date:** 2026-05-05
**Status:** Complete

### Key Outcomes

- `make deploy` builds from source directly on OpenShift — no external registry required
- OpenShift BuildConfig (Docker strategy, binary source) builds using the existing multi-stage Dockerfile
- ImageStream stores built images in the internal registry with local lookup policy
- Image-change trigger annotation auto-redeploys when a new build lands
- Dockerfile fixed for OpenShift build pods: replaced bash process substitution with portable Python, fixed non-root write path
- Load tested with 20 concurrent teams: zero errors, all endpoints under 200ms avg (except register at ~600ms due to WebSocket broadcast fan-out)
- Full exercise cycle verified on cluster: register, scenarios, submit, results, leaderboard, WebSocket

### What was added

- `chart/templates/controller-buildconfig.yaml` — BuildConfig with Docker strategy, binary source, gated by `.Values.build.enabled`
- `chart/templates/controller-imagestream.yaml` — ImageStream with local lookup policy, gated by `.Values.build.enabled`
- `chart/values.yaml` — `build.enabled` and `build.dockerfilePath` configuration
- `scripts/load-test.py` — async load test script (configurable team count, auto-detects route, tests full exercise flow + WebSocket)
- `Makefile` — `build-cluster` target for triggering builds without re-helming

### What was changed

- `chart/templates/controller-deployment.yaml` — added `image.openshift.io/triggers` annotation for ImageStream auto-deploy, added `serviceAccountName`
- `scripts/deploy.sh` — helm install (without `--wait` to avoid deadlock), then `oc start-build --from-dir --follow`, then `oc rollout status`
- `build/Dockerfile` — replaced `pip install <(python -c ...)` process substitution with portable `/tmp/requirements.txt` generation

### Decisions

| Decision | Rationale |
|---|---|
| Binary source over Git source | Builds from local working directory — no git remote or webhook needed |
| `build.enabled` gate | Chart still works with pre-built external images when set to false |
| No `--wait` on helm install | Pods depend on the build; `--wait` would deadlock before build starts |
| Image trigger annotation over manual rollout | Automatic redeployment when ImageStream tag updates |

### Load Test Results (20 teams)

| Endpoint | Avg | p95 | Max |
|---|---|---|---|
| Register | 586ms | 624ms | 643ms |
| Scenarios | 170ms | 177ms | 200ms |
| Submit | 167ms | 174ms | 175ms |
| Results | 170ms | 175ms | 179ms |
| WebSocket | held 9.6s | — | — |

---

## Sprint 3 — Scenario UX & Results Deep-Dive

**Date:** 2026-05-05
**Status:** Complete

### Key Outcomes

- Added `explanation` field to all 7 scenarios in `scenarios.yaml` — shown in post-submission results review
- Built `GET /api/teams/{id}/results` endpoint returning per-scenario breakdown (selected vs. best answer, points, explanation)
- Created 7 per-scenario inline SVG illustrations (one per scenario, tailored to each situation) using Matrix theme CSS variables
- Built `/results` page with full scenario review: illustrations, answer comparison, points, explanations
- Replaced native browser tooltips on achievement badges with styled popovers showing name, description, and earn criteria
- Added fade-in transition animations between wizard steps
- Added canvas-confetti burst on perfect score during attack simulation
- Raw answers now stored in state for results reconstruction
- Added vitest + testing-library for frontend component tests
- 94 tests passing: 58 backend (pytest) + 36 frontend (vitest)

### What was added

- `controller/app/scenarios.yaml` — `explanation` field per scenario
- `GET /api/teams/{id}/results` — detailed per-scenario breakdown endpoint
- `ui/src/pages/Results.tsx` — post-submission results review page
- `ui/src/components/illustrations/NetEgressDiagram.tsx` — egress topology (pod → internet/LLM/DNS)
- `ui/src/components/illustrations/NetIngressDiagram.tsx` — ingress topology (attacker/frontend/kubelet → pod)
- `ui/src/components/illustrations/RbacCrbDiagram.tsx` — ClusterRoleBinding → namespace Role
- `ui/src/components/illustrations/RbacSecretsDiagram.tsx` — resourceNames scoping on Secrets
- `ui/src/components/illustrations/SecRootDiagram.tsx` — runAsNonRoot + port 8080 vs root
- `ui/src/components/illustrations/SecFilesystemDiagram.tsx` — readOnlyRootFilesystem + emptyDir
- `ui/src/components/illustrations/SecCapsDiagram.tsx` — drop ALL capabilities
- `canvas-confetti` dependency for perfect score celebration
- `animate-fade-in` CSS animation for wizard step transitions
- `howToEarn` field in `ACHIEVEMENTS` constant for tooltip content
- `ScenarioResult`, `TeamResults` TypeScript types
- `api.getTeamResults()` API method
- Backend: 8 new tests — `TestResults` (6 tests), `TestYamlIntegrity.test_explanations_are_non_empty`, updated `test_scenarios_hide_answers`
- Frontend: vitest + testing-library setup, 36 tests — `illustrations.test.tsx` (21), `Achievements.test.tsx` (6), `Results.test.tsx` (9)

### What was changed

- `Achievements.tsx` — rewritten with styled popover tooltips (hover/click)
- `HardenConfig.tsx` — added illustrations, fade transitions, navigates to `/results` after attack simulation
- `AttackSimulation.tsx` — fires confetti on perfect score
- `Scoreboard.tsx` — added "View Details" link for own team
- `App.tsx` — added `/results` route
- `state.py` — added `submissions` dict to store raw answers
- `routers/teams.py` — stores raw answers on submit, new results endpoint

### Decisions

| Decision | Rationale |
|---|---|
| Inline SVG over external assets | Responsive, dark-mode native via CSS variables, no asset bundling needed |
| 7 per-scenario illustrations (not 3 per-category) | Each scenario has a distinct concept; tailored diagrams teach better |
| Results as separate page (not modal) | Scrollable content, linkable URL, better for 7 scenarios of detail |
| canvas-confetti (imperative) over React wrapper | 6kb, no wrapper needed, call directly on score reveal |

---

## Housekeeping — Deploy config cleanup

**Date:** 2026-05-05

- Changed default namespace from `exercise-system`/`harden-the-box` to `workshop-content` across all deploy artifacts
- Removed stale multi-container image references from `.env.example` (leftover from pre-Sprint 2 architecture)

---

## Sprint 2b — Scenario-Based Redesign

**Date:** 2026-05-05
**Status:** Complete

### Key Outcomes

- Replaced toggle-based defense form with scenario-based quiz (7 scenarios, 4 options each)
- Implemented step-by-step wizard UI with progress bar and review screen
- Added self-registration flow — teams register themselves at login, no facilitator pre-setup needed
- Externalized scenario definitions to `scenarios.yaml` — facilitators can customize without code changes
- One-shot submission enforcement — teams submit once, no retries
- 51 tests passing (YAML integrity + scoring rules + API endpoints)

### What was removed

- `ui/src/components/DefenseToggle.tsx` (replaced by scenario wizard)
- `ui/src/components/DefenseStrength.tsx` (removed — no preview of correctness before submit)
- `DefenseConfig`, `NetworkPolicyConfig`, `RbacConfig`, `SecurityContextConfig` models
- `PROBE_POINTS` frontend constant
- `POST /api/admin/setup` endpoint (replaced by self-registration)
- `POST /api/teams/{id}/defenses` endpoint (replaced by `/submit`)

### What was added

- `controller/app/scenarios.yaml` — externalized scenario definitions (7 scenarios)
- `controller/app/scenarios.py` — YAML loader with public stripping for frontend
- `ScenarioAnswer`, `SubmissionPayload` Pydantic models with camelCase alias support
- `POST /api/teams/register` — self-registration endpoint
- `POST /api/teams/{id}/submit` — one-shot scenario submission
- `GET /api/scenarios` — serves scenarios without answers/points
- `GET /api/teams/{id}/status` — team submission status
- `TestYamlIntegrity` test class — validates scenarios.yaml structure on every test run
- `TestTeamStatus` test class — covers status endpoint
- `pyyaml` dependency for YAML loading

### Decisions

| Decision | Rationale |
|---|---|
| Scenario quiz over toggle form | Trade-off questions teach more than binary toggles |
| YAML over Python for scenario data | Facilitators can edit without touching code |
| One-shot submission | Prevents trial-and-error, forces deliberate choices |
| Self-registration over admin setup | Reduces facilitator burden, faster exercise start |
| Step-by-step wizard over scrollable form | Less cognitive overload, more interactive |

---

## Sprint 2 — Single-Container Scoring Engine

**Date:** 2026-05-05
**Status:** Complete

### Key Outcomes

- Replaced 3-container architecture (controller + UI + smith-runner) with a single container
- Built deterministic scoring engine that evaluates defenses against probe rules
- Removed all Kubernetes cluster dependencies — exercise runs standalone
- Added gamification: attack simulation sequence, achievements, animated leaderboard, countdown timer

### What was removed

- `smith-runner/` directory (all bash probes, runner.sh, Dockerfile)
- `controller/app/services/k8s.py` (Kubernetes client wrapper)
- `controller/app/services/templates.py` (Jinja2 template rendering)
- `controller/app/templates/` (all `.yaml.j2` files)
- `ui/Dockerfile` (nginx-based, replaced by static serving from controller)
- `ui/src/components/YamlPreview.tsx`
- Dependencies: `kubernetes`, `jinja2`

### What was added

- `controller/app/services/scoring.py` — rules engine
- `ui/src/components/AttackSimulation.tsx` — sequential probe reveal with Smith flavor text
- `ui/src/components/Achievements.tsx` — badge display (compact + full modes)
- `ui/src/components/Timer.tsx` — countdown timer with WebSocket sync
- Timer API endpoints: `POST/GET/DELETE /api/admin/timer`
- Single multi-stage Dockerfile at `build/Dockerfile` (Node build + Python runtime)

### Decisions

| Decision | Rationale |
|---|---|
| Rules engine over live probes | Probes are 100% deterministic; same results without cluster overhead |
| Client-side attack simulation | Backend returns all results at once; UI sequences the reveal for drama |
| Single Dockerfile | Eliminates nginx container, simplifies build/deploy pipeline |
| Achievement system | Gamification increases engagement in workshop setting |

---

## Sprint 1 — Foundation

**Date:** 2026-05-05
**Status:** Complete

### Key Outcomes

- FastAPI controller with routers (admin, teams, scores), K8s service layer, Jinja2 templates, scoring, WebSocket, in-memory state, 15 passing tests
- React UI with Login, HardenConfig, Scoreboard, Admin pages; WebSocket hook; dark Matrix theme
- Smith Runner with 9 bash probe scripts and parallel execution runner.sh
- Helm chart for OpenShift deployment (controller, UI, Smith Runner)
- Build/deploy/reset scripts; Makefile targets
