import { Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HardenConfig from "./pages/HardenConfig";
import Results from "./pages/Results";
import ConfigureExercise from "./pages/ConfigureExercise";
import ConfigureResults from "./pages/ConfigureResults";
import Scoreboard from "./pages/Scoreboard";
import Admin from "./pages/Admin";
import KataDemo from "./pages/KataDemo";
import Timer from "./components/Timer";

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-4 py-2 text-sm transition-colors ${
        active
          ? "text-[var(--matrix-green)] border-b-2 border-[var(--matrix-green)]"
          : "text-gray-400 hover:text-gray-200"
      }`}
    >
      {label}
    </Link>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Timer />

      <header className="border-b border-[var(--matrix-border)] bg-[var(--matrix-bg)]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <Link to="/" className="text-[var(--matrix-green)] font-bold text-lg tracking-wider hover:brightness-110 transition">
            THE RED MATRIX
          </Link>
          <nav className="flex gap-1">
            <NavLink to="/" label="Exercises" />
            <NavLink to="/scoreboard" label="Scoreboard" />
            <NavLink to="/kata" label="Kata" />
            <NavLink to="/admin" label="Admin" />
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/contain/exercise" element={<HardenConfig />} />
          <Route path="/contain/results" element={<Results />} />
          <Route path="/configure/exercise" element={<ConfigureExercise />} />
          <Route path="/configure/results" element={<ConfigureResults />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/kata" element={<KataDemo />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer className="border-t border-[var(--matrix-border)] py-3 text-center text-xs text-gray-600">
        The Red Matrix — Workshop Exercises
      </footer>
    </div>
  );
}
