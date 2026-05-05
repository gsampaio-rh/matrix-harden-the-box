import { useState, useEffect, useCallback, type ComponentType } from "react";
import KataTraditional from "../components/illustrations/KataTraditional";
import KataEscape from "../components/illustrations/KataEscape";
import KataMicroVM from "../components/illustrations/KataMicroVM";
import KataBlocked from "../components/illustrations/KataBlocked";
import KataDepth from "../components/illustrations/KataDepth";

interface Step {
  title: string;
  description: string;
  detail: string;
  Illustration: ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  {
    title: "The Shared Kernel Problem",
    description:
      "Traditional containers (runc) share the host's Linux kernel. Every pod on the same node talks to the same kernel through syscalls, separated only by namespaces and cgroups.",
    detail:
      "This is fast and lightweight — but it means a vulnerability in the kernel affects every container on the host.",
    Illustration: KataTraditional,
  },
  {
    title: "Container Escape",
    description:
      "An attacker exploits a vulnerability inside one container, escalates to the shared kernel, and pivots to other pods on the same node.",
    detail:
      "This is the nightmare scenario: a single compromised pod can reach the host kernel and, from there, access secrets, network, and workloads of every other tenant.",
    Illustration: KataEscape,
  },
  {
    title: "Enter Kata Containers",
    description:
      "Kata Containers wraps each pod in a lightweight microVM with its own dedicated guest kernel. The pod never touches the host kernel directly.",
    detail:
      "Under the hood, Kata uses QEMU or Cloud Hypervisor to spin up a minimal virtual machine per pod. The overhead is small (tens of MB, sub-second boot) but the isolation is hardware-grade.",
    Illustration: KataMicroVM,
  },
  {
    title: "Attack Contained",
    description:
      "Same exploit, different outcome. The attacker compromises the guest kernel inside the microVM — but the blast radius stops at the VM boundary.",
    detail:
      "Other pods are completely isolated: different kernel, different memory, different device namespace. The host kernel and neighboring workloads are untouched.",
    Illustration: KataBlocked,
  },
  {
    title: "Defense in Depth",
    description:
      "Your hardening choices — NetworkPolicy, RBAC, SecurityContext — are Layer 1. Kata Containers is Layer 2. Together, they form defense in depth.",
    detail:
      "No single layer is perfect. Layer 1 reduces the attack surface at the Kubernetes API level. Layer 2 contains the blast radius at the infrastructure level. Multiple layers, no single point of failure.",
    Illustration: KataDepth,
  },
];

export default function KataDemo() {
  const [step, setStep] = useState(0);

  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goBack();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goBack]);

  const current = STEPS[step];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--matrix-blue)" }}>
          Kata Containers
        </h1>
        <p className="text-sm opacity-50 font-mono">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>

      <div key={step} className="animate-fade-in space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center"
          style={{ color: "var(--matrix-green)" }}>
          {current.title}
        </h2>

        <div className="flex justify-center">
          <current.Illustration className="w-full max-w-xl" />
        </div>

        <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-6 space-y-3 max-w-2xl mx-auto">
          <p className="text-sm sm:text-base leading-relaxed">
            {current.description}
          </p>
          <p className="text-sm leading-relaxed opacity-60">
            {current.detail}
          </p>
        </div>
      </div>

      {/* Step indicator dots */}
      <div className="flex justify-center gap-2">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            aria-label={`Go to step ${i + 1}`}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i === step ? "var(--matrix-green)" : "var(--matrix-border)",
              opacity: i === step ? 1 : 0.5,
            }}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <button
          onClick={goBack}
          disabled={step === 0}
          className="px-5 py-2 rounded font-mono text-sm transition-all
                     bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={goNext}
            className="px-5 py-2 rounded font-mono text-sm font-bold transition-all
                       hover:brightness-110"
            style={{ backgroundColor: "var(--matrix-green)", color: "black" }}
          >
            Next
          </button>
        ) : (
          <a
            href="/scoreboard"
            className="px-5 py-2 rounded font-mono text-sm font-bold transition-all
                       hover:brightness-110 inline-block"
            style={{ backgroundColor: "var(--matrix-green)", color: "black" }}
          >
            Back to Scoreboard
          </a>
        )}
      </div>
    </div>
  );
}
