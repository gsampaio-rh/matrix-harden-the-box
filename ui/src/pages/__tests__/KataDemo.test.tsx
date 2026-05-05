import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import KataDemo from "../KataDemo";

function renderKataDemo() {
  return render(
    <MemoryRouter initialEntries={["/kata"]}>
      <KataDemo />
    </MemoryRouter>,
  );
}

describe("KataDemo page", () => {
  it("renders first step by default", () => {
    renderKataDemo();
    expect(screen.getByText("The Shared Kernel Problem")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
  });

  it("renders an SVG illustration", () => {
    const { container } = renderKataDemo();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("advances step on Next click", () => {
    renderKataDemo();
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Container Escape")).toBeInTheDocument();
    expect(screen.getByText("Step 2 of 5")).toBeInTheDocument();
  });

  it("goes back on Back click", () => {
    renderKataDemo();
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Container Escape")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Back"));
    expect(screen.getByText("The Shared Kernel Problem")).toBeInTheDocument();
  });

  it("disables Back button on first step", () => {
    renderKataDemo();
    const backBtn = screen.getByText("Back");
    expect(backBtn).toBeDisabled();
  });

  it("navigates forward with ArrowRight key", () => {
    renderKataDemo();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText("Container Escape")).toBeInTheDocument();
  });

  it("navigates backward with ArrowLeft key", () => {
    renderKataDemo();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByText("The Shared Kernel Problem")).toBeInTheDocument();
  });

  it("does not go past the last step", () => {
    renderKataDemo();
    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(window, { key: "ArrowRight" });
    }
    expect(screen.getByText("Step 5 of 5")).toBeInTheDocument();
    expect(screen.getByText("Defense in Depth")).toBeInTheDocument();
  });

  it("does not go before the first step", () => {
    renderKataDemo();
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
  });

  it("shows Back to Scoreboard link on the last step", () => {
    renderKataDemo();
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText("Next"));
    }
    const link = screen.getByText("Back to Scoreboard");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/scoreboard");
  });

  it("renders all five steps sequentially", () => {
    renderKataDemo();
    const titles = [
      "The Shared Kernel Problem",
      "Container Escape",
      "Enter Kata Containers",
      "Attack Contained",
      "Defense in Depth",
    ];
    titles.forEach((title, i) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      if (i < titles.length - 1) {
        fireEvent.click(screen.getByText("Next"));
      }
    });
  });

  it("clicking step indicator dots navigates to that step", () => {
    renderKataDemo();
    const dots = screen.getAllByRole("button", { name: /Go to step/ });
    expect(dots).toHaveLength(5);
    fireEvent.click(dots[3]);
    expect(screen.getByText("Attack Contained")).toBeInTheDocument();
    expect(screen.getByText("Step 4 of 5")).toBeInTheDocument();
  });
});
