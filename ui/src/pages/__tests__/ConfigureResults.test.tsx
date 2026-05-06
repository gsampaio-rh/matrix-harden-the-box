import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ConfigureResults from "../ConfigureResults";

const MOCK_RESULTS = {
  team: "team-01",
  score: 20,
  max_score: 25,
  achievements: ["constitutional_author", "circuit_breaker"],
  breakdown: {
    constitution: { score: 8, max_score: 10 },
    skills: { score: 5, max_score: 6 },
    circuit_breakers: { score: 3, max_score: 3 },
    replay: {
      score: 4,
      max_score: 6,
      vectors: [
        { id: "v1", name: "Secret Exfiltration", blocked: true, reason: "Prohibited list blocks it" },
        { id: "v2", name: "Bind Shell", blocked: true, reason: "Network rules block it" },
        { id: "v3", name: "Data Exfiltration", blocked: true, reason: "External HTTP blocked" },
        { id: "v4", name: "Instruction Override", blocked: true, reason: "Anti-override clause" },
        { id: "v5", name: "Infinite Loop", blocked: false, reason: "Max turns not set" },
        { id: "v6", name: "Credential Leakage", blocked: false, reason: "Env scrub disabled" },
      ],
    },
  },
  vectors: [
    { id: "v1", name: "Secret Exfiltration", blocked: true, reason: "Prohibited list blocks it" },
    { id: "v2", name: "Bind Shell", blocked: true, reason: "Network rules block it" },
    { id: "v3", name: "Data Exfiltration", blocked: true, reason: "External HTTP blocked" },
    { id: "v4", name: "Instruction Override", blocked: true, reason: "Anti-override clause" },
    { id: "v5", name: "Infinite Loop", blocked: false, reason: "Max turns not set" },
    { id: "v6", name: "Credential Leakage", blocked: false, reason: "Env scrub disabled" },
  ],
};

const MOCK_CONTENT = {
  reference_claude_md: "# Reference CLAUDE.md\nYou are a safe agent.",
  malicious_claude_md: "",
  malicious_skill: "",
  malicious_claude_md_annotations: [],
  malicious_skill_annotations: [],
};

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../api", () => ({
  api: {
    getConfigureResults: vi.fn(),
    getConfigureContent: vi.fn(),
  },
}));

import { api } from "../../api";

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
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
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureResults).mockRejectedValue(new Error("404"));
    vi.mocked(api.getConfigureContent).mockRejectedValue(new Error("404"));
    renderConfigureResults();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/configure/exercise");
    });
  });

  it("renders score header", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureResults).mockResolvedValue(MOCK_RESULTS);
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    renderConfigureResults();
    await waitFor(() => {
      expect(screen.getByText("20")).toBeInTheDocument();
    });
    expect(screen.getByText("/25")).toBeInTheDocument();
  });

  it("renders section score cards", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureResults).mockResolvedValue(MOCK_RESULTS);
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    renderConfigureResults();
    await waitFor(() => {
      expect(screen.getByText("Constitution")).toBeInTheDocument();
    });
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Circuit Breakers")).toBeInTheDocument();
    expect(screen.getByText("Replay Test")).toBeInTheDocument();
  });

  it("renders attack vectors with blocked/passed status", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureResults).mockResolvedValue(MOCK_RESULTS);
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    renderConfigureResults();
    await waitFor(() => {
      expect(screen.getByText("Secret Exfiltration")).toBeInTheDocument();
    });
    expect(screen.getByText("Infinite Loop")).toBeInTheDocument();
    const blocked = screen.getAllByText("BLOCKED");
    const passed = screen.getAllByText("PASSED");
    expect(blocked.length).toBe(4);
    expect(passed.length).toBe(2);
  });

  it("renders key insight callout", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureResults).mockResolvedValue(MOCK_RESULTS);
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    renderConfigureResults();
    await waitFor(() => {
      expect(screen.getByText(/Configuration defines/)).toBeInTheDocument();
    });
  });

  it("renders reference CLAUDE.md", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureResults).mockResolvedValue(MOCK_RESULTS);
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    renderConfigureResults();
    await waitFor(() => {
      expect(screen.getByText(/Reference: Defensive CLAUDE.md/)).toBeInTheDocument();
    });
  });
});
