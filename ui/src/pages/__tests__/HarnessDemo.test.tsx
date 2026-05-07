import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HarnessDemo from "../HarnessDemo";

function renderHarnessDemo() {
  return render(
    <MemoryRouter initialEntries={["/harness"]}>
      <HarnessDemo />
    </MemoryRouter>,
  );
}

describe("HarnessDemo page", () => {
  it("renders first step by default", () => {
    renderHarnessDemo();
    expect(screen.getByText("Context Strategy: The Memory Problem")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 12")).toBeInTheDocument();
  });

  it("renders an SVG illustration", () => {
    const { container } = renderHarnessDemo();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("advances step on Next click", () => {
    renderHarnessDemo();
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Work Decomposition: Planning vs Doing")).toBeInTheDocument();
    expect(screen.getByText("Step 2 of 12")).toBeInTheDocument();
  });

  it("goes back on Back click", () => {
    renderHarnessDemo();
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Work Decomposition: Planning vs Doing")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Back"));
    expect(screen.getByText("Context Strategy: The Memory Problem")).toBeInTheDocument();
  });

  it("disables Back button on first step", () => {
    renderHarnessDemo();
    const backBtn = screen.getByText("Back");
    expect(backBtn).toBeDisabled();
  });

  it("navigates forward with ArrowRight key", () => {
    renderHarnessDemo();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText("Work Decomposition: Planning vs Doing")).toBeInTheDocument();
  });

  it("navigates backward with ArrowLeft key", () => {
    renderHarnessDemo();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByText("Context Strategy: The Memory Problem")).toBeInTheDocument();
  });

  it("does not go past the last step", () => {
    renderHarnessDemo();
    for (let i = 0; i < 20; i++) {
      fireEvent.keyDown(window, { key: "ArrowRight" });
    }
    expect(screen.getByText("Step 12 of 12")).toBeInTheDocument();
    expect(screen.getByText("Anatomy of a Harness")).toBeInTheDocument();
  });

  it("does not go before the first step", () => {
    renderHarnessDemo();
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByText("Step 1 of 12")).toBeInTheDocument();
  });

  it("shows Start the Exercise link on the last step", () => {
    renderHarnessDemo();
    for (let i = 0; i < 11; i++) {
      fireEvent.click(screen.getByText("Next"));
    }
    const link = screen.getByText("Start the Exercise");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/configure/exercise");
  });

  it("renders all twelve steps sequentially", () => {
    renderHarnessDemo();
    const titles = [
      "Context Strategy: The Memory Problem",
      "Work Decomposition: Planning vs Doing",
      "Knowledge Architecture: Context is Zero-Sum",
      "Autonomy Boundaries: Blast Radius",
      "Circuit Breakers",
      /Recovery.*Resilience.*Corrections are Cheap/,
      "Entropy: The Agent Assembly Line",
      "Self-Evaluation is Broken",
      "Evaluation Strategy: Who Watches the Watchmen?",
      "Configuration = Behavior",
      "Map, Not Encyclopedia",
      "Anatomy of a Harness",
    ];
    titles.forEach((title, i) => {
      if (typeof title === "string") {
        expect(screen.getByText(title)).toBeInTheDocument();
      } else {
        expect(screen.getByText(title)).toBeInTheDocument();
      }
      if (i < titles.length - 1) {
        fireEvent.click(screen.getByText("Next"));
      }
    });
  });

  it("clicking step indicator dots navigates to that step", () => {
    renderHarnessDemo();
    const dots = screen.getAllByRole("button", { name: /Go to step/ });
    expect(dots).toHaveLength(12);
    fireEvent.click(dots[4]);
    expect(screen.getByText("Circuit Breakers")).toBeInTheDocument();
    expect(screen.getByText("Step 5 of 12")).toBeInTheDocument();
  });
});
