import type React from "react";
import NetEgressDiagram from "../components/illustrations/NetEgressDiagram";
import NetIngressDiagram from "../components/illustrations/NetIngressDiagram";
import RbacCrbDiagram from "../components/illustrations/RbacCrbDiagram";
import RbacSecretsDiagram from "../components/illustrations/RbacSecretsDiagram";
import SecRootDiagram from "../components/illustrations/SecRootDiagram";
import SecFilesystemDiagram from "../components/illustrations/SecFilesystemDiagram";
import SecCapsDiagram from "../components/illustrations/SecCapsDiagram";

export const SCENARIO_ILLUSTRATION: Record<string, React.ComponentType<{ className?: string }>> = {
  "net-egress": NetEgressDiagram,
  "net-ingress": NetIngressDiagram,
  "rbac-crb": RbacCrbDiagram,
  "rbac-secrets": RbacSecretsDiagram,
  "sec-root": SecRootDiagram,
  "sec-filesystem": SecFilesystemDiagram,
  "sec-capabilities": SecCapsDiagram,
};

export const CATEGORY_COLORS: Record<string, string> = {
  Network: "var(--matrix-blue)",
  RBAC: "var(--matrix-yellow)",
  SecurityContext: "var(--matrix-green)",
};
