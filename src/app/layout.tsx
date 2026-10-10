import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontDisplay, fontMono } from "@/lib/fonts";
import { getSite } from "@/content";
import { organizationJsonLd } from "@/lib/seo";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransition } from "@/components/motion/PageTransition";
import { Header } from "@/components/layout/Header";
import { Menu } from "@/components/layout/Menu";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { SkipLink } from "@/components/layout/SkipLink";

export const metadata: Metadata = {
  metadataBase: new URL("https://99x.io"),
  title: { default: "99x", template: "%s — 99x" },
};
export const viewport: Viewport = { themeColor: "#160f17" };

// Hides the loader before first paint on repeat visits in the same session, and for no-JS users.
const loaderGate = `try{if(sessionStorage.getItem('99x-loaded')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.loaded='1'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderGate }} />
        <style>{`html[data-loaded="1"] [data-loader]{display:none}`}</style>
        <noscript><style>{`[data-loader]{display:none}`}</style></noscript>
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(site)) }} />
        <SmoothScroll>
          <PageTransition>
            <SkipLink />
            <Loader />
            <Header />
            <Menu site={site} />
            <div id="page" className="relative z-[1] origin-top overflow-clip bg-paper">
              <main id="main" tabIndex={-1} className="outline-none">{children}</main>
              <Footer site={site} />
            </div>
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
