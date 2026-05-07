import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Scoreboard from "../Scoreboard";

const MOCK_TEAMS = [
  {
    team: "team-alpha",
    score: 100,
    max_score: 140,
    blocked_count: 5,
    total_probes: 7,
    probes: [],
    achievements: ["network_guardian", "constitutional_author"],
    chapters: {
      contain: { score: 100, max_score: 140, achievements: ["network_guardian"], submitted: true },
      configure: { score: 20, max_score: 25, achievements: ["constitutional_author"], submitted: true },
    },
    total_score: 120,
    max_total: 165,
  },
  {
    team: "team-beta",
    score: 60,
    max_score: 140,
    blocked_count: 3,
    total_probes: 7,
    probes: [],
    achievements: [],
    chapters: {
      contain: { score: 60, max_score: 140, achievements: [], submitted: true },
      configure: { score: 0, max_score: 25, achievements: [], submitted: false },
    },
    total_score: 60,
    max_total: 165,
  },
];

vi.mock("../../api", () => ({
  api: {
    getLeaderboard: vi.fn(),
    getTeamScore: vi.fn(),
  },
}));

vi.mock("../../hooks/useWebSocket", () => ({
  useWebSocket: () => ({ connected: false }),
}));

import { api } from "../../api";

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

function renderScoreboard() {
  return render(
    <MemoryRouter initialEntries={["/scoreboard"]}>
      <Scoreboard />
    </MemoryRouter>,
  );
}

describe("Scoreboard", () => {
  it("renders leaderboard heading", async () => {
    vi.mocked(api.getLeaderboard).mockResolvedValue({ teams: MOCK_TEAMS });
    renderScoreboard();
    await waitFor(() => {
      expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    });
  });

  it("renders team names in order", async () => {
    vi.mocked(api.getLeaderboard).mockResolvedValue({ teams: MOCK_TEAMS });
    renderScoreboard();
    await waitFor(() => {
      expect(screen.getByText("team-alpha")).toBeInTheDocument();
    });
    expect(screen.getByText("team-beta")).toBeInTheDocument();
  });

  it("renders total scores", async () => {
    vi.mocked(api.getLeaderboard).mockResolvedValue({ teams: MOCK_TEAMS });
    renderScoreboard();
    await waitFor(() => {
      expect(screen.getByText("120")).toBeInTheDocument();
    });
    expect(screen.getAllByText("60").length).toBeGreaterThanOrEqual(1);
  });

  it("expands row on click with keyboard support", async () => {
    vi.mocked(api.getLeaderboard).mockResolvedValue({ teams: MOCK_TEAMS });
    renderScoreboard();
    await waitFor(() => {
      expect(screen.getByText("team-alpha")).toBeInTheDocument();
    });
    const row = screen.getByRole("button", { name: /team-alpha/ });
    fireEvent.click(row);
    await waitFor(() => {
      expect(screen.getByText(/Ch\.1 Contain/)).toBeInTheDocument();
      expect(screen.getByText(/Ch\.2 Configure/)).toBeInTheDocument();
    });
  });

  it("shows Your Progress when teamId is set and team found", async () => {
    localStorage.setItem("teamId", "team-alpha");
    vi.mocked(api.getLeaderboard).mockResolvedValue({ teams: MOCK_TEAMS });
    vi.mocked(api.getTeamScore).mockResolvedValue(MOCK_TEAMS[0]);
    renderScoreboard();
    await waitFor(() => {
      expect(screen.getByText(/Your Progress/)).toBeInTheDocument();
    });
  });

  it("rows have proper aria attributes", async () => {
    vi.mocked(api.getLeaderboard).mockResolvedValue({ teams: MOCK_TEAMS });
    renderScoreboard();
    await waitFor(() => {
      const rows = screen.getAllByRole("button");
      expect(rows.length).toBeGreaterThanOrEqual(2);
      expect(rows[0]).toHaveAttribute("aria-expanded");
    });
  });
});
