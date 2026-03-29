"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const PRESETS = [7, 14, 30, 60, 90];

export default function CreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState(30);
  const [focused, setFocused] = useState<string | null>(null);
  const [slugTaken, setSlugTaken] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<NodeJS.Timeout>();

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 20);

  const valid = goal.trim().length > 0 && slug.length > 0 && !slugTaken && !submitting;

  // Check slug availability
  useEffect(() => {
    if (!slug) {
      setSlugTaken(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/pledges?check=${encodeURIComponent(slug)}`);
        const data = await res.json();
        setSlugTaken(data.taken);
      } catch {
        setSlugTaken(false);
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [slug]);

  const handleSubmit = useCallback(async () => {
    if (!valid) return;
    setSubmitting(true);
    setError("");
    try {
      const deadline = new Date(Date.now() + days * 86400000).toISOString();
      const res = await fetch("/api/pledges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          goal: goal.trim(),
          author_name: name.trim(),
          deadline,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setSubmitting(false);
        return;
      }
      router.push(`/${slug}`);
    } catch {
      setError("Network error. Try again.");
      setSubmitting(false);
    }
  }, [valid, slug, goal, name, days, router]);

  const inputBase =
    "w-full font-outfit text-base text-white outline-none transition-[border-color] duration-300";

  return (
    <div className="w-full flex flex-col gap-6" style={{ maxWidth: 420 }}>
      <div>
        <label className="font-jetbrains uppercase block mb-2.5" style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.18)" }}>
          Handle
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
          placeholder="your_name"
          maxLength={20}
          className={inputBase}
          style={{
            padding: "16px 18px",
            borderRadius: 10,
            border: `1px solid ${focused === "name" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.06)"}`,
            background: "rgba(255,255,255,0.02)",
          }}
        />
        {slugTaken && slug && (
          <p className="font-jetbrains mt-2" style={{ fontSize: 11, color: "#ff1e1e" }}>
            This handle is taken
          </p>
        )}
      </div>

      <div>
        <label className="font-jetbrains uppercase block mb-2.5" style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.18)" }}>
          Your commitment
        </label>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onFocus={() => setFocused("goal")}
          onBlur={() => setFocused(null)}
          placeholder="Launch my SaaS. Run a marathon. Ship or die."
          rows={3}
          className={`${inputBase} resize-none`}
          style={{
            padding: "16px 18px",
            borderRadius: 10,
            border: `1px solid ${focused === "goal" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.06)"}`,
            background: "rgba(255,255,255,0.02)",
          }}
        />
      </div>

      <div>
        <label className="font-jetbrains uppercase block mb-2.5" style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.18)" }}>
          Deadline
        </label>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className="font-jetbrains font-bold cursor-pointer transition-all duration-200"
              style={{
                fontSize: 14,
                padding: "12px 20px",
                borderRadius: 8,
                border: days === d ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.06)",
                background: days === d ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.02)",
                color: days === d ? "#fff" : "rgba(255,255,255,0.2)",
              }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {slug && (
        <div className="font-jetbrains text-center" style={{ fontSize: 12, color: "rgba(255,255,255,0.12)" }}>
          underdog.so/<span style={{ color: "rgba(255,255,255,0.45)" }}>{slug}</span>
        </div>
      )}

      {error && (
        <p className="font-jetbrains text-center" style={{ fontSize: 12, color: "#ff1e1e" }}>
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!valid}
        className="font-bebas transition-all duration-400 mt-2"
        style={{
          fontSize: 24,
          letterSpacing: 6,
          padding: "22px 48px",
          borderRadius: 10,
          border: valid ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.04)",
          background: valid ? "#fff" : "rgba(255,255,255,0.02)",
          color: valid ? "#050505" : "rgba(255,255,255,0.08)",
          cursor: valid ? "pointer" : "not-allowed",
        }}
      >
        {submitting ? "..." : "START THE CLOCK"}
      </button>
    </div>
  );
}
