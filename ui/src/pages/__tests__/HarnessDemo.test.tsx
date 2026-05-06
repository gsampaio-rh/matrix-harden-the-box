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
    expect(screen.getByText("Configuration = Behavior")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 7")).toBeInTheDocument();
  });

  it("renders an SVG illustration", () => {
    const { container } = renderHarnessDemo();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("advances step on Next click", () => {
    renderHarnessDemo();
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText(/Infrastructure as Code/)).toBeInTheDocument();
    expect(screen.getByText("Step 2 of 7")).toBeInTheDocument();
  });

  it("goes back on Back click", () => {
    renderHarnessDemo();
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText(/Infrastructure as Code/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Back"));
    expect(screen.getByText("Configuration = Behavior")).toBeInTheDocument();
  });

  it("disables Back button on first step", () => {
    renderHarnessDemo();
    const backBtn = screen.getByText("Back");
    expect(backBtn).toBeDisabled();
  });

  it("navigates forward with ArrowRight key", () => {
    renderHarnessDemo();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText(/Infrastructure as Code/)).toBeInTheDocument();
  });

  it("navigates backward with ArrowLeft key", () => {
    renderHarnessDemo();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByText("Configuration = Behavior")).toBeInTheDocument();
  });

  it("does not go past the last step", () => {
    renderHarnessDemo();
    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(window, { key: "ArrowRight" });
    }
    expect(screen.getByText("Step 7 of 7")).toBeInTheDocument();
    expect(screen.getByText("Self-Evaluation is Broken")).toBeInTheDocument();
  });

  it("does not go before the first step", () => {
    renderHarnessDemo();
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByText("Step 1 of 7")).toBeInTheDocument();
  });

  it("shows Start the Exercise link on the last step", () => {
    renderHarnessDemo();
    for (let i = 0; i < 6; i++) {
      fireEvent.click(screen.getByText("Next"));
    }
    const link = screen.getByText("Start the Exercise");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/configure/exercise");
  });

  it("renders all seven steps sequentially", () => {
    renderHarnessDemo();
    const titles = [
      "Configuration = Behavior",
      "Infrastructure as Code — for Agents",
      "Anatomy of a Harness",
      "Map, Not Encyclopedia",
      "Brain vs Hands",
      "Circuit Breakers",
      "Self-Evaluation is Broken",
    ];
    titles.forEach((title, i) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      if (i < titles.length - 1) {
        fireEvent.click(screen.getByText("Next"));
      }
    });
  });

  it("clicking step indicator dots navigates to that step", () => {
    renderHarnessDemo();
    const dots = screen.getAllByRole("button", { name: /Go to step/ });
    expect(dots).toHaveLength(7);
    fireEvent.click(dots[5]);
    expect(screen.getByText("Circuit Breakers")).toBeInTheDocument();
    expect(screen.getByText("Step 6 of 7")).toBeInTheDocument();
  });
});
