export default function Scanlines() {
  return (
    <div
      className="fixed inset-0 z-[2] pointer-events-none opacity-30"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
      }}
    />
  );
}
