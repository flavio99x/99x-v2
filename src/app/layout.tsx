import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontDisplay, fontMono } from "@/lib/fonts";
import { getSite } from "@/content";
import { organizationJsonLd } from "@/lib/seo";
import { isIndexable } from "@/lib/indexable";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransition } from "@/components/motion/PageTransition";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";

export const metadata: Metadata = {
  metadataBase: new URL("https://99x.io"),
  title: { default: "99x", template: "%s — 99x" },
  // robots.txt alone still lets linked URLs be listed; noindex keeps them out until launch.
  ...(isIndexable() ? {} : { robots: { index: false, follow: false } }),
};
export const viewport: Viewport = { themeColor: "#160f17" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontMono.variable}`} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(site)) }} />
        <SmoothScroll>
          <PageTransition>
            <SkipLink />
            <Header site={site} />
            <div id="page" className="relative z-[1] overflow-clip bg-paper">
              <main id="main" tabIndex={-1} className="outline-none">{children}</main>
              <Footer site={site} />
            </div>
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
