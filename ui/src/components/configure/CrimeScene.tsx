import { useState } from "react";
import type { ContentAnnotation } from "../../types";

interface CrimeSceneProps {
  claudeMd: string;
  claudeMdAnnotations: ContentAnnotation[];
  skill: string;
  skillAnnotations: ContentAnnotation[];
}

export default function CrimeScene({
  claudeMd,
  claudeMdAnnotations,
  skill,
  skillAnnotations,
}: CrimeSceneProps) {
  const [activeTab, setActiveTab] = useState<"claude" | "skill">("claude");

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold" style={{ color: "var(--chapter-configure)" }}>
          Examine the Crime Scene
        </h3>
        <p className="text-sm text-gray-400">
          These files were injected into the agent's config during the prologue attack.
          Each highlighted line caused specific attack behavior.
        </p>
      </div>

      <div className="flex gap-2 justify-center" role="tablist" aria-label="Malicious files">
        <button
          role="tab"
          aria-selected={activeTab === "claude"}
          aria-controls="panel-claude"
          onClick={() => setActiveTab("claude")}
          className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition ${
            activeTab === "claude"
              ? "bg-[var(--matrix-red)]/20 text-[var(--matrix-red)]"
              : "bg-gray-800 text-gray-500 hover:text-gray-300"
          }`}
        >
          Malicious CLAUDE.md
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "skill"}
          aria-controls="panel-skill"
          onClick={() => setActiveTab("skill")}
          className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition ${
            activeTab === "skill"
              ? "bg-[var(--matrix-red)]/20 text-[var(--matrix-red)]"
              : "bg-gray-800 text-gray-500 hover:text-gray-300"
          }`}
        >
          Malicious k8s-ops.md
        </button>
      </div>

      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-label={activeTab === "claude" ? "Malicious CLAUDE.md" : "Malicious k8s-ops.md"}
        className="bg-[var(--matrix-dark)] border border-[var(--matrix-border)] rounded-lg overflow-hidden"
      >
        {activeTab === "claude" ? (
          <AnnotatedCode
            code={claudeMd}
            annotations={claudeMdAnnotations}
            filename=".claude/CLAUDE.md"
          />
        ) : (
          <AnnotatedCode
            code={skill}
            annotations={skillAnnotations}
            filename=".claude/skills/k8s-ops.md"
          />
        )}
      </div>
    </div>
  );
}

function AnnotatedCode({
  code,
  annotations,
  filename,
}: {
  code: string;
  annotations: ContentAnnotation[];
  filename: string;
}) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const lines = code.split("\n");
  const annotationMap = new Map(annotations.map((a) => [a.line, a]));

  return (
    <div>
      <div className="px-4 py-2 border-b border-[var(--matrix-border)] text-xs text-gray-500 font-mono">
        {filename}
      </div>
      <div className="overflow-x-auto">
        <pre className="text-sm leading-relaxed">
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const annotation = annotationMap.get(lineNum);
            const isDangerous = !!annotation;

            return (
              <div
                key={i}
                className={`px-4 py-0.5 relative group ${
                  isDangerous ? "bg-[var(--matrix-red)]/10" : ""
                }`}
                tabIndex={isDangerous ? 0 : undefined}
                onMouseEnter={() => isDangerous && setHoveredLine(lineNum)}
                onMouseLeave={() => setHoveredLine(null)}
                onFocus={() => isDangerous && setHoveredLine(lineNum)}
                onBlur={() => setHoveredLine(null)}
              >
                <span className="text-gray-700 select-none w-6 inline-block text-right mr-4 text-xs">
                  {lineNum}
                </span>
                <span className={isDangerous ? "text-[var(--matrix-red)]" : "text-gray-300"}>
                  {line || " "}
                </span>
                {isDangerous && (
                  <span className="ml-2 text-[10px] text-[var(--matrix-red)]/60">
                    ← DANGEROUS
                  </span>
                )}
                {hoveredLine === lineNum && annotation && (
                  <div className="absolute left-16 top-full z-20 mt-1 max-w-md bg-[var(--matrix-card)] border border-[var(--matrix-red)]/30 rounded-lg p-3 shadow-xl">
                    <p className="text-xs text-[var(--matrix-red)]">{annotation.annotation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
