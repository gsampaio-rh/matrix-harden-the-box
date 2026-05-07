# Changelog: Harden the Box

## Harness Content Redesign + Security Hardening

**Date:** 2026-05-07
**Status:** Complete

Complete redesign of the Harness slide deck narrative flow, new entropy slide, and four security/correctness fixes.

### Harness Slide Deck Redesign

Reordered all slides to follow a pedagogical arc: context → decomposition → knowledge → autonomy → circuit breakers → recovery → entropy → evaluation → configuration. Deleted 2 slides that no longer fit the narrative ("Brain vs Hands", "Infrastructure as Code — for Agents"). Added 1 new slide.

| # | Title | Concept |
|---|---|---|
| 1 | Context Strategy: The Memory Problem | Finite context, anxiety, resets vs compaction |
| 2 | Work Decomposition: Planning vs Doing | One-shotting vs planner cascade failures |
| 3 | Knowledge Architecture: Context is Zero-Sum | Instructions compete with task for tokens |
| 4.1 | Autonomy Boundaries: Blast Radius | Reads safe, writes risky; enforce centrally |
| 4.2 | Circuit Breakers | Max turns, timeouts, env scrub |
| 5 | Recovery & Resilience: Corrections are Cheap | Git checkpoints, correction > prevention |
| 5.1 | Entropy: The Agent Assembly Line | Generator → evaluator → GC; sawtooth debt |
| 6.1 | Self-Evaluation is Broken | 92% self-grade vs 64% actual |
| 6.2 | Evaluation Strategy: Who Watches the Watchmen? | GAN-inspired evaluator pattern |
| 7.1 | Configuration = Behavior | Config = agent identity |
| 7.2 | Map, Not Encyclopedia | 5 principles > 500 rules |
| 7.3 | Anatomy of a Harness | Four trust layers |

### New Slide: Entropy — The Agent Assembly Line

- Explains the multi-agent pipeline: generator writes → evaluator reviews → GC cleans
- Visualizes entropy accumulation as sawtooth graph (debt rises, cleanup drops it, baseline drifts up)
- Bridges Recovery into Evaluation slides narratively
- New SVG illustration: `ui/src/components/illustrations/HarnessEntropy.tsx`

### Security & Correctness Fixes

| Fix | Impact |
|---|---|
| **Admin auth secure-by-default** | `require_admin` now denies access when `HTB_ADMIN_KEY` is unset (was silently open) |
| **Public timer endpoint** | New `GET /api/teams/timer` — team pages no longer hit admin-protected endpoint |
| **Persist atomicity** | Removed premature `persist()` from `record_first_submission()` — state only writes after full submission is complete |
| **ProgressBar bounds check** | `labels[current]` guarded against out-of-bounds access |

### Files Added

- `ui/src/components/illustrations/HarnessEntropy.tsx` — agent assembly line + sawtooth entropy SVG

### Files Changed

- `ui/src/pages/HarnessDemo.tsx` — reordered to 12 slides, removed 2, added Entropy
- `ui/src/pages/__tests__/HarnessDemo.test.tsx` — updated for 12-slide structure
- `ui/src/components/ProgressBar.tsx` — bounds check on labels array
- `ui/src/api.ts` — `getTimer` uses public endpoint
- `controller/app/dependencies.py` — deny when no admin key configured
- `controller/app/routers/teams.py` — added `GET /timer` public endpoint
- `controller/app/state.py` — removed early persist from `record_first_submission`
- `controller/tests/test_api.py` — tests now set admin key and send header

### Test Results

- 112 backend tests passing (pytest)
- 85 frontend tests passing (vitest)

---

## Code Review Refactoring — Security, Architecture & Code Quality

**Date:** 2026-05-07
**Status:** Complete

Deep code review identified 17 findings across security, architecture, persistence, correctness, and code quality. All addressed in a single pass across 24 files (402 lines added, 416 removed).

### Security (Phase 1)

- **Admin authentication**: new `HTB_ADMIN_KEY` env var + `X-Admin-Key` header guard on all `/api/admin/*` endpoints via `require_admin` dependency
- **CORS lockdown**: removed wildcard `*` + `allow_credentials=True` — CORS middleware now conditional on `HTB_CORS_ORIGINS` (comma-separated)
- **SPA catch-all guard**: `/api/*` and `/ws/*` paths now return 404 instead of silently serving `index.html`
- **Server-side timer enforcement**: contain and configure submit endpoints reject with 403 after timer expires

### Architecture (Phase 2)

- **Typed domain models**: `TeamState`, `ContainChapterState`, `ConfigureChapterState` Pydantic models replace untyped `dict` state
- **State module refactored**: attribute access (`ch.submitted`) replaces dict access (`ch["submitted"]`), type hints on all public functions
- **Persistence simplified**: `model_dump()` / `model_validate()` replaces hand-rolled `_serialize_teams` / `_deserialize_teams` (44 lines removed)
- **Circular import broken**: `set_persist_fn()` / `persist()` injection pattern replaces `from app.persistence import save_snapshot` inside `state.py`

### Persistence (Phase 3)

- **Batch persistence**: removed per-setter `_persist()` calls from 10 individual state mutators — routers call `state.persist()` once after all mutations complete

### Correctness (Phase 4)

- **Legacy fields removed**: dropped top-level `submitted` / `achievements` from team status and admin list responses — chapter-specific breakdown is the single source of truth
- **Probe max cached**: `_compute_max_points_per_probe()` result cached at module level (`_PROBE_MAX`) — avoids recomputation on every score response
- **Timer interval conditional**: `setInterval` for timer expiry check now only created when a timer is active (was running unconditionally on every page load)

### Code Quality (Phase 5)

- **Shared constants**: `SCENARIO_ILLUSTRATION` and `CATEGORY_COLORS` extracted to `ui/src/constants/scenarios.ts`
- **Shared ProgressBar**: unified component in `ui/src/components/ProgressBar.tsx` replaces 2 local implementations
- **Chapter summary builder**: `state.build_chapter_summary()` replaces duplicated dict construction in admin and teams routers
- **Models centralized**: `ConfigureLimits` and `ConfigureSubmission` moved from router to `models.py`
- **API types**: explicit return type annotations on all `api.ts` functions
- **Achievement ID**: renamed `first_submission` → `first_blood` for consistency across chapters
- **Test fixtures**: all test files mock persistence with `state.set_persist_fn(lambda: None)`
- **Admin UI**: added admin key input flow with `sessionStorage` persistence

### Files Added

- `controller/app/dependencies.py` — `require_admin` FastAPI dependency
- `ui/src/components/ProgressBar.tsx` — shared progress bar component
- `ui/src/constants/scenarios.ts` — shared scenario/category constants

### Test Results

- 117 backend tests passing (pytest)
- 86 frontend tests passing (vitest)

---

## Session Persistence — Tab Close + Pod Restart

**Date:** 2026-05-07
**Status:** Complete

### Key Outcomes

- Team sessions now survive tab close: switched `sessionStorage` → `localStorage` across all 12 frontend files
- Team data now survives pod restarts: atomic JSON snapshots to PVC-backed `/app/data/state.json`
- Graceful degradation: if no PVC is mounted, continues in-memory with a logged warning
- 117 backend tests (11 new for persistence), 86 frontend tests — all passing
- Added admin auth backlog item to PLAN.md

### What changed

- **Frontend** (7 pages + 5 test files): `sessionStorage` → `localStorage` — team identity persists across tabs and browser closes
- **Backend**: new `controller/app/persistence.py` — `save_snapshot()` writes atomically (`.tmp` → `rename`), `load_snapshot()` restores on startup
- **Backend**: `controller/app/state.py` — every mutation calls `_persist()`, new `restore_from_snapshot()` for startup
- **Backend**: `controller/app/main.py` — lifespan loads snapshot if available
- **Helm**: new `chart/templates/controller-pvc.yaml` (100Mi PVC, conditional on `persistence.enabled`)
- **Helm**: `controller-deployment.yaml` — volumeMount `/app/data` + `HTB_DATA_DIR` env var
- **Helm**: `values.yaml` — `persistence.enabled: true`, `persistence.size: 100Mi`

---

## Harness Slide Deck — Visual Polish + Anatomy Slide

**Date:** 2026-05-06
**Status:** Complete

### Key Outcomes

- Added 7th slide "Anatomy of a Harness" — explains the four layers (CLAUDE.md, skills, hooks, NOT AI) and WHY they're separated (different trust models)
- Redesigned all 6 SVG illustrations for better readability: larger viewBox, bigger fonts, more spacing, no element overlap
- "Map, Not Encyclopedia" now shows real CLAUDE.md content (good vs bad) with interactive click-to-expand
- "Brain vs Hands" wider gap between boxes, longer arrows, breathing room for "tool calls" label
- "Self-Evaluation is Broken" text updated with concrete example and Anthropic research data (92% self-grade vs 64% actual)
- "Infrastructure as Code" three-column redesign with stronger red/green contrast
- HarnessConfig spacing/sizing fixes for CLAUDE.md box entries
- Updated tests for 7 slides — 86 frontend tests passing

### Slides (updated)

| Step | Title | Concept |
|------|-------|---------|
| 1 | Configuration = Behavior | Config files control the agent; whoever writes the config controls the agent |
| 2 | Infrastructure as Code — for Agents | K8s IaC parallel: treat agent config with the same rigor as cluster YAML |
| 3 | Anatomy of a Harness | Four layers with different trust models: advisory → on-demand → enforced → no LLM |
| 4 | Map, Not Encyclopedia | Real good/bad examples with click-to-expand; 5 clear rules beat 500 vague suggestions |
| 5 | Brain vs Hands | LLM reasoning is separate from tools; each tool is an attack surface |
| 6 | Circuit Breakers | Max turns, timeouts, env scrub prevent runaway behavior |
| 7 | Self-Evaluation is Broken | Agents self-grade 92% success vs 64% actual; need external verification |

---

## Harness Engineering Slide Deck + Deploy Fix

**Date:** 2026-05-06
**Status:** Complete

### Key Outcomes

- Built standalone `/harness` route with 6 click-through slides explaining harness engineering principles
- Mirrors the existing `/kata` pattern: `STEPS` array, keyboard navigation (arrow keys), step dots, Back/Next
- Visual accent uses `--chapter-configure` (indigo) to align with Chapter 2 branding
- Last slide CTA links to `/configure/exercise` ("Start the Exercise")
- 86 frontend tests passing (up from 74) — 12 new tests for HarnessDemo
- Fixed deploy script bug: empty `BUILD_NAME` guard prevents misleading error messages

### What was added

- `ui/src/pages/HarnessDemo.tsx` — 7-step slide deck with keyboard support and fade transitions
- `ui/src/components/illustrations/HarnessConfig.tsx` — config-to-agent flow diagram
- `ui/src/components/illustrations/HarnessRepo.tsx` — context window with visible/invisible files
- `ui/src/components/illustrations/HarnessMap.tsx` — concise map vs bloated encyclopedia
- `ui/src/components/illustrations/HarnessBrain.tsx` — brain/hands separation with attack surface markers
- `ui/src/components/illustrations/HarnessBreakers.tsx` — circuit breaker panel (3 switches)
- `ui/src/components/illustrations/HarnessEval.tsx` — self-evaluation vs external verification
- `ui/src/pages/__tests__/HarnessDemo.test.tsx` — 12 tests (rendering, navigation, keyboard, dots, CTA)

### What was changed

- `ui/src/App.tsx` — added `/harness` route and "Harness" nav link
- `scripts/deploy.sh` — added empty `BUILD_NAME` guard before querying build status

---

## Architecture Quality Pass

**Date:** 2026-05-06
**Status:** Complete

Fixed 3 bugs, closed 6 consistency gaps, hardened the API, improved accessibility, and added test coverage across the multi-chapter platform.

### Key Outcomes

- **105 backend tests** (up from 93) and **74 frontend tests** (up from 48) — all passing
- Zero TypeScript errors, zero lint warnings introduced
- All API responses now use consistent `team` field (was mixed `team`/`team_id`)
- Team ID normalization applied across all 6 path-param handlers — case-insensitive matching
- Typed Pydantic model for configure limits replaces raw `dict` — malformed payloads return 422
- ARIA roles and keyboard support added to all interactive components

### Bugs Fixed (P0)

- `ConfigureExercise.tsx`: `setSubmitting(false)` now called on success path (was stuck in submitting state)
- Null limits no longer silently coerced to most-permissive defaults (`max_turns: 100`, `bash_timeout: 120000`) — nulls flow through and score 0
- Dead keyword `contradict.*stop` removed from anti-override list (substring matching, not regex — would never match)
- Replay infinite loop vector check now enforces `10 <= max_turns <= 30` (was missing lower bound — `max_turns: 5` incorrectly counted as blocked)

### Consistency Gaps Closed (P1)

- Team ID normalized (`.strip().lower()`) in contain, configure, teams, and scores routers
- Response field standardized to `team` in register, admin list, and WebSocket broadcast
- `GET /api/scores/{team_id}` returns 404 for unregistered teams (was 200 with "No scores yet")
- `CONFIGURE_MAX_SCORE` imported from `configure_scoring.MAX_SCORE` (was duplicated)
- Timer check added to `ConfigureExercise.tsx` (matches `HardenConfig.tsx` pattern)
- `ws.disconnect()` wrapped in try/except for double-disconnect safety
- Achievement ordering stabilized with `dict.fromkeys()` (was `set()` — arbitrary order)

### Hardening (P2)

- `ConfigureLimits` Pydantic model enforces typed limits (`int | None`, `bool`)
- Silent `.catch(() => {})` replaced with `console.error` or user-visible error states
- ARIA: `tablist`/`tab`/`tabpanel` on CrimeScene and SkillEditor, `role="switch"` + `aria-checked` on toggle, `role="button"` + `aria-expanded` + keyboard handler on Scoreboard rows, `htmlFor`/`id` on ConstitutionEditor labels, `tabIndex`/`onFocus`/`onBlur` on annotations

### Tests Added (P3)

- **Backend (12 new):** team ID normalization (4), unknown team 404 on scores, first_submission exclusivity, partial config intermediate score, malformed body 422 (3), ws disconnect safety, max_turns lower bound
- **Frontend (26 new):** Dashboard (6), ConfigureExercise (7), ConfigureResults (7), Scoreboard (6)

---

## Roadmap Update — All Sprints Complete, Board Cleared

**Date:** 2026-05-06

Moved **Polish & Workshop Integration** (Sprint 5.2) to **Future Explorations** in PLAN.md. No active sprints remain — all delivered features are documented below.

---

## Roadmap Update — Descoped Sprints 5.2/5.3

**Date:** 2026-05-05

Descoped **Victim Pod Deployment** (Sprint 5.2) and **LLM Attack Agent** (Sprint 5.3) from the active roadmap. The cluster integration and LLM agent overhead isn't justified for the current workshop scope — the deterministic scoring engine and client-side simulation already deliver the exercise goals. Both ideas moved to **Future Explorations** in PLAN.md for potential post-workshop revisit. Sprint 6 (Polish & Workshop Integration) renumbered to Sprint 5.2 as the next active sprint.

---

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
