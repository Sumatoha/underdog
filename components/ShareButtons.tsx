"use client";

import { useState } from "react";

interface Props {
  slug: string;
  shareText: string;
}

export default function ShareButtons({ slug, shareText }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`underdog.so/${slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex gap-2.5 flex-wrap justify-center" style={{ marginTop: "clamp(36px, 5vw, 56px)" }}>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-jetbrains font-bold cursor-pointer transition-all duration-200 no-underline hover:border-white/20 hover:text-white/50"
        style={{
          fontSize: 10,
          letterSpacing: 2,
          padding: "13px 24px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        SHARE ON 𝕏
      </a>
      <button
        onClick={copy}
        className="font-jetbrains font-bold cursor-pointer transition-all duration-200 hover:border-white/20 hover:text-white/50"
        style={{
          fontSize: 10,
          letterSpacing: 2,
          padding: "13px 24px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        {copied ? "COPIED ✓" : "COPY LINK"}
      </button>
    </div>
  );
}
