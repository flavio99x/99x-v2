"use client";
import { useEffect, useRef } from "react";
import { gsap, useGSAP, NAV_EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useLenis } from "@/components/motion/SmoothScroll";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { SmartLink } from "@/components/ui/SmartLink";
import { MenuButton } from "./MenuButton";
import { Menu } from "./Menu";
import { setMenuOpen, useUi } from "./ui-store";
import type { Link, Site } from "@/content/schema";

const FOCUSABLE = "a[href],button:not([disabled])";

/** Osmo-style nav: a dark bar (menu left, logo centre, contact right) that widens and unfolds into the menu panel.
 *  Always visible; every open/close transition is CSS keyed off `data-nav` (see globals.css). */
export function Header({ site }: { site: Site }) {
  const { menuOpen } = useUi();
  const lenis = useLenis();
  const barRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Lock page scroll while open. Lenis isn't running under reduced motion, so fall back to overflow on <html>.
  useEffect(() => {
    if (lenis) {
      if (menuOpen) lenis.stop();
      else lenis.start();
      return;
    }
    if (!menuOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => { root.style.overflow = ""; };
  }, [menuOpen, lenis]);

  const close = () => {
    setMenuOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  };

  // Focus moves into the panel on open; Escape closes; Tab cycles inside the bar.
  useEffect(() => {
    if (!menuOpen) return;
    const bar = barRef.current!;
    const focusables = () => Array.from(bar.querySelectorAll<HTMLElement>(FOCUSABLE));
    const panel = bar.querySelector<HTMLElement>("#site-menu")!;
    panel.scrollTop = 0; // a previous visit may have left the (phone) panel scrolled
    // preventScroll: the panel is still collapsed (clipped) at this point.
    panel.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const els = focusables();
        const i = els.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        const next = e.shiftKey ? (i <= 0 ? els.length - 1 : i - 1) : i === els.length - 1 ? 0 : i + 1;
        els[next]?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      data-nav={menuOpen ? "open" : "closed"}
      className="pointer-events-none fixed inset-0 z-[60]"
    >
      <div aria-hidden="true" onClick={close} className="nav-backdrop pointer-events-auto absolute inset-0 bg-charcoal/30" />
      <div className="absolute inset-x-0 top-0 flex justify-center p-3 md:p-5">
        <div
          ref={barRef}
          data-menu
          data-nav-bar
          role={menuOpen ? "dialog" : undefined}
          aria-modal={menuOpen || undefined}
          aria-label={menuOpen ? "Site menu" : undefined}
          className="nav-bar pointer-events-auto relative w-full text-paper">
          <div aria-hidden="true" className="nav-back absolute">
            <div className="absolute inset-0 rounded-[calc(var(--u)*0.375)] bg-charcoal" />
          </div>

          <div className="relative flex h-13.5 items-center justify-between p-1.75">
            <MenuButton ref={buttonRef} open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
            <TransitionLink
              href="/"
              aria-label="99x home"
              onClick={() => setMenuOpen(false)}
              className="absolute top-1/2 left-1/2 flex h-10 -translate-1/2 items-center rounded-md px-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static SVG logo, no optimisation to gain */}
              <img src="/brand/99x-logo.svg" alt="" width={74} height={38} className="w-14" />
            </TransitionLink>
            <NavCta link={site.cta} />
            <span aria-hidden="true" className="nav-line absolute bottom-0 h-px bg-paper/10" />
          </div>

          <div className="nav-panel relative grid">
            <div className="min-h-0 overflow-clip">
              <div
                id="site-menu"
                inert={!menuOpen}
                data-lenis-prevent
                className="nav-scroll max-h-[calc(100svh-var(--u)*6)] overflow-y-auto overscroll-contain p-3 md:p-6"
              >
                <Menu site={site} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/** Contact CTA with Osmo's rotate hover: the label swings away on a large wheel and its copy swings in behind it. */
function NavCta({ link }: { link: Link }) {
  // Wheel radius grows with label length so longer labels clear the button (Osmo's formula).
  const y = `${100 + 30 * (12 + 6 * link.label.length)}%`;
  const { contextSafe } = useGSAP();
  const spin = contextSafe((e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return;
    const labels = e.currentTarget.querySelectorAll(".rotate-label");
    if (gsap.isTweening(labels[0]) || gsap.isTweening(labels[1])) return;
    gsap.to(labels, {
      rotation: "+=20",
      duration: 0.5,
      ease: NAV_EASE,
      stagger: 0.075,
      onComplete: () => gsap.set(labels, { clearProps: "transform" }),
    });
  });

  return (
    <span onPointerEnter={spin} className="flex h-10">
      <SmartLink
        link={link}
        onClick={() => setMenuOpen(false)}
        className="relative flex h-full items-center overflow-hidden rounded-sm bg-accent px-4 text-ink transition-colors duration-200 hover-fine:hover:bg-paper"
      >
        <span className="relative" style={{ "--y": y } as React.CSSProperties}>
          <span className="rotate-label block text-[calc(var(--u)*1.125)] leading-none font-medium tracking-[-0.02em]">{link.label}</span>
          <span aria-hidden="true" className="rotate-label block text-[calc(var(--u)*1.125)] leading-none font-medium tracking-[-0.02em]">{link.label}</span>
        </span>
      </SmartLink>
    </span>
  );
}
