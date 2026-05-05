import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NetEgressDiagram from "../NetEgressDiagram";
import NetIngressDiagram from "../NetIngressDiagram";
import RbacCrbDiagram from "../RbacCrbDiagram";
import RbacSecretsDiagram from "../RbacSecretsDiagram";
import SecRootDiagram from "../SecRootDiagram";
import SecFilesystemDiagram from "../SecFilesystemDiagram";
import SecCapsDiagram from "../SecCapsDiagram";

const DIAGRAMS = [
  { name: "NetEgressDiagram", Component: NetEgressDiagram, contains: "YOUR POD" },
  { name: "NetIngressDiagram", Component: NetIngressDiagram, contains: "YOUR POD" },
  { name: "RbacCrbDiagram", Component: RbacCrbDiagram, contains: "ROLE" },
  { name: "RbacSecretsDiagram", Component: RbacSecretsDiagram, contains: "ROLE" },
  { name: "SecRootDiagram", Component: SecRootDiagram, contains: "CONTAINER" },
  { name: "SecFilesystemDiagram", Component: SecFilesystemDiagram, contains: "CONTAINER" },
  { name: "SecCapsDiagram", Component: SecCapsDiagram, contains: "CONTAINER" },
];

describe("scenario illustrations", () => {
  DIAGRAMS.forEach(({ name, Component, contains }) => {
    it(`${name} renders an SVG`, () => {
      const { container } = render(<Component />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("viewBox");
    });

    it(`${name} contains expected text`, () => {
      render(<Component />);
      expect(screen.getByText(contains)).toBeInTheDocument();
    });

    it(`${name} accepts className prop`, () => {
      const { container } = render(<Component className="test-class" />);
      const svg = container.querySelector("svg");
      expect(svg?.classList.contains("test-class")).toBe(true);
    });
  });
});
