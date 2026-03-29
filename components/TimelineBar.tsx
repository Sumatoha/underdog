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
    urgency > 0.8 ? "#ff1e1e" : urgency > 0.5 ? "#ff9a1e" : "rgba(255,255,255,0.5)";

  return (
    <div className="w-full" style={{ maxWidth: 700, padding: "0 20px" }}>
      {/* Track */}
      <div
        className="w-full overflow-hidden relative"
        style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}
      >
        {/* Fill */}
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: barColor,
            borderRadius: 3,
            transition: "width 1s linear, background 2s",
            boxShadow: `0 0 ${urgency > 0.8 ? 16 : urgency > 0.5 ? 8 : 4}px ${barColor}`,
          }}
        />
        {/* Tick marks at 25/50/75 */}
        {[25, 50, 75].map((mark) => (
          <div
            key={mark}
            style={{
              position: "absolute",
              left: `${mark}%`,
              top: 0,
              width: 1,
              height: "100%",
              background: "rgba(255,255,255,0.06)",
            }}
          />
        ))}
      </div>

      {/* Labels */}
      <div
        className="flex justify-between font-jetbrains uppercase"
        style={{
          marginTop: 10,
          fontSize: 10,
          letterSpacing: 2,
          color: "rgba(255,255,255,0.2)",
        }}
      >
        <span>START</span>
        <span
          style={{
            color: urgency > 0.8 ? "rgba(255,30,30,0.6)" : urgency > 0.5 ? "rgba(255,154,30,0.5)" : "rgba(255,255,255,0.35)",
            fontWeight: 700,
          }}
        >
          {Math.round(pct)}%
        </span>
        <span>DEADLINE</span>
      </div>
    </div>
  );
}
