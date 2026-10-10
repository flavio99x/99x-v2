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
        className={cn("pointer-events-auto flex items-stretch transition-transform duration-500 ease-house", hidden && "-translate-x-[9em]")}
      >
        <span className={cn("grid size-12 place-items-center rounded-md", light ? "bg-paper" : "bg-ink")}>
          {/* colour logo on paper tile / white logo on ink tile */}
          <img src={light ? "/brand/99x-logo.svg" : "/brand/99x-logo-white.svg"} alt="" width={32} height={16} className="w-8" />
        </span>
      </TransitionLink>
      <div className={cn("pointer-events-auto transition-transform duration-500 ease-house", hidden && "translate-x-[9em]")}>
        <MenuButton ref={buttonRef} open={menuOpen} tone={light ? "light" : "dark"} onClick={() => setMenuOpen(!menuOpen)} />
      </div>
    </header>
  );
}
