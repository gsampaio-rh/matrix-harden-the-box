import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [teamId, setTeamId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const id = teamId.trim().toLowerCase();
    if (!id) return;

    setSubmitting(true);
    setError(null);
    try {
      await api.registerTeam(id);
      localStorage.setItem("teamId", id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-[var(--matrix-card)] border border-[var(--matrix-border)] rounded-lg p-8 w-full max-w-md">
        <h2 className="text-[var(--matrix-green)] text-2xl font-bold mb-2 text-center">
          Enter the Matrix
        </h2>
        <p className="text-gray-400 text-sm mb-6 text-center">
          Identify your team to begin the exercises
        </p>

        {error && (
          <div className="text-sm p-3 rounded mb-4 bg-[var(--matrix-red)]/10 text-[var(--matrix-red)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="teamId" className="block text-sm text-gray-300 mb-1">
              Team Code
            </label>
            <input
              id="teamId"
              type="text"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="team-01"
              className="w-full bg-[var(--matrix-dark)] border border-[var(--matrix-border)] rounded px-4 py-2.5 text-[var(--matrix-green)] placeholder-gray-600 focus:outline-none focus:border-[var(--matrix-green)] font-mono"
              autoFocus
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            disabled={!teamId.trim() || submitting}
            className="w-full bg-[var(--matrix-green)] text-black font-bold py-2.5 rounded hover:brightness-110 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {submitting ? "Joining..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
