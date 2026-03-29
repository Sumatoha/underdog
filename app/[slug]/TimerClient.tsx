"use client";

import { useState, useEffect, useRef } from "react";
import type { Pledge } from "@/types/pledge";
import { getTimeLeft, getUrgency } from "@/lib/time";
import { useSound } from "@/components/TickSound";
import ParticleField from "@/components/ParticleField";
import Scanlines from "@/components/Scanlines";
import Grain from "@/components/Grain";
import MassiveTimer from "@/components/MassiveTimer";
import TimelineBar from "@/components/TimelineBar";
import ShareButtons from "@/components/ShareButtons";

interface Props {
  pledge: Pledge;
}

type DisplayStatus = "active" | "done" | "failed";

export default function TimerClient({ pledge: initial }: Props) {
  const [pledge, setPledge] = useState(initial);
  const [time, setTime] = useState(getTimeLeft(pledge.deadline));
  const [showConfirm, setShowConfirm] = useState(false);
  const [completing, setCompleting] = useState(false);
  const { tick, boom, success, interacted, muted, toggleMute } = useSound();
  const prevSec = useRef(time.seconds);
  const hasBoomedRef = useRef(false);
  const hasPlayedSuccess = useRef(pledge.status === "done");

  useEffect(() => {
    const i = setInterval(() => {
      const t = getTimeLeft(pledge.deadline);
      setTime(t);

      if (t.seconds !== prevSec.current && t.total > 0 && pledge.status === "active") {
        tick();
      }
      if (t.total <= 0 && !hasBoomedRef.current && pledge.status === "active") {
        hasBoomedRef.current = true;
        boom();
      }
      prevSec.current = t.seconds;
    }, 200);
    return () => clearInterval(i);
  }, [pledge.deadline, pledge.status, tick, boom]);

  // Play success sound once on done
  useEffect(() => {
    if (pledge.status === "done" && !hasPlayedSuccess.current) {
      hasPlayedSuccess.current = true;
      success();
    }
  }, [pledge.status, success]);

  const status: DisplayStatus =
    pledge.status === "done" ? "done" : time.total <= 0 ? "failed" : "active";

  const urgency = getUrgency(pledge.created_at, pledge.deadline);

  const bgColor =
    status === "done" ? "#020d05" : status === "failed" ? "#0d0202" : "#050505";
  const particleColor: [number, number, number] =
    status === "done" ? [16, 255, 100] : status === "failed" ? [255, 30, 30] : [255, 255, 255];
  const isShaking = status === "active" && time.total > 0 && time.total < 10000;

  const shareText =
    status === "done"
      ? `I completed my goal: "${pledge.goal}" 🏆\n\nunderdog.so/${pledge.slug}`
      : status === "failed"
        ? `I failed: "${pledge.goal}" 💀\n\nunderdog.so/${pledge.slug}`
        : `I publicly committed: "${pledge.goal}"\n\nWatch me prove it or fail:\nunderdog.so/${pledge.slug}`;

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const res = await fetch("/api/pledges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: pledge.slug }),
      });
      if (res.ok) {
        setPledge({ ...pledge, status: "done", completed_at: new Date().toISOString() });
      }
    } catch {}
    setCompleting(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: bgColor }}>
      <ParticleField color={particleColor} />
      <Scanlines />
      <Grain />

      {/* Stamp overlay */}
      {status !== "active" && (
        <div
          className="fixed top-1/2 left-1/2 font-bebas pointer-events-none z-0 animate-stamp"
          style={{
            fontSize: "clamp(50px, 18vw, 180px)",
            color: status === "done" ? "#10ff64" : "#ff1e1e",
            border: `4px solid ${status === "done" ? "#10ff64" : "#ff1e1e"}`,
            padding: "4px 36px",
            borderRadius: 12,
            opacity: 0.07,
            letterSpacing: 10,
          }}
        >
          {status === "done" ? "DONE" : "FAILED"}
        </div>
      )}

      <div
        className={`relative z-[3] flex flex-col items-center justify-center min-h-screen px-4 py-10 ${isShaking ? "animate-shake" : "animate-fadeUp"}`}
      >
        {/* URL + mute */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="font-jetbrains uppercase"
            style={{
              fontSize: "clamp(9px, 1.3vw, 12px)",
              color: "rgba(255,255,255,0.12)",
              letterSpacing: 4,
            }}
          >
            underdog.so/{pledge.slug}
          </div>
          <button
            onClick={toggleMute}
            className="font-jetbrains cursor-pointer transition-all duration-200 hover:text-white/40"
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.15)",
              background: "none",
              border: "none",
              padding: 0,
            }}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>

        {/* Goal */}
        <h1
          className="font-outfit font-extrabold text-white text-center m-0 mb-1.5"
          style={{
            fontSize: "clamp(20px, 4vw, 40px)",
            maxWidth: 750,
            lineHeight: 1.25,
            letterSpacing: -0.5,
          }}
        >
          &ldquo;{pledge.goal}&rdquo;
        </h1>

        <p
          className="font-jetbrains m-0"
          style={{
            fontSize: "clamp(10px, 1.2vw, 13px)",
            color: "rgba(255,255,255,0.18)",
            marginBottom: "clamp(28px, 5vw, 56px)",
          }}
        >
          by <span style={{ color: "rgba(255,255,255,0.4)" }}>{pledge.author_name}</span>
        </p>

        {/* ACTIVE STATE */}
        {status === "active" && (
          <>
            <MassiveTimer
              days={time.days}
              hours={time.hours}
              minutes={time.minutes}
              seconds={time.seconds}
              urgency={urgency}
            />

            <div className="w-full flex justify-center" style={{ marginTop: "clamp(28px, 4vw, 48px)" }}>
              <TimelineBar start={pledge.created_at} deadline={pledge.deadline} urgency={urgency} />
            </div>

            <div style={{ marginTop: "clamp(32px, 4vw, 48px)" }}>
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="font-bebas cursor-pointer transition-all duration-300 hover:bg-[rgba(16,255,100,0.08)] hover:border-[rgba(16,255,100,0.3)] hover:text-green-neon"
                  style={{
                    fontSize: 18,
                    letterSpacing: 4,
                    padding: "16px 44px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  I DID IT ✓
                </button>
              ) : (
                <div className="flex flex-col items-center gap-4 animate-fadeUp">
                  <p className="font-jetbrains" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>
                    No going back. Did you actually do it?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleComplete}
                      disabled={completing}
                      className="font-bebas cursor-pointer"
                      style={{
                        fontSize: 18,
                        letterSpacing: 3,
                        padding: "14px 32px",
                        borderRadius: 10,
                        border: "none",
                        background: "#10ff64",
                        color: "#050505",
                      }}
                    >
                      {completing ? "..." : "YES, DONE"}
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="font-bebas cursor-pointer"
                      style={{
                        fontSize: 18,
                        letterSpacing: 3,
                        padding: "14px 32px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "transparent",
                        color: "rgba(255,255,255,0.25)",
                      }}
                    >
                      NOT YET
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* DONE STATE */}
        {status === "done" && (
          <div className="flex flex-col items-center gap-3 animate-fadeUp">
            <div
              className="font-bebas leading-none animate-pulse-glow"
              style={{
                fontSize: "clamp(80px, 22vw, 220px)",
                color: "#10ff64",
                textShadow: "0 0 80px rgba(16,255,100,0.4)",
              }}
            >
              ✓
            </div>
            <p className="font-outfit font-extrabold text-green-neon" style={{ fontSize: "clamp(20px, 4vw, 36px)" }}>
              PROVED THEM WRONG
            </p>
            <p className="font-jetbrains" style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              {pledge.author_name} did what they said they&apos;d do
            </p>
          </div>
        )}

        {/* FAILED STATE */}
        {status === "failed" && (
          <div className="flex flex-col items-center gap-3 animate-fadeUp">
            <div
              className="font-bebas leading-none"
              style={{
                fontSize: "clamp(80px, 22vw, 220px)",
                color: "#ff1e1e",
                textShadow: "0 0 100px rgba(255,30,30,0.5)",
              }}
            >
              ✗
            </div>
            <p className="font-outfit font-extrabold text-red-neon" style={{ fontSize: "clamp(20px, 4vw, 36px)" }}>
              TIME&apos;S UP
            </p>
            <p className="font-jetbrains" style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              {pledge.author_name} didn&apos;t make it — this page stays forever
            </p>
          </div>
        )}

        <ShareButtons slug={pledge.slug} shareText={shareText} />
      </div>
    </div>
  );
}
