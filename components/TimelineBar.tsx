"use client";

interface Props {
  start: string;
  deadline: string;
  urgency: number;
}

export default function TimelineBar({ start, deadline, urgency }: Props) {
  const total = new Date(deadline).getTime() - new Date(start).getTime();
  const elapsed = Date.now() - new Date(start).getTime();
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
  const barColor =
    urgency > 0.8 ? "#ff1e1e" : urgency > 0.5 ? "#ff9a1e" : "rgba(255,255,255,0.25)";

  return (
    <div className="w-full" style={{ maxWidth: 700, padding: "0 20px" }}>
      <div
        className="w-full overflow-hidden"
        style={{ height: 2, background: "rgba(255,255,255,0.04)", borderRadius: 1 }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: barColor,
            borderRadius: 1,
            transition: "width 1s linear, background 2s",
            boxShadow: urgency > 0.8 ? `0 0 12px ${barColor}` : "none",
          }}
        />
      </div>
      <div
        className="flex justify-between font-jetbrains"
        style={{
          marginTop: 8,
          fontSize: 10,
          color: "rgba(255,255,255,0.1)",
          letterSpacing: 1,
        }}
      >
        <span>START</span>
        <span>{Math.round(pct)}%</span>
        <span>DEADLINE</span>
      </div>
    </div>
  );
}
