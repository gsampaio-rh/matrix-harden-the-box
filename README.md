# Harden the Box — The Red Matrix

A gamified Kubernetes security workshop exercise. Teams answer scenario-based questions about pod hardening (NetworkPolicy, RBAC, SecurityContext) and get scored instantly by a deterministic rules engine. No live cluster required.

## Components

| Directory | What | Stack |
|---|---|---|
| `controller/` | Backend API + scoring engine | Python 3.11+, FastAPI, Pydantic |
| `controller/app/scenarios.yaml` | Scenario definitions (editable) | YAML |
| `ui/` | Frontend SPA | React 19, Vite 6, Tailwind 4, TypeScript |
| `build/` | Dockerfile (multi-stage) | Node + UBI9 Python |
| `chart/` | Helm chart (for cluster deployment) | Helm 3 |

## Quick Start

```bash
# Install dependencies (Python venv + npm)
make install

# Run backend + frontend in parallel
make dev

# Run tests
make test
```

Open http://localhost:5173 for the UI (Vite dev server proxies API calls to the controller on port 8080).

## Exercise Flow

1. **Join** — Teams open `/` and enter a team name — they're registered automatically
2. **Timer** — Facilitator opens `/admin` and starts a countdown (e.g. 15 minutes)
3. **Harden** — Teams go to `/harden` and work through 7 scenario-based security questions, one at a time
4. **Review & Submit** — Teams review all their answers on a summary screen, then submit (one shot — no retries)
5. **Attack Simulation** — Each team sees Agent Smith probe their defenses one by one
6. **Scoreboard** — `/scoreboard` shows live leaderboard with achievements and rankings
7. **Time's Up** — When the timer expires, submissions are locked

## Gamification

- **Attack simulation** — Probes reveal sequentially with Smith flavor text
- **Achievements** — Network Guardian, RBAC Master, Lockdown, Perfect Score, First Blood
- **Leaderboard** — Rank change arrows, score animations, podium for top 3
- **Countdown timer** — Visible on all pages, creates urgency
- **One-shot submission** — No retries, raising the stakes

## Customizing Scenarios

Edit `controller/app/scenarios.yaml` to add, remove, or modify questions. Each scenario has:
- `id`, `category`, `title`, `situation` (the question text)
- `options` with `label`, `hint` (optional), `points`, and `probes_blocked`
- `best` — the key of the optimal answer

Run `make test` after editing to validate the YAML structure.

## Docs

- [Architecture](docs/ARCHITECTURE.md) — system design and scoring rules
- [Plan](docs/PLAN.md) — upcoming sprints
- [Changelog](docs/CHANGELOG.md) — completed work
