"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AudioCtx = AudioContext & { webkitAudioContext?: typeof AudioContext };

function getCtx(ref: React.MutableRefObject<AudioContext | null>): AudioContext {
  if (!ref.current) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ref.current = new Ctor();
  }
  return ref.current;
}

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const handler = () => setInteracted(true);
    window.addEventListener("click", handler, { once: true });
    window.addEventListener("touchstart", handler, { once: true });
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const tick = useCallback(() => {
    if (!interacted || muted) return;
    try {
      const ctx = getCtx(ctxRef);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }, [interacted, muted]);

  const boom = useCallback(() => {
    if (!interacted || muted) return;
    try {
      const ctx = getCtx(ctxRef);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 150;
      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
    } catch {}
  }, [interacted, muted]);

  const success = useCallback(() => {
    if (!interacted || muted) return;
    try {
      const ctx = getCtx(ctxRef);
      [440, 554, 659, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        const t = ctx.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
      });
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300]);
    } catch {}
  }, [interacted]);

  return { tick, boom, success, interacted, muted, toggleMute };
}
