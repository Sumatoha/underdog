import CreateForm from "./CreateForm";
import ParticleField from "@/components/ParticleField";
import Scanlines from "@/components/Scanlines";
import Grain from "@/components/Grain";

export default function Home() {
  return (
    <div className="bg-bg min-h-screen relative overflow-hidden">
      <ParticleField color={[255, 255, 255]} />
      <Scanlines />
      <Grain />

      <div className="relative z-[3] flex flex-col items-center justify-center min-h-screen px-6 py-16 animate-fadeUp">
        <div className="mb-14 text-center">
          <h1
            className="font-bebas text-white leading-none tracking-[8px] m-0 animate-glitch"
            style={{ fontSize: "clamp(52px, 13vw, 100px)" }}
          >
            UNDERDOG
          </h1>
          <div
            className="font-jetbrains uppercase mt-3.5"
            style={{
              fontSize: "clamp(9px, 1.2vw, 11px)",
              color: "rgba(255,255,255,0.15)",
              letterSpacing: 6,
            }}
          >
            prove it or shut up
          </div>
        </div>

        <CreateForm />

        <p
          className="font-jetbrains uppercase text-center mt-12"
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.08)",
            maxWidth: 320,
            lineHeight: 1.8,
            letterSpacing: 1.5,
          }}
        >
          No edits. No deletes. No excuses.
          <br />
          The internet will see if you fail.
        </p>
      </div>
    </div>
  );
}
