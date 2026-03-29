import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ["var(--font-bebas)", "sans-serif"],
        jetbrains: ["var(--font-jetbrains)", "monospace"],
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        green: { neon: "#10ff64" },
        red: { neon: "#ff1e1e" },
        bg: "#050505",
      },
    },
  },
  plugins: [],
};
export default config;
