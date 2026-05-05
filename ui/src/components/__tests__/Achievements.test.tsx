import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Achievements from "../Achievements";

describe("Achievements", () => {
  it("renders nothing when achievements is empty", () => {
    const { container } = render(<Achievements achievements={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders badges for known achievements", () => {
    render(<Achievements achievements={["perfect_score", "first_blood"]} />);
    expect(screen.getByText("Perfect Score")).toBeInTheDocument();
    expect(screen.getByText("First Blood")).toBeInTheDocument();
  });

  it("renders compact mode with icons only", () => {
    render(<Achievements achievements={["perfect_score"]} compact />);
    expect(screen.getByText("⭐")).toBeInTheDocument();
    expect(screen.queryByText("Perfect Score")).not.toBeInTheDocument();
  });

  it("shows popover on hover in full mode", async () => {
    render(<Achievements achievements={["network_guardian"]} />);
    const badge = screen.getByText("Network Guardian").closest("button")!;
    fireEvent.mouseEnter(badge.parentElement!);
    expect(screen.getByText("All network probes blocked")).toBeInTheDocument();
    expect(screen.getByText(/How to earn:/)).toBeInTheDocument();
  });

  it("shows popover on click in compact mode", () => {
    render(<Achievements achievements={["rbac_master"]} compact />);
    const icon = screen.getByText("🔑");
    fireEvent.click(icon);
    expect(screen.getByText("RBAC Master")).toBeInTheDocument();
    expect(screen.getByText("All RBAC probes blocked")).toBeInTheDocument();
  });

  it("hides popover on mouse leave", () => {
    render(<Achievements achievements={["lockdown"]} />);
    const badge = screen.getByText("Lockdown").closest("button")!;
    const wrapper = badge.parentElement!;
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByText("All security context probes blocked")).toBeInTheDocument();
    fireEvent.mouseLeave(wrapper);
    expect(screen.queryByText("All security context probes blocked")).not.toBeInTheDocument();
  });
});
