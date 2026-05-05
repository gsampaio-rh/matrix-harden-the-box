#!/usr/bin/env python3
"""
Load test for Harden the Box on OpenShift.

Simulates N concurrent teams doing the full exercise flow:
register -> get scenarios -> submit answers -> get results + WebSocket.

Usage:
    python scripts/load-test.py                          # auto-detect route
    python scripts/load-test.py --url https://my-route   # explicit URL
    python scripts/load-test.py --teams 50               # custom team count

Requires: aiohttp, websockets (pip install aiohttp websockets)
"""

import argparse
import asyncio
import json
import random
import ssl
import subprocess
import sys
import time

try:
    import aiohttp
    import websockets
except ImportError:
    print("Missing dependencies. Install with: pip install aiohttp websockets")
    sys.exit(1)

SCENARIOS = [
    "net-egress", "net-ingress", "rbac-crb", "rbac-secrets",
    "sec-root", "sec-filesystem", "sec-capabilities",
]
OPTIONS = ["a", "b", "c", "d"]


def detect_route(namespace: str) -> str:
    try:
        result = subprocess.run(
            ["oc", "get", "route", "harden-the-box", "-n", namespace,
             "-o", "jsonpath={.spec.host}"],
            capture_output=True, text=True, check=True,
        )
        return f"https://{result.stdout.strip()}"
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Could not detect route via `oc`. Use --url to specify manually.")
        sys.exit(1)


def make_ssl_context() -> ssl.SSLContext:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx


class LoadTestResults:
    def __init__(self):
        self.timings: dict[str, list[float]] = {
            "register": [], "scenarios": [], "submit": [], "results": [],
            "ws": [],
        }
        self.errors: list[str] = []

    def record(self, key: str, duration: float):
        self.timings[key].append(duration)

    def error(self, msg: str):
        self.errors.append(msg)

    def stats(self, key: str) -> str:
        times = self.timings[key]
        if not times:
            return "N/A"
        s = sorted(times)
        avg = sum(s) / len(s)
        p95 = s[max(0, int(len(s) * 0.95) - 1)]
        mx = s[-1]
        return f"avg={avg*1000:.0f}ms  p95={p95*1000:.0f}ms  max={mx*1000:.0f}ms  n={len(times)}"


async def run_team(session: aiohttp.ClientSession, base: str, team_id: str, results: LoadTestResults):
    try:
        t0 = time.monotonic()
        async with session.post(f"{base}/api/teams/register", json={"team_id": team_id}) as r:
            assert r.status == 200, f"register HTTP {r.status}"
            await r.json()
        results.record("register", time.monotonic() - t0)

        t0 = time.monotonic()
        async with session.get(f"{base}/api/scenarios") as r:
            assert r.status == 200, f"scenarios HTTP {r.status}"
            await r.json()
        results.record("scenarios", time.monotonic() - t0)

        await asyncio.sleep(random.uniform(0.1, 0.5))

        answers = [
            {"scenarioId": sid, "selectedOption": random.choice(OPTIONS)}
            for sid in SCENARIOS
        ]
        t0 = time.monotonic()
        async with session.post(f"{base}/api/teams/{team_id}/submit", json={"answers": answers}) as r:
            assert r.status == 200, f"submit HTTP {r.status}"
            await r.json()
        results.record("submit", time.monotonic() - t0)

        t0 = time.monotonic()
        async with session.get(f"{base}/api/teams/{team_id}/results") as r:
            assert r.status == 200, f"results HTTP {r.status}"
            await r.json()
        results.record("results", time.monotonic() - t0)

    except Exception as e:
        results.error(f"{team_id}: {e}")


async def ws_listener(route_host: str, team_id: str, ssl_ctx: ssl.SSLContext,
                      results: LoadTestResults, duration: float = 8.0):
    ws_url = f"wss://{route_host}/ws/scoreboard"
    try:
        t0 = time.monotonic()
        async with websockets.connect(ws_url, ssl=ssl_ctx, open_timeout=5) as ws:
            end = time.monotonic() + duration
            while time.monotonic() < end:
                try:
                    await asyncio.wait_for(ws.recv(), timeout=1)
                except asyncio.TimeoutError:
                    pass
        results.record("ws", time.monotonic() - t0)
    except Exception as e:
        results.error(f"ws-{team_id}: {e}")


async def main():
    parser = argparse.ArgumentParser(description="Load test Harden the Box")
    parser.add_argument("--url", help="Base URL (auto-detected from oc route if omitted)")
    parser.add_argument("--namespace", default="workshop-content", help="OpenShift namespace")
    parser.add_argument("--teams", type=int, default=20, help="Number of concurrent teams")
    parser.add_argument("--no-reset", action="store_true", help="Skip resetting state before test")
    args = parser.parse_args()

    base = args.url or detect_route(args.namespace)
    base = base.rstrip("/")
    route_host = base.replace("https://", "").replace("http://", "")
    ssl_ctx = make_ssl_context()
    results = LoadTestResults()

    print(f"Target:  {base}")
    print(f"Teams:   {args.teams}")

    if not args.no_reset:
        async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=ssl_ctx)) as s:
            async with s.post(f"{base}/api/admin/reset") as r:
                print(f"Reset:   HTTP {r.status}")

    print(f"\nRunning load test...")
    t_start = time.monotonic()

    conn = aiohttp.TCPConnector(ssl=ssl_ctx, limit=args.teams * 3)
    async with aiohttp.ClientSession(connector=conn) as session:
        tasks = []
        for i in range(args.teams):
            tid = f"loadtest-{i+1:02d}"
            tasks.append(run_team(session, base, tid, results))
            tasks.append(ws_listener(route_host, tid, ssl_ctx, results))
        await asyncio.gather(*tasks)

    elapsed = time.monotonic() - t_start

    print(f"\n{'='*50}")
    print(f"  Load Test Results ({args.teams} teams)")
    print(f"{'='*50}")
    print(f"  Total time:  {elapsed:.1f}s")
    print(f"  Register:    {results.stats('register')}")
    print(f"  Scenarios:   {results.stats('scenarios')}")
    print(f"  Submit:      {results.stats('submit')}")
    print(f"  Results:     {results.stats('results')}")
    print(f"  WebSocket:   {results.stats('ws')}")
    print(f"  Errors:      {len(results.errors)}")
    if results.errors:
        for e in results.errors[:10]:
            print(f"    - {e}")
    print(f"{'='*50}")

    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=ssl_ctx)) as s:
        async with s.get(f"{base}/api/scores") as r:
            data = await r.json()
            scored = [t for t in data["teams"] if t["score"] > 0]
            print(f"\n  Leaderboard: {len(data['teams'])} teams, {len(scored)} with scores")

    if results.errors:
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
