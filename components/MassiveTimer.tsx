"use client";

import { useState, useEffect } from "react";
import { pad } from "@/lib/time";

interface DigitProps {
  value: number;
  label: string;
  urgency: number;
}

function MassiveDigit({ value, label, urgency }: DigitProps) {
  const glow =
    urgency > 0.8
      ? "rgba(255,30,30,0.35)"
      : urgency > 0.5
        ? "rgba(255,160,30,0.15)"
        : "rgba(255,255,255,0.03)";

  return (
    <div className="flex flex-col items-center">
      <div
        className="font-bebas leading-none tracking-wide transition-[text-shadow] duration-500"
        style={{
          fontSize: "clamp(56px, 14vw, 160px)",
          color: "#fff",
          textShadow: `0 0 60px ${glow}, 0 0 120px ${glow}`,
        }}
      >
        {pad(value)}
      </div>
      <span
        className="font-jetbrains uppercase"
        style={{
          fontSize: "clamp(8px, 1.1vw, 11px)",
          letterSpacing: 4,
          color: "rgba(255,255,255,0.15)",
          marginTop: 4,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Colon({ urgency }: { urgency: number }) {
  const [on, setOn] = useState(true);

  useEffect(() => {
    const i = setInterval(() => setOn((v) => !v), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      className="font-bebas leading-none select-none transition-opacity duration-300"
      style={{
        fontSize: "clamp(40px, 10vw, 120px)",
        color: urgency > 0.8 ? "rgba(255,30,30,0.4)" : "rgba(255,255,255,0.1)",
        opacity: on ? 1 : 0.15,
        paddingBottom: "clamp(14px, 2vw, 22px)",
      }}
    >
      :
    </div>
  );
}

interface Props {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  urgency: number;
}

export default function MassiveTimer({ days, hours, minutes, seconds, urgency }: Props) {
  return (
    <div
      className="flex items-start justify-center"
      style={{ gap: "clamp(4px, 1.5vw, 20px)" }}
    >
      <MassiveDigit value={days} label="Days" urgency={urgency} />
      <Colon urgency={urgency} />
      <MassiveDigit value={hours} label="Hrs" urgency={urgency} />
      <Colon urgency={urgency} />
      <MassiveDigit value={minutes} label="Min" urgency={urgency} />
      <Colon urgency={urgency} />
      <MassiveDigit value={seconds} label="Sec" urgency={urgency} />
    </div>
  );
}
