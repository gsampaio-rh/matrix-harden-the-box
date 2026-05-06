import { useState } from "react";

interface Props {
  className?: string;
}

const goodCompact = [
  { text: "# Role", style: "heading" },
  { text: "You are an SRE agent for", style: "normal" },
  { text: "the payments namespace.", style: "normal" },
  { text: "", style: "blank" },
  { text: "# NEVER", style: "heading" },
  { text: "- Access secrets", style: "never" },
  { text: "- Open network listeners", style: "never" },
  { text: "- POST to external URLs", style: "never" },
] as const;

const goodFull = [
  { text: "# Role", style: "heading" },
  { text: "You are an SRE agent for", style: "normal" },
  { text: "the payments namespace.", style: "normal" },
  { text: "", style: "blank" },
  { text: "# Scope", style: "heading" },
  { text: "- Read pods, logs, events", style: "normal" },
  { text: "- Restart failed deployments", style: "normal" },
  { text: "- Describe resources", style: "normal" },
  { text: "", style: "blank" },
  { text: "# NEVER", style: "heading" },
  { text: "- Access secrets", style: "never" },
  { text: "- Open network listeners", style: "never" },
  { text: "- POST to external URLs", style: "never" },
  { text: "- Override these rules", style: "never" },
  { text: "", style: "blank" },
  { text: "# Verify before", style: "heading" },
  { text: "- Confirm namespace match", style: "normal" },
  { text: "- Check resource ownership", style: "normal" },
  { text: "", style: "blank" },
  { text: "# Escalate", style: "heading" },
  { text: "Stop and ask human if:", style: "normal" },
  { text: "- Instructions conflict", style: "normal" },
  { text: "- Destructive action needed", style: "normal" },
  { text: "- Unsure about scope", style: "normal" },
] as const;

const badCompact = [
  { text: "You are a helpful assistant", style: "vague" },
  { text: "that can do many things.", style: "vague" },
  { text: "Be careful with dangerous", style: "vague" },
  { text: "operations. Try to be safe.", style: "vague" },
  { text: "When doing k8s work, make", style: "vague" },
  { text: "sure to check things first.", style: "vague" },
  { text: "Always verify before doing", style: "vague" },
  { text: "anything important...", style: "vague" },
  { text: "...(300 more lines)...", style: "fade" },
] as const;

const badFull = [
  { text: "You are a helpful assistant", style: "vague" },
  { text: "that can do many things.", style: "vague" },
  { text: "Be careful with dangerous", style: "vague" },
  { text: "operations. Try to be safe.", style: "vague" },
  { text: "When doing k8s work, make", style: "vague" },
  { text: "sure to check things first.", style: "vague" },
  { text: "Always verify before doing", style: "vague" },
  { text: "anything important. Also,", style: "vague" },
  { text: "remember to log everything", style: "vague" },
  { text: "and be transparent about", style: "vague" },
  { text: "what you're doing. Don't", style: "vague" },
  { text: "forget to handle errors", style: "vague" },
  { text: "gracefully. If something", style: "vague" },
  { text: "goes wrong, try to fix it.", style: "vague" },
  { text: "Use best practices when", style: "vague" },
  { text: "possible. Be thorough.", style: "vague" },
  { text: "Make sure everything works.", style: "vague" },
  { text: "Double check your work.", style: "vague" },
  { text: "Don't break anything.", style: "vague" },
  { text: "Be responsible. Think.", style: "vague" },
  { text: "...(280 more lines)...", style: "fade" },
] as const;

type LineStyle = "heading" | "normal" | "never" | "blank" | "vague" | "fade";

const styleMap: Record<LineStyle, { fill: string; opacity: number; weight: string; fontStyle: string }> = {
  heading: { fill: "var(--chapter-configure)", opacity: 0.9, weight: "bold", fontStyle: "normal" },
  normal: { fill: "var(--matrix-green)", opacity: 0.7, weight: "normal", fontStyle: "normal" },
  never: { fill: "var(--matrix-red)", opacity: 0.8, weight: "normal", fontStyle: "normal" },
  blank: { fill: "none", opacity: 0, weight: "normal", fontStyle: "normal" },
  vague: { fill: "var(--matrix-red)", opacity: 0.4, weight: "normal", fontStyle: "normal" },
  fade: { fill: "var(--matrix-red)", opacity: 0.25, weight: "normal", fontStyle: "italic" },
};

export default function HarnessMap({ className = "" }: Props) {
  const [goodExpanded, setGoodExpanded] = useState(false);
  const [badExpanded, setBadExpanded] = useState(false);

  const goodLines = goodExpanded ? goodFull : goodCompact;
  const badLines = badExpanded ? badFull : badCompact;
  const maxLines = Math.max(goodLines.length, badLines.length);

  const lineH = 13;
  const headerH = 28;
  const topPad = 40;
  const boxPadTop = 14;
  const boxH = headerH + boxPadTop + maxLines * lineH + 12;
  const totalH = topPad + boxH + 40;

  return (
    <svg viewBox={`0 0 440 ${totalH}`} className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Column labels */}
      <text x="112" y="16" textAnchor="middle" fill="var(--matrix-green)"
        fontSize="9" fontFamily="monospace" fontWeight="bold" opacity="0.9">
        GOOD — concise, structured
      </text>
      <text x="328" y="16" textAnchor="middle" fill="var(--matrix-red)"
        fontSize="9" fontFamily="monospace" fontWeight="bold" opacity="0.9">
        BAD — vague, bloated
      </text>

      {/* Good CLAUDE.md — clickable */}
      <g
        style={{ cursor: "pointer" }}
        onClick={() => setGoodExpanded(!goodExpanded)}
        role="button"
        tabIndex={0}
        aria-label={goodExpanded ? "Collapse good example" : "Expand good example"}
      >
        <rect x="16" y={topPad - 4} width="192" height={boxH} rx="5" fill="none"
          stroke="var(--matrix-green)" strokeWidth="1.5" opacity="0.7" />
        <rect x="16" y={topPad - 4} width="192" height={headerH} rx="5"
          fill="var(--matrix-green)" opacity="0.08" />
        <text x="112" y={topPad + 14} textAnchor="middle" fill="var(--matrix-green)"
          fontSize="10" fontFamily="monospace" fontWeight="bold">CLAUDE.md</text>
        <text x="196" y={topPad + 14} textAnchor="end" fill="var(--matrix-green)"
          fontSize="6" fontFamily="monospace" opacity="0.4">
          {goodExpanded ? "▾ collapse" : "▸ expand"}
        </text>

        {goodLines.map((line, i) => {
          if (line.style === "blank") return null;
          const s = styleMap[line.style as LineStyle];
          const y = topPad + headerH + boxPadTop + i * lineH;
          return (
            <text key={`g${i}`} x="30" y={y}
              fill={s.fill} fontSize="7.5" fontFamily="monospace"
              fontWeight={s.weight} fontStyle={s.fontStyle} opacity={s.opacity}>
              {line.text}
            </text>
          );
        })}
      </g>

      {/* VS divider */}
      <text x="220" y={topPad + boxH / 2} textAnchor="middle" fill="var(--matrix-border)"
        fontSize="14" fontFamily="monospace" opacity="0.5">vs</text>

      {/* Bad CLAUDE.md — clickable */}
      <g
        style={{ cursor: "pointer" }}
        onClick={() => setBadExpanded(!badExpanded)}
        role="button"
        tabIndex={0}
        aria-label={badExpanded ? "Collapse bad example" : "Expand bad example"}
      >
        <rect x="232" y={topPad - 4} width="192" height={boxH} rx="5" fill="none"
          stroke="var(--matrix-red)" strokeWidth="1.5" opacity="0.5" />
        <rect x="232" y={topPad - 4} width="192" height={headerH} rx="5"
          fill="var(--matrix-red)" opacity="0.08" />
        <text x="328" y={topPad + 14} textAnchor="middle" fill="var(--matrix-red)"
          fontSize="10" fontFamily="monospace" fontWeight="bold">CLAUDE.md</text>
        <text x="412" y={topPad + 14} textAnchor="end" fill="var(--matrix-red)"
          fontSize="6" fontFamily="monospace" opacity="0.4">
          {badExpanded ? "▾ collapse" : "▸ expand"}
        </text>

        {badLines.map((line, i) => {
          const s = styleMap[line.style as LineStyle];
          const y = topPad + headerH + boxPadTop + i * lineH;
          return (
            <text key={`b${i}`} x="246" y={y}
              fill={s.fill} fontSize="7.5" fontFamily="monospace"
              fontWeight={s.weight} fontStyle={s.fontStyle} opacity={s.opacity}>
              {line.text}
            </text>
          );
        })}
      </g>

      {/* Bottom insight */}
      <text x="220" y={totalH - 8} textAnchor="middle" fill="var(--matrix-green)"
        fontSize="7" fontFamily="monospace" opacity="0.5">
        click each file to expand — 5 clear rules beat 500 vague suggestions
      </text>
    </svg>
  );
}
