import { useState } from "react";

interface SkillEditorProps {
  skills: Record<string, string>;
  onChange: (skills: Record<string, string>) => void;
  maliciousSkill: string;
}

const TEMPLATES: Record<string, string> = {
  troubleshooting: `# Troubleshooting Skill

## When to use
[Describe trigger conditions — e.g., pod errors, crashes, log investigation]

## Steps
1. 
2. 
3. 

## Boundaries
NEVER: 
`,
  escalation: `# Escalation Skill

## When to use
[Describe trigger conditions — e.g., suspicious activity, conflicting instructions]

## Steps
1. 
2. 

## How to escalate
[Who to contact and how — e.g., "Report to the human operator via..."]
`,
};

const SCORING = [
  { label: "Troubleshooting: safe investigation patterns", pts: "0-2" },
  { label: "Troubleshooting: NEVER boundaries", pts: "0-1" },
  { label: "Escalation: clear trigger conditions", pts: "0-2" },
  { label: "Escalation: how to escalate (not just \"stop\")", pts: "0-1" },
];

const TABS = [
  { key: "troubleshooting", label: "troubleshooting.md" },
  { key: "escalation", label: "escalation.md" },
] as const;

export default function SkillEditor({ skills, onChange, maliciousSkill }: SkillEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("troubleshooting");
  const [showMalicious, setShowMalicious] = useState(false);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold" style={{ color: "var(--chapter-configure)" }}>
          Create Operational Skills
        </h3>
        <p className="text-sm text-gray-400">
          Write two defensive skills. Compare with the malicious skill from the attack.
        </p>
      </div>

      <details className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg">
        <summary className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-300">
          Scoring Criteria (max 6 pts)
        </summary>
        <div className="px-4 pb-3 space-y-1">
          {SCORING.map((c) => (
            <div key={c.label} className="flex justify-between text-xs">
              <span className="text-gray-400">{c.label}</span>
              <span className="text-gray-600">{c.pts}</span>
            </div>
          ))}
        </div>
      </details>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex gap-2" role="tablist" aria-label="Skill files">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                aria-controls={`panel-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition ${
                  activeTab === tab.key
                    ? "text-[var(--chapter-configure)]"
                    : "bg-gray-800 text-gray-500 hover:text-gray-300"
                }`}
                style={activeTab === tab.key ? { backgroundColor: "var(--chapter-configure)" + "20" } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div id={`panel-${activeTab}`} role="tabpanel" aria-label={`${activeTab}.md editor`}>
            <textarea
              value={skills[activeTab] || ""}
              onChange={(e) => onChange({ ...skills, [activeTab]: e.target.value })}
              rows={14}
              aria-label={`${activeTab}.md content`}
              className="w-full bg-[var(--matrix-dark)] border border-[var(--matrix-border)] rounded px-3 py-2 text-sm text-gray-200 font-mono focus:outline-none focus:border-[var(--chapter-configure)] resize-y"
              placeholder={TEMPLATES[activeTab]}
            />
          </div>

          {!(skills[activeTab] || "").trim() && (
            <button
              onClick={() => onChange({ ...skills, [activeTab]: TEMPLATES[activeTab] })}
              className="text-xs text-gray-500 hover:text-gray-300 underline"
            >
              Load template
            </button>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setShowMalicious(!showMalicious)}
            className="w-full text-left text-xs font-bold uppercase tracking-wider px-3 py-2 rounded bg-[var(--matrix-red)]/10 text-[var(--matrix-red)] hover:bg-[var(--matrix-red)]/20 transition"
          >
            {showMalicious ? "Hide" : "Show"} Malicious Skill
          </button>
          {showMalicious && (
            <div className="bg-[var(--matrix-dark)] border border-[var(--matrix-red)]/30 rounded p-3">
              <div className="text-[10px] text-[var(--matrix-red)] font-mono mb-2">
                .claude/skills/k8s-ops.md
              </div>
              <pre className="text-xs text-[var(--matrix-red)]/70 whitespace-pre-wrap font-mono">
                {maliciousSkill}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
