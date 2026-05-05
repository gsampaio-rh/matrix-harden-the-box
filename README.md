# Harden the Box — The Red Matrix

A gamified Kubernetes security workshop exercise. Teams configure pod defenses (NetworkPolicy, RBAC, SecurityContext) and get scored instantly by a deterministic rules engine. No live cluster required.

## Components

| Directory | What | Stack |
|---|---|---|
| `controller/` | Backend API + scoring engine | Python 3.11+, FastAPI, Pydantic |
| `ui/` | Frontend SPA | React 19, Vite 6, Tailwind 4, TypeScript |
| `build/` | Dockerfile (multi-stage) | Node + UBI9 Python |
| `chart/` | Helm chart (for cluster deployment) | Helm 3 |

## Quick Start

```bash
# Backend
make dev-controller

# Frontend (separate terminal)
make dev-ui

# Run tests
make test
```

Open http://localhost:5173 for the UI (Vite dev server proxies API calls to the controller on port 8080).

## Exercise Flow

1. **Join** — Teams open `/` and enter a team name — they're registered automatically
2. **Timer** — Facilitator opens `/admin` and starts a countdown (e.g. 15 minutes)
3. **Harden** — Teams go to `/harden`, toggle defenses, click Apply
4. **Attack Simulation** — Each team sees Agent Smith probe their defenses one by one
5. **Scoreboard** — `/scoreboard` shows live leaderboard with achievements and rankings
6. **Time's Up** — When the timer expires, submissions are locked

## Gamification

- **Attack simulation** — Probes reveal sequentially with Smith flavor text
- **Defense strength meter** — Real-time gauge updates as toggles are flipped
- **Achievements** — Network Guardian, RBAC Master, Lockdown, Perfect Score, First Blood
- **Leaderboard** — Rank change arrows, score animations, podium for top 3
- **Countdown timer** — Visible on all pages, creates urgency

## Docs

- [Architecture](docs/ARCHITECTURE.md) — system design and scoring rules
- [Plan](docs/PLAN.md) — upcoming sprints
- [Changelog](docs/CHANGELOG.md) — completed work
