import { Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import HardenConfig from "./pages/HardenConfig";
import Results from "./pages/Results";
import Scoreboard from "./pages/Scoreboard";
import Admin from "./pages/Admin";
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
          <h1 className="text-[var(--matrix-green)] font-bold text-lg tracking-wider">
            HARDEN THE BOX
          </h1>
          <nav className="flex gap-1">
            <NavLink to="/" label="Login" />
            <NavLink to="/harden" label="Harden" />
            <NavLink to="/scoreboard" label="Scoreboard" />
            <NavLink to="/admin" label="Admin" />
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/harden" element={<HardenConfig />} />
          <Route path="/results" element={<Results />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer className="border-t border-[var(--matrix-border)] py-3 text-center text-xs text-gray-600">
        The Red Matrix — Harden the Box Exercise
      </footer>
    </div>
  );
}
