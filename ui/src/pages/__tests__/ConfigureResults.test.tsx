import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ConfigureResults from "../ConfigureResults";

const MOCK_RESULTS = {
  team: "team-01",
  score: 24,
  max_score: 30,
  achievements: ["systems_thinker", "tradeoff_aware", "complete_architect"],
  breakdown: {
    score: 24,
    max_score: 30,
    awareness: { score: 10, max_score: 12, breakdown: {} },
    coherence: {
      score: 8,
      max_score: 10,
      reinforcements: 3,
      contradictions: 0,
      reinforcement_details: [{ pair: ["context_strategy:B", "knowledge_architecture:B"] }],
      contradiction_details: [],
    },
    philosophy: { score: 4, max_score: 5, breakdown: {} },
    completeness: { score: 3, max_score: 3, all_dimensions_answered: true, all_justified: true },
  },
};

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../api", () => ({
  api: {
    getConfigureResults: vi.fn(),
  },
}));

import { api } from "../../api";

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

function renderConfigureResults() {
  return render(
    <MemoryRouter initialEntries={["/configure/results"]}>
      <ConfigureResults />
    </MemoryRouter>,
  );
}

describe("ConfigureResults", () => {
  it("redirects to /login without teamId", () => {
    renderConfigureResults();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("redirects to /configure/exercise on API error", async () => {
    localStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureResults).mockRejectedValue(new Error("404"));
    renderConfigureResults();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/configure/exercise");
    });
  });

  it("renders score header", async () => {
    localStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureResults).mockResolvedValue(MOCK_RESULTS);
    renderConfigureResults();
    await waitFor(() => {
      expect(screen.getByText("24")).toBeInTheDocument();
    });
    expect(screen.getByText("/30")).toBeInTheDocument();
  });

  it("renders section score cards", async () => {
    localStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureResults).mockResolvedValue(MOCK_RESULTS);
    renderConfigureResults();
    await waitFor(() => {
      expect(screen.getByText("Awareness")).toBeInTheDocument();
    });
    expect(screen.getByText("Coherence")).toBeInTheDocument();
    expect(screen.getByText("Philosophy")).toBeInTheDocument();
    expect(screen.getByText("Completeness")).toBeInTheDocument();
  });

  it("renders coherence analysis with reinforcements", async () => {
    localStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureResults).mockResolvedValue(MOCK_RESULTS);
    renderConfigureResults();
    await waitFor(() => {
      expect(screen.getByText(/3 reinforcing pairs found/)).toBeInTheDocument();
    });
  });

  it("renders key insight callout", async () => {
    localStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureResults).mockResolvedValue(MOCK_RESULTS);
    renderConfigureResults();
    await waitFor(() => {
      expect(screen.getByText(/Harness design is about allocating/)).toBeInTheDocument();
    });
  });
});
