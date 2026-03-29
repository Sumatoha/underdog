import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UNDERDOG — Prove It or Shut Up",
  description: "Make a public commitment with a ticking deadline. No edits. No deletes. No excuses.",
  metadataBase: new URL("https://underdog.so"),
  openGraph: {
    title: "UNDERDOG — Prove It or Shut Up",
    description: "Make a public commitment with a ticking deadline.",
    siteName: "Underdog",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebas.variable} ${jetbrains.variable} ${outfit.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
