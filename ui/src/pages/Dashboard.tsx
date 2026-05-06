import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { TeamStatus } from "../types";

interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  path: string;
  resultsPath: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: "contain",
    number: 1,
    title: "Harden the Box",
    subtitle: "Contain",
    description: "Choose security configurations for 7 Kubernetes scenarios, then watch Agent Smith attack your defenses.",
    color: "var(--chapter-contain)",
    path: "/contain/exercise",
    resultsPath: "/contain/results",
  },
  {
    id: "configure",
    number: 2,
    title: "Build Your Playbook",
    subtitle: "Configure",
    description: "Write a defensive CLAUDE.md, craft operational skills, and set circuit breakers to resist the prologue attack.",
    color: "var(--chapter-configure)",
    path: "/configure/exercise",
    resultsPath: "/configure/results",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const teamId = sessionStorage.getItem("teamId");
  const [status, setStatus] = useState<TeamStatus | null>(null);

  useEffect(() => {
    if (!teamId) {
      navigate("/login");
      return;
    }
    api
      .getTeamStatus(teamId)
      .then((res) => setStatus(res as TeamStatus))
      .catch((err) => console.error("Failed to load team status:", err));
  }, [teamId, navigate]);

  if (!teamId) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[var(--matrix-green)]">
          Exercise Dashboard
        </h2>
        <p className="text-sm text-gray-500">
          Team: <span className="text-gray-300 font-mono">{teamId}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHAPTERS.map((ch) => {
          const chapterStatus = status?.chapters?.[ch.id];
          const submitted = chapterStatus?.submitted ?? false;
          const score = chapterStatus?.score ?? 0;

          return (
            <div
              key={ch.id}
              className="bg-[var(--matrix-card)] border-2 rounded-lg overflow-hidden transition-all hover:brightness-110"
              style={{ borderColor: ch.color }}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded"
                      style={{ backgroundColor: ch.color + "20", color: ch.color }}
                    >
                      Ch. {ch.number}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: ch.color }}
                    >
                      {ch.subtitle}
                    </span>
                  </div>
                  {submitted && (
                    <span className="text-[10px] font-bold text-[var(--matrix-green)] bg-[var(--matrix-green)]/10 px-2 py-1 rounded">
                      {score} pts
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-200">
                  {ch.title}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {ch.description}
                </p>

                <button
                  onClick={() => navigate(submitted ? ch.resultsPath : ch.path)}
                  className="w-full font-bold py-2.5 rounded transition text-sm"
                  style={
                    submitted
                      ? { backgroundColor: "var(--matrix-card)", color: ch.color, border: `1px solid ${ch.color}40` }
                      : { backgroundColor: ch.color, color: "black" }
                  }
                >
                  {submitted ? "View Results" : "Start Exercise"}
                </button>
              </div>
            </div>
          );
        })}

        {/* Future chapter placeholder */}
        <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-6 opacity-40">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600 px-2 py-1 rounded bg-gray-800">
              Ch. 3+
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-600 mb-2">Coming Soon</h3>
          <p className="text-sm text-gray-700">More chapters will be unlocked as the workshop progresses.</p>
        </div>
      </div>
    </div>
  );
}
