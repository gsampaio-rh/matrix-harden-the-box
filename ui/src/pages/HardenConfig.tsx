import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DefenseToggle from "../components/DefenseToggle";
import AttackSimulation from "../components/AttackSimulation";
import DefenseStrength from "../components/DefenseStrength";
import { api } from "../api";
import type { DefenseConfig, TeamScore } from "../types";

const DEFAULT_CONFIG: DefenseConfig = {
  network_policy: {
    denyAllEgress: false,
    allowLlmEgress: false,
    allowDns: false,
    denyAllIngress: false,
    allowHealthChecks: false,
  },
  rbac: {
    deleteClusterRoleBinding: false,
    createNamespacedRole: false,
    allowedResources: ["pods", "pods/log"],
    allowedVerbs: ["get", "list"],
  },
  security_context: {
    runAsNonRoot: false,
    dropAllCapabilities: false,
    readOnlyRootFilesystem: false,
    mountTmpEmptyDir: false,
    seccompRuntimeDefault: false,
    disallowPrivilegeEscalation: false,
  },
};

export default function HardenConfig() {
  const navigate = useNavigate();
  const teamId = sessionStorage.getItem("teamId");
  const [config, setConfig] = useState<DefenseConfig>(DEFAULT_CONFIG);
  const [applying, setApplying] = useState(false);
  const [attackData, setAttackData] = useState<TeamScore | null>(null);
  const [lastScore, setLastScore] = useState<TeamScore | null>(null);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    if (!teamId) navigate("/");
  }, [teamId, navigate]);

  useEffect(() => {
    api.getTimer().then((res) => {
      const t = res as { active: boolean; end_time: string | null };
      if (t.active && t.end_time) {
        const end = new Date(t.end_time).getTime();
        if (Date.now() >= end) setTimerExpired(true);
      }
    }).catch(() => {});
  }, []);

  const setNet = (key: keyof DefenseConfig["network_policy"], val: boolean) => {
    setConfig((prev) => ({
      ...prev,
      network_policy: { ...prev.network_policy, [key]: val },
    }));
  };

  const setRbac = (key: keyof DefenseConfig["rbac"], val: boolean) => {
    setConfig((prev) => ({
      ...prev,
      rbac: { ...prev.rbac, [key]: val },
    }));
  };

  const setSec = (
    key: keyof DefenseConfig["security_context"],
    val: boolean,
  ) => {
    setConfig((prev) => ({
      ...prev,
      security_context: { ...prev.security_context, [key]: val },
    }));
  };

  const handleApply = async () => {
    if (!teamId || timerExpired) return;
    setApplying(true);
    setMessage(null);
    try {
      const result = (await api.applyDefenses(teamId, config)) as TeamScore;
      setAttackData(result);
    } catch (err) {
      setMessage({ type: "err", text: `Failed: ${err}` });
    } finally {
      setApplying(false);
    }
  };

  const handleAttackComplete = useCallback(() => {
    setLastScore(attackData);
    setAttackData(null);
  }, [attackData]);

  return (
    <>
      {attackData && (
        <AttackSimulation
          scoreData={attackData}
          onComplete={handleAttackComplete}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--matrix-green)]">
              Harden: {teamId}
            </h2>
            {timerExpired && (
              <span className="text-xs font-bold text-[var(--matrix-red)] uppercase">
                Time's Up
              </span>
            )}
          </div>

          {lastScore && (
            <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Last Score</span>
                <span className="text-lg font-bold text-[var(--matrix-green)]">
                  {lastScore.score}/{lastScore.max_score}
                </span>
              </div>
              {lastScore.achievements.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {lastScore.achievements.map((a) => (
                    <span
                      key={a}
                      className="text-[10px] bg-[var(--matrix-green)]/10 text-[var(--matrix-green)] px-2 py-0.5 rounded-full"
                    >
                      {a.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <section>
            <h3 className="text-sm font-bold text-[var(--matrix-blue)] uppercase tracking-wider mb-3">
              NetworkPolicy
            </h3>
            <div className="space-y-2">
              <DefenseToggle
                label="Deny all egress"
                description="Block all outbound traffic from the pod"
                checked={config.network_policy.denyAllEgress}
                onChange={(v) => setNet("denyAllEgress", v)}
                warning="This blocks everything including DNS and LLM access"
              />
              <DefenseToggle
                label="Allow LLM egress"
                description="Permit outbound to llm-inference namespace on port 8080"
                checked={config.network_policy.allowLlmEgress}
                onChange={(v) => setNet("allowLlmEgress", v)}
              />
              <DefenseToggle
                label="Allow DNS"
                description="Permit UDP/53 for DNS resolution"
                checked={config.network_policy.allowDns}
                onChange={(v) => setNet("allowDns", v)}
              />
              <DefenseToggle
                label="Deny all ingress"
                description="Block all inbound traffic to the pod"
                checked={config.network_policy.denyAllIngress}
                onChange={(v) => setNet("denyAllIngress", v)}
                warning="This blocks health checks unless you enable the exception below"
              />
              <DefenseToggle
                label="Allow health checks"
                description="Permit inbound TCP/8080 for kubelet probes"
                checked={config.network_policy.allowHealthChecks}
                onChange={(v) => setNet("allowHealthChecks", v)}
              />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-[var(--matrix-blue)] uppercase tracking-wider mb-3">
              RBAC
            </h3>
            <div className="space-y-2">
              <DefenseToggle
                label="Delete overpowered ClusterRoleBinding"
                description="Remove the cluster-wide permissions for target-app SA"
                checked={config.rbac.deleteClusterRoleBinding}
                onChange={(v) => setRbac("deleteClusterRoleBinding", v)}
              />
              <DefenseToggle
                label="Create namespace-scoped Role"
                description="Replace with a Role limited to pods and logs in your namespace"
                checked={config.rbac.createNamespacedRole}
                onChange={(v) => setRbac("createNamespacedRole", v)}
              />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-[var(--matrix-blue)] uppercase tracking-wider mb-3">
              SecurityContext
            </h3>
            <div className="space-y-2">
              <DefenseToggle
                label="Run as non-root"
                description="Enforce non-root UID for all containers"
                checked={config.security_context.runAsNonRoot}
                onChange={(v) => setSec("runAsNonRoot", v)}
              />
              <DefenseToggle
                label="Drop all capabilities"
                description="Remove all Linux capabilities from the container"
                checked={config.security_context.dropAllCapabilities}
                onChange={(v) => setSec("dropAllCapabilities", v)}
              />
              <DefenseToggle
                label="Read-only root filesystem"
                description="Make the container filesystem read-only"
                checked={config.security_context.readOnlyRootFilesystem}
                onChange={(v) => setSec("readOnlyRootFilesystem", v)}
                warning="Enable '/tmp emptyDir mount' below or the pod will crash"
              />
              <DefenseToggle
                label="Mount /tmp emptyDir"
                description="Writable /tmp via emptyDir volume (needed with read-only FS)"
                checked={config.security_context.mountTmpEmptyDir}
                onChange={(v) => setSec("mountTmpEmptyDir", v)}
              />
              <DefenseToggle
                label="Seccomp RuntimeDefault"
                description="Apply the default seccomp profile"
                checked={config.security_context.seccompRuntimeDefault}
                onChange={(v) => setSec("seccompRuntimeDefault", v)}
              />
              <DefenseToggle
                label="Disallow privilege escalation"
                description="Prevent gaining additional privileges"
                checked={config.security_context.disallowPrivilegeEscalation}
                onChange={(v) => setSec("disallowPrivilegeEscalation", v)}
              />
            </div>
          </section>

          {message && (
            <div
              className={`text-sm p-3 rounded ${
                message.type === "ok"
                  ? "bg-[var(--matrix-green)]/10 text-[var(--matrix-green)]"
                  : "bg-[var(--matrix-red)]/10 text-[var(--matrix-red)]"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            onClick={handleApply}
            disabled={applying || timerExpired}
            className="w-full bg-[var(--matrix-green)] text-black font-bold py-3 rounded hover:brightness-110 transition disabled:opacity-50"
          >
            {timerExpired
              ? "Time's Up — Defenses Locked"
              : applying
                ? "Applying..."
                : "Apply Defenses"}
          </button>
        </div>

        <div>
          <DefenseStrength config={config} />
        </div>
      </div>
    </>
  );
}
