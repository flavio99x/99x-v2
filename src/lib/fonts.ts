import { Inter_Tight, Geist_Mono } from "next/font/google";

// Stand-ins for Helvetica Now Display (700/500) and PP Supply Mono (300).
// To switch to licensed fonts, replace these with next/font/local — nothing else changes.
export const fontDisplay = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-geist-mono",
  display: "swap",
});
