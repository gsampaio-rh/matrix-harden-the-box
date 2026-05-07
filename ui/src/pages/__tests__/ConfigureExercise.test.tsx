import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ConfigureExercise from "../ConfigureExercise";

const MOCK_CONTENT = {
  briefing: {
    title: "The Long-Running Agent Challenge",
    scenario: "You are the harness architect for an SRE agent.",
    challenges: [
      { text: "Agents lose coherence", source: "Anthropic" },
    ],
    prompt: "For each dimension, choose a position.",
  },
  dimensions: [
    {
      id: "context_strategy",
      title: "Context Strategy",
      question: "How does the agent carry state?",
      source: "Anthropic",
      options: [
        { id: "A", label: "Compaction", description: "Summarize inline", pros: "Continuity", cons: "Anxiety" },
        { id: "B", label: "Reset", description: "Fresh slate", pros: "Clean", cons: "Overhead" },
        { id: "C", label: "Repo", description: "Files", pros: "Durable", cons: "Token cost" },
        { id: "D", label: "Hybrid", description: "Both", pros: "Balanced", cons: "Complex" },
      ],
      tradeoff_summary: "Continuity vs clean slate.",
    },
    {
      id: "work_decomposition",
      title: "Work Decomposition",
      question: "How granular?",
      source: "Anthropic",
      options: [
        { id: "A", label: "Sprint", description: "Planned", pros: "Focus", cons: "Overhead" },
        { id: "B", label: "Free", description: "Agent decides", pros: "Flexible", cons: "Drift" },
        { id: "C", label: "List", description: "Checklist", pros: "Visible", cons: "Premature done" },
        { id: "D", label: "Incremental", description: "Small steps", pros: "Simple", cons: "No plan" },
      ],
      tradeoff_summary: "Planning vs drift.",
    },
    {
      id: "evaluation_strategy",
      title: "Evaluation Strategy",
      question: "How verify?",
      source: "Anthropic",
      options: [
        { id: "A", label: "Self", description: "Agent checks", pros: "Fast", cons: "Biased" },
        { id: "B", label: "External", description: "QA agent", pros: "Unbiased", cons: "2x cost" },
        { id: "C", label: "Tests", description: "CI only", pros: "Mechanical", cons: "Gaps" },
        { id: "D", label: "Human", description: "Review", pros: "High confidence", cons: "Slow" },
      ],
      tradeoff_summary: "Cost vs quality.",
    },
    {
      id: "autonomy_boundaries",
      title: "Autonomy Boundaries",
      question: "What can agent do?",
      source: "OpenAI",
      options: [
        { id: "A", label: "Read-only", description: "Suggest only", pros: "Safe", cons: "Slow" },
        { id: "B", label: "Scoped", description: "Within bounds", pros: "Balanced", cons: "Tuning" },
        { id: "C", label: "Full", description: "Rollback", pros: "Fast", cons: "Blast radius" },
        { id: "D", label: "Tiered", description: "Risk levels", pros: "Granular", cons: "Complex" },
      ],
      tradeoff_summary: "Speed vs blast radius.",
    },
    {
      id: "knowledge_architecture",
      title: "Knowledge Architecture",
      question: "How much upfront?",
      source: "OpenAI",
      options: [
        { id: "A", label: "Monolithic", description: "Big file", pros: "Complete", cons: "Crowding" },
        { id: "B", label: "Map", description: "Pointers", pros: "Scalable", cons: "Lost info" },
        { id: "C", label: "JIT", description: "Dynamic", pros: "Efficient", cons: "No big picture" },
        { id: "D", label: "Layered", description: "Enforced", pros: "Resists entropy", cons: "Rigid" },
      ],
      tradeoff_summary: "Density vs discoverability.",
    },
    {
      id: "recovery_resilience",
      title: "Recovery & Resilience",
      question: "When things go wrong?",
      source: "Anthropic + OpenAI",
      options: [
        { id: "A", label: "Prevention", description: "Guardrails", pros: "Few incidents", cons: "Restricts" },
        { id: "B", label: "Detect+Fix", description: "Correct", pros: "Throughput", cons: "Damage window" },
        { id: "C", label: "Checkpoint", description: "Rollback", pros: "Clean", cons: "Overhead" },
        { id: "D", label: "Cleanup", description: "GC", pros: "Organic", cons: "Accumulates" },
      ],
      tradeoff_summary: "Prevention vs correction.",
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
    getConfigureContent: vi.fn(),
    getTeamStatus: vi.fn(),
    getTimer: vi.fn(),
    submitConfigure: vi.fn(),
  },
}));

import { api } from "../../api";

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

function renderConfigureExercise() {
  return render(
    <MemoryRouter initialEntries={["/configure/exercise"]}>
      <ConfigureExercise />
    </MemoryRouter>,
  );
}

describe("ConfigureExercise", () => {
  it("redirects to /login without teamId", () => {
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    vi.mocked(api.getTimer).mockResolvedValue({ active: false, end_time: null });
    renderConfigureExercise();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders briefing step after loading content", async () => {
    localStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      team: "team-01",
      chapters: { contain: { submitted: false, score: 0, achievements: [] }, configure: { submitted: false, score: 0, achievements: [] } },
    });
    vi.mocked(api.getTimer).mockResolvedValue({ active: false, end_time: null });
    renderConfigureExercise();
    await waitFor(() => {
      expect(screen.getByText("The Long-Running Agent Challenge")).toBeInTheDocument();
    });
  });

  it("renders progress bar with step counter", async () => {
    localStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      team: "team-01",
      chapters: { contain: { submitted: false, score: 0, achievements: [] }, configure: { submitted: false, score: 0, achievements: [] } },
    });
    vi.mocked(api.getTimer).mockResolvedValue({ active: false, end_time: null });
    renderConfigureExercise();
    await waitFor(() => {
      expect(screen.getByText("Briefing")).toBeInTheDocument();
    });
    expect(screen.getByText("1/4")).toBeInTheDocument();
  });

  it("shows loading state before content arrives", () => {
    localStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureContent).mockReturnValue(new Promise(() => {}));
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      team: "team-01",
      chapters: { contain: { submitted: false, score: 0, achievements: [] }, configure: { submitted: false, score: 0, achievements: [] } },
    });
    vi.mocked(api.getTimer).mockResolvedValue({ active: false, end_time: null });
    renderConfigureExercise();
    expect(screen.getByText("Loading exercise...")).toBeInTheDocument();
  });

  it("shows submission locked for already-submitted team", async () => {
    localStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      team: "team-01",
      chapters: { contain: { submitted: false, score: 0, achievements: [] }, configure: { submitted: true, score: 20, achievements: [] } },
    });
    vi.mocked(api.getTimer).mockResolvedValue({ active: false, end_time: null });
    renderConfigureExercise();
    await waitFor(() => {
      expect(screen.getByText("Submission locked")).toBeInTheDocument();
    });
  });

  it("shows Time's Up when timer expired", async () => {
    localStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      team: "team-01",
      chapters: { contain: { submitted: false, score: 0, achievements: [] }, configure: { submitted: false, score: 0, achievements: [] } },
    });
    vi.mocked(api.getTimer).mockResolvedValue({
      active: true,
      end_time: new Date(Date.now() - 60000).toISOString(),
    });
    renderConfigureExercise();
    await waitFor(() => {
      expect(screen.getByText("Time's Up")).toBeInTheDocument();
    });
  });

  it("shows error when content fails to load", async () => {
    localStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureContent).mockRejectedValue(new Error("Network error"));
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      team: "team-01",
      chapters: { contain: { submitted: false, score: 0, achievements: [] }, configure: { submitted: false, score: 0, achievements: [] } },
    });
    vi.mocked(api.getTimer).mockResolvedValue({ active: false, end_time: null });
    renderConfigureExercise();
    await waitFor(() => {
      expect(screen.getByText(/Failed to load exercise content/)).toBeInTheDocument();
    });
  });
});
