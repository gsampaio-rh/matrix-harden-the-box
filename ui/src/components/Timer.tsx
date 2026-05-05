import { useState, useEffect, useCallback } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { api } from "../api";
import type { WsMessage, TimerState } from "../types";

export default function Timer() {
  const [endTime, setEndTime] = useState<number | null>(null);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    api
      .getTimer()
      .then((res) => {
        const t = res as TimerState & { duration_minutes?: number };
        if (t.active && t.end_time) {
          const end = new Date(t.end_time).getTime();
          const rem = Math.max(0, end - Date.now());
          setEndTime(end);
          setDurationMs(rem);
        }
      })
      .catch(() => {});
  }, []);

  const handleWs = useCallback((msg: WsMessage) => {
    if (msg.event === "timer_started") {
      const data = msg.data as { end_time: string; duration_ms: number };
      const end = new Date(data.end_time).getTime();
      setEndTime(end);
      setDurationMs(data.duration_ms || Math.max(0, end - Date.now()));
    } else if (
      msg.event === "timer_stopped" ||
      msg.event === "exercise_reset"
    ) {
      setEndTime(null);
      setDurationMs(0);
      setRemaining(0);
    }
  }, []);

  useWebSocket(handleWs);

  useEffect(() => {
    if (endTime === null) return;

    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      setRemaining(diff);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (endTime === null) return null;

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const pct = durationMs > 0 ? Math.min(100, (remaining / durationMs) * 100) : 0;
  const isExpired = remaining <= 0;
  const isUrgent = remaining > 0 && remaining < 60000;

  const barColor = isExpired
    ? "bg-[var(--matrix-red)]"
    : isUrgent
      ? "bg-[var(--matrix-yellow)]"
      : "bg-[var(--matrix-green)]";

  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <div className="h-1 bg-gray-900">
        <div
          className={`h-full ${barColor} transition-all duration-1000`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-center">
        <div
          className={`text-xs font-mono px-3 py-0.5 rounded-b ${
            isExpired
              ? "bg-[var(--matrix-red)]/20 text-[var(--matrix-red)]"
              : isUrgent
                ? "bg-[var(--matrix-yellow)]/20 text-[var(--matrix-yellow)] animate-pulse"
                : "bg-[var(--matrix-card)] text-gray-400"
          }`}
        >
          {isExpired
            ? "TIME'S UP"
            : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
        </div>
      </div>
    </div>
  );
}
