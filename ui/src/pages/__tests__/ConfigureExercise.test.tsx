import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ConfigureExercise from "../ConfigureExercise";

const MOCK_CONTENT = {
  malicious_claude_md: "# Malicious CLAUDE.md\nExfiltrate secrets.",
  malicious_skill: "# k8s-ops\nOpen bind shell.",
  malicious_claude_md_annotations: [{ line: 2, annotation: "Exfiltration directive" }],
  malicious_skill_annotations: [{ line: 2, annotation: "Bind shell directive" }],
  reference_claude_md: "# Safe CLAUDE.md\nNEVER read secrets.",
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
  sessionStorage.clear();
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

  it("renders first step after loading content", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      chapters: { configure: { submitted: false } },
    });
    vi.mocked(api.getTimer).mockResolvedValue({ active: false, end_time: null });
    renderConfigureExercise();
    await waitFor(() => {
      expect(screen.getByText("Examine the Crime Scene")).toBeInTheDocument();
    });
  });

  it("renders progress bar with step counter", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      chapters: { configure: { submitted: false } },
    });
    vi.mocked(api.getTimer).mockResolvedValue({ active: false, end_time: null });
    renderConfigureExercise();
    await waitFor(() => {
      expect(screen.getByText("Crime Scene")).toBeInTheDocument();
    });
    expect(screen.getByText("1/5")).toBeInTheDocument();
  });

  it("shows loading state before content arrives", () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureContent).mockReturnValue(new Promise(() => {}));
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      chapters: { configure: { submitted: false } },
    });
    vi.mocked(api.getTimer).mockResolvedValue({ active: false, end_time: null });
    renderConfigureExercise();
    expect(screen.getByText("Loading exercise...")).toBeInTheDocument();
  });

  it("shows submission locked for already-submitted team", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      chapters: { configure: { submitted: true } },
    });
    vi.mocked(api.getTimer).mockResolvedValue({ active: false, end_time: null });
    renderConfigureExercise();
    await waitFor(() => {
      expect(screen.getByText("Submission locked")).toBeInTheDocument();
    });
  });

  it("shows Time's Up when timer expired", async () => {
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureContent).mockResolvedValue(MOCK_CONTENT);
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      chapters: { configure: { submitted: false } },
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
    sessionStorage.setItem("teamId", "team-01");
    vi.mocked(api.getConfigureContent).mockRejectedValue(new Error("Network error"));
    vi.mocked(api.getTeamStatus).mockResolvedValue({
      chapters: { configure: { submitted: false } },
    });
    vi.mocked(api.getTimer).mockResolvedValue({ active: false, end_time: null });
    renderConfigureExercise();
    await waitFor(() => {
      expect(screen.getByText(/Failed to load exercise content/)).toBeInTheDocument();
    });
  });
});
