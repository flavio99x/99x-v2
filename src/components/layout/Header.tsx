"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/components/motion/SmoothScroll";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { MenuButton } from "./MenuButton";
import { setHeaderHidden, setHeaderTheme, setMenuOpen, useUi } from "./ui-store";
import { cn } from "@/lib/cn";
import type { Theme } from "@/content/schema";

export function Header() {
  const { menuOpen, headerTheme, headerHidden } = useUi();
  const pathname = usePathname();
  const lenis = useLenis();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastY = useRef(0);

  // Theme follows the section under the header.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]"));
    const triggers = sections.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 40px",
        end: "bottom 40px",
        onToggle: (self) => self.isActive && setHeaderTheme(el.dataset.theme as Theme),
      }),
    );
    if (sections[0]) setHeaderTheme(sections[0].dataset.theme as Theme);
    return () => triggers.forEach((t) => t.kill());
  }, [pathname]);

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) < 4) return;
      setHeaderHidden(y > lastY.current && y > 200);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) lenis?.stop();
    else lenis?.start();
  }, [menuOpen, lenis]);

  const light = menuOpen || headerTheme === "dark";
  const hidden = headerHidden && !menuOpen;

  return (
    <header className={cn("pointer-events-none fixed inset-x-0 top-6 z-[60] flex justify-between site-x", light ? "text-paper" : "text-ink")}>
      <TransitionLink
        href="/"
        aria-label="99x home"
        className={cn("pointer-events-auto flex h-12 items-stretch transition-transform duration-500 ease-house", hidden && "-translate-x-[14em]")}
      >
        {/* Logo pill: colour logo on a contrasting tile + outlined wordmark box (cominvi header lockup). */}
        <span className={cn("grid w-16 place-items-center rounded-md", light ? "bg-paper" : "bg-ink")}>
          <img src="/brand/99x-logo.svg" alt="" width={74} height={38} className="w-11" />
        </span>
        <span className={cn("-ml-px grid place-items-center rounded-md border px-4 text-body-m tracking-[-0.02em]", light ? "border-paper" : "border-ink")}>
          99x
        </span>
      </TransitionLink>
      <div className={cn("pointer-events-auto transition-transform duration-500 ease-house", hidden && "translate-x-[9em]")}>
        <MenuButton ref={buttonRef} open={menuOpen} tone={light ? "light" : "dark"} onClick={() => setMenuOpen(!menuOpen)} />
      </div>
    </header>
  );
}
