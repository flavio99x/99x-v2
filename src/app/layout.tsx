import "./globals.css";
import { fontDisplay, fontMono } from "@/lib/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
