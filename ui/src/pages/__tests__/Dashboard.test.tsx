import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../Dashboard";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../api", () => ({
  api: {
    getTeamStatus: vi.fn(),
  },
}));

import { api } from "../../api";

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Dashboard />
    </MemoryRouter>,
  );
}

describe("Dashboard", () => {
  it("redirects to /login without teamId", () => {
    renderDashboard();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders chapter cards when teamId is set", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      team: "team-01",
      chapters: {
        contain: { submitted: false, score: 0, achievements: [] },
        configure: { submitted: false, score: 0, achievements: [] },
      },
    });
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText("Harden the Box")).toBeInTheDocument();
    });
    expect(screen.getByText("Build Your Playbook")).toBeInTheDocument();
  });

  it("shows Start Exercise for unsubmitted chapters", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      team: "team-01",
      chapters: {
        contain: { submitted: false, score: 0, achievements: [] },
        configure: { submitted: false, score: 0, achievements: [] },
      },
    });
    renderDashboard();
    await waitFor(() => {
      const buttons = screen.getAllByText("Start Exercise");
      expect(buttons.length).toBe(2);
    });
  });

  it("shows View Results for submitted chapters", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      team: "team-01",
      chapters: {
        contain: { submitted: true, score: 100, achievements: [] },
        configure: { submitted: false, score: 0, achievements: [] },
      },
    });
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText("View Results")).toBeInTheDocument();
      expect(screen.getByText("Start Exercise")).toBeInTheDocument();
    });
  });

  it("shows Coming Soon placeholder", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      team: "team-01",
      chapters: {
        contain: { submitted: false, score: 0, achievements: [] },
        configure: { submitted: false, score: 0, achievements: [] },
      },
    });
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    });
  });

  it("displays the team name", () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      team: "team-01",
      chapters: {},
    });
    renderDashboard();
    expect(screen.getByText("team-01")).toBeInTheDocument();
  });
});
