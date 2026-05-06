import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Results from "../Results";

const MOCK_RESULTS = {
  team: "test-team",
  score: 100,
  max_score: 140,
  achievements: ["network_guardian"],
  scenarios: [
    {
      id: "net-egress",
      category: "Network",
      title: "Outbound Traffic Control",
      selected_option: "c",
      selected_label: "Deny all egress, then add allow rules for UDP/53 and TCP/8080",
      best_option: "c",
      best_label: "Deny all egress, then add allow rules for UDP/53 and TCP/8080",
      points_earned: 20,
      max_points: 20,
      is_best: true,
      explanation: "The principle of least privilege applies to network access.",
    },
    {
      id: "sec-root",
      category: "SecurityContext",
      title: "Container User Privileges",
      selected_option: "a",
      selected_label: "Keep running as root",
      best_option: "b",
      best_label: "Set runAsNonRoot: true and change to port 8080",
      points_earned: 0,
      max_points: 20,
      is_best: false,
      explanation: "Running as root gives an attacker UID 0.",
    },
  ],
};

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../api", () => ({
  api: {
    getTeamResults: vi.fn(),
  },
}));

import { api } from "../../api";

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

function renderResults() {
  return render(
    <MemoryRouter initialEntries={["/results"]}>
      <Results />
    </MemoryRouter>,
  );
}

describe("Results page", () => {
  it("redirects to / if no teamId in session", () => {
    renderResults();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("redirects to /contain/exercise if API returns error (not submitted)", async () => {
    sessionStorage.setItem("teamId", "test-team");
    vi.mocked(api.getTeamResults).mockRejectedValue(new Error("404"));
    renderResults();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/contain/exercise");
    });
  });

  it("renders scenario breakdown after loading", async () => {
    sessionStorage.setItem("teamId", "test-team");
    vi.mocked(api.getTeamResults).mockResolvedValue(MOCK_RESULTS);
    renderResults();
    await waitFor(() => {
      expect(screen.getByText("Outbound Traffic Control")).toBeInTheDocument();
    });
    expect(screen.getByText("Container User Privileges")).toBeInTheDocument();
  });

  it("shows score header", async () => {
    sessionStorage.setItem("teamId", "test-team");
    vi.mocked(api.getTeamResults).mockResolvedValue(MOCK_RESULTS);
    renderResults();
    await waitFor(() => {
      expect(screen.getByText("100")).toBeInTheDocument();
    });
    expect(screen.getByText("/140")).toBeInTheDocument();
  });

  it("marks correct answers as BEST", async () => {
    sessionStorage.setItem("teamId", "test-team");
    vi.mocked(api.getTeamResults).mockResolvedValue(MOCK_RESULTS);
    renderResults();
    await waitFor(() => {
      expect(screen.getByText("BEST")).toBeInTheDocument();
    });
  });

  it("shows best answer panel for incorrect selections", async () => {
    sessionStorage.setItem("teamId", "test-team");
    vi.mocked(api.getTeamResults).mockResolvedValue(MOCK_RESULTS);
    renderResults();
    await waitFor(() => {
      expect(screen.getByText(/Best Answer \(B\)/)).toBeInTheDocument();
    });
    expect(
      screen.getByText("Set runAsNonRoot: true and change to port 8080"),
    ).toBeInTheDocument();
  });

  it("renders explanations for each scenario", async () => {
    sessionStorage.setItem("teamId", "test-team");
    vi.mocked(api.getTeamResults).mockResolvedValue(MOCK_RESULTS);
    renderResults();
    await waitFor(() => {
      expect(
        screen.getByText(/The principle of least privilege applies/),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Running as root gives an attacker UID 0/),
    ).toBeInTheDocument();
  });

  it("renders scenario illustrations", async () => {
    sessionStorage.setItem("teamId", "test-team");
    vi.mocked(api.getTeamResults).mockResolvedValue(MOCK_RESULTS);
    const { container } = renderResults();
    await waitFor(() => {
      expect(screen.getByText("Outbound Traffic Control")).toBeInTheDocument();
    });
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(2);
  });

  it("renders achievements", async () => {
    sessionStorage.setItem("teamId", "test-team");
    vi.mocked(api.getTeamResults).mockResolvedValue(MOCK_RESULTS);
    renderResults();
    await waitFor(() => {
      expect(screen.getByText("Network Guardian")).toBeInTheDocument();
    });
  });
});
