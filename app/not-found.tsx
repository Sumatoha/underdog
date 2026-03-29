import Scanlines from "@/components/Scanlines";
import Grain from "@/components/Grain";

export default function NotFound() {
  return (
    <div className="bg-bg min-h-screen relative overflow-hidden flex flex-col items-center justify-center">
      <Scanlines />
      <Grain />
      <div className="relative z-[3] text-center">
        <h1
          className="font-bebas text-white leading-none"
          style={{ fontSize: "clamp(60px, 15vw, 140px)", letterSpacing: 6 }}
        >
          404
        </h1>
        <p className="font-jetbrains mt-4" style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", letterSpacing: 2 }}>
          THIS PAGE DOESN&apos;T EXIST
        </p>
        <a
          href="/"
          className="font-jetbrains inline-block mt-8 no-underline transition-all duration-200 hover:border-white/20 hover:text-white/50"
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
          GO BACK
        </a>
      </div>
    </div>
  );
}
