"use client";
import { useEffect, useRef } from "react";
import { gsap, useGSAP, HOUSE_EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { setMenuOpen, useUi } from "./ui-store";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Site } from "@/content/schema";

export function Menu({ site }: { site: Site }) {
  const { menuOpen } = useUi();
  const ref = useRef<HTMLDivElement>(null);

  // Page shell drops down and insets (desktop) — cominvi signature.
  useGSAP(
    () => {
      const page = document.getElementById("page");
      if (!page) return;
      const desktop = window.matchMedia("(min-width: 992px)").matches;
      const reduced = prefersReducedMotion();
      const d = reduced ? 0 : 1.2;
      // Kill pending open/close tweens so a quick reopen isn't hidden by the previous close's delayed tween.
      gsap.killTweensOf([ref.current, page]);
      if (menuOpen) {
        gsap.set(ref.current, { visibility: "visible" });
        if (desktop) gsap.to(page, { y: () => ref.current!.querySelector("[data-menu-inner]")!.clientHeight, scale: 0.96, borderRadius: "calc(var(--u) * 0.5)", duration: d, ease: HOUSE_EASE });
        // opacity, not autoAlpha: items must stay focusable so focus can move into the dialog on open.
        gsap.fromTo(ref.current!.querySelectorAll("[data-menu-item]"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.03, duration: reduced ? 0 : 0.8, ease: HOUSE_EASE, delay: reduced ? 0 : 0.2 });
      } else {
        gsap.to(page, { y: 0, scale: 1, borderRadius: 0, duration: d, ease: HOUSE_EASE, clearProps: "transform,borderRadius" });
        gsap.to(ref.current, { visibility: "hidden", delay: d });
      }
    },
    { dependencies: [menuOpen] },
  );

  // Focus management + Escape + focus trap.
  useEffect(() => {
    if (!menuOpen) return;
    const root = ref.current!;
    const focusables = () => Array.from(root.querySelectorAll<HTMLElement>("a,button")).concat(
      Array.from(document.querySelectorAll<HTMLElement>("header button[aria-controls='site-menu']")),
    );
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        document.querySelector<HTMLElement>("header button[aria-controls='site-menu']")?.focus();
      }
      if (e.key === "Tab") {
        const els = focusables();
        const i = els.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        const next = e.shiftKey ? (i <= 0 ? els.length - 1 : i - 1) : (i === els.length - 1 ? 0 : i + 1);
        els[next]?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div
      ref={ref}
      id="site-menu"
      data-menu
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="invisible fixed inset-0 z-[55] bg-ink text-paper lg:bottom-auto"
    >
      <div data-menu-inner className="site-x grid min-h-svh grid-cols-1 content-end gap-12 pt-32 pb-12 lg:min-h-0 lg:grid-cols-12 lg:gap-4 lg:pt-32 lg:pb-16">
        <nav aria-label="Main" className="contents">
          {site.nav.map((group) => (
            <div key={group.label} className="flex flex-col gap-3 lg:col-span-3">
              <Eyebrow className="text-paper/50" data-menu-item>{group.label}</Eyebrow>
              {group.links.map((l) => (
                <span key={l.href} className="mask-line -mb-[0.15em] pb-[0.15em] text-menu">
                  {/* GSAP animates the wrapper; the hover offset lives on the inner span (GSAP would otherwise reset its CSS `translate`). */}
                  <span data-menu-item className="block">
                    <SmartLink link={l} onClick={() => setMenuOpen(false)} className="group/ml flex items-center gap-3 text-menu">
                      <span className="flex items-center gap-3 -translate-x-9 transition-transform duration-500 ease-house group-hover/ml:translate-x-0 group-focus-visible/ml:translate-x-0">
                        <Icon name="arrow" className="size-6 text-accent" />
                        {l.label}
                      </span>
                    </SmartLink>
                  </span>
                </span>
              ))}
            </div>
          ))}
        </nav>
        <div className="flex flex-col justify-between gap-8 lg:col-span-3" data-menu-item>
          <div className="flex gap-4 font-mono text-eyebrow-m font-light uppercase">
            {site.languages.map((lang) => (
              <SmartLink key={lang.code} link={{ label: lang.label, href: lang.href, external: lang.href.startsWith("https://") }} className={lang.active ? "text-accent" : "text-paper/60"} />
            ))}
          </div>
          <div className="flex gap-4">
            {site.socials.map((s) => (
              <a key={s.href} href={s.href} rel="noopener" aria-label={s.label} className="opacity-80 hover:opacity-100"><Icon name={s.icon} /></a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
