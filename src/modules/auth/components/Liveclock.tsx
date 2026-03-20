import React, { useState, useEffect } from "react";

const LiveClock: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const secs = String(now.getSeconds()).padStart(2, "0");
  const date = now.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between py-4 px-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-black text-white tracking-tight tabular-nums">
          {time}
        </span>
        <span className="text-xs font-bold text-white/25 tabular-nums">
          :{secs}
        </span>
      </div>
      <span className="text-xs font-semibold text-white/30">{date}</span>
    </div>
  );
};

export default LiveClock;
