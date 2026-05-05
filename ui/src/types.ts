export interface NetworkPolicyConfig {
  denyAllEgress: boolean;
  allowLlmEgress: boolean;
  allowDns: boolean;
  denyAllIngress: boolean;
  allowHealthChecks: boolean;
}

export interface RbacConfig {
  deleteClusterRoleBinding: boolean;
  createNamespacedRole: boolean;
  allowedResources: string[];
  allowedVerbs: string[];
}

export interface SecurityContextConfig {
  runAsNonRoot: boolean;
  dropAllCapabilities: boolean;
  readOnlyRootFilesystem: boolean;
  mountTmpEmptyDir: boolean;
  seccompRuntimeDefault: boolean;
  disallowPrivilegeEscalation: boolean;
}

export interface DefenseConfig {
  network_policy: NetworkPolicyConfig;
  rbac: RbacConfig;
  security_context: SecurityContextConfig;
}

export interface ProbeDetail {
  id: string;
  status: "BLOCKED" | "PASSED";
  points: number;
  max_points: number;
}

export interface TeamScore {
  team: string;
  score: number;
  max_score: number;
  blocked_count: number;
  total_probes: number;
  probes: ProbeDetail[];
  achievements: string[];
}

export interface TeamStatus {
  team_id: string;
  defenses_applied: boolean;
  score: number | null;
  achievements: string[];
}

export interface WsMessage {
  event: string;
  data: Record<string, unknown>;
}

export interface TimerState {
  active: boolean;
  end_time: string | null;
}
