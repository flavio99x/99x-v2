"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, HOUSE_EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useLenis } from "./SmoothScroll";
import { setMenuOpen } from "@/components/layout/ui-store";

type Variant = "fade" | "next";
type Ctx = { navigate: (href: string, opts?: { variant?: Variant; from?: HTMLElement }) => Promise<void>; arrivedVia: Variant | null };

const TransitionContext = createContext<Ctx>({ navigate: async () => {}, arrivedVia: null });
export const usePageTransition = () => useContext(TransitionContext);

/** Scrolls to the element a URL hash points at, clear of the fixed header. Returns false if there is no target. */
function scrollToHash(hash: string, lenis: ReturnType<typeof useLenis>): boolean {
  if (!hash || hash === "#") return false;
  let el: HTMLElement | null = null;
  try {
    el = document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return false;
  }
  if (!el) return false;
  const offset = -(document.querySelector("header")?.getBoundingClientRect().bottom ?? 0);
  if (lenis) {
    lenis.resize(); // the new page's height may not be measured yet
    lenis.scrollTo(el, { immediate: true, force: true, offset });
  } else {
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + offset);
  }
  return true;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const overlay = useRef<HTMLDivElement>(null);
  const pending = useRef<Variant | null>(null);
  const [arrivedVia, setArrivedVia] = useState<Variant | null>(null);
  const busy = useRef(false);

  const navigate = useCallback<Ctx["navigate"]>(
    async (href, opts) => {
      if (busy.current) return;
      setMenuOpen(false); // also when the link points at the current page
      if (href === pathname) return;
      // Same path, different query/hash: the pathname effect below won't fire to reset busy/overlay, so skip the transition.
      const target = new URL(href, window.location.href);
      if (target.pathname === pathname) {
        router.push(href, { scroll: false });
        if (target.hash) requestAnimationFrame(() => scrollToHash(target.hash, lenis));
        return;
      }
      busy.current = true;
      const variant = opts?.variant ?? "fade";
      pending.current = variant;
      const reduced = prefersReducedMotion();
      if (!reduced) {
        if (variant === "next" && opts?.from) {
          // Scroll the NextPage panel to the top so it becomes the next hero.
          await new Promise<void>((resolve) => {
            if (lenis) lenis.scrollTo(opts.from!, { duration: 1, easing: (t) => 1 - Math.pow(1 - t, 4), onComplete: () => resolve() });
            else { opts.from!.scrollIntoView({ behavior: "smooth" }); setTimeout(resolve, 900); }
          });
        } else {
          await gsap.to(overlay.current, { autoAlpha: 1, duration: 0.6, ease: HOUSE_EASE });
        }
      }
      router.push(href, { scroll: false });
    },
    [lenis, pathname, router],
  );

  // Enter phase: runs after the new route has rendered.
  useEffect(() => {
    const variant = pending.current;
    pending.current = null;
    busy.current = false;
    setMenuOpen(false); // also covers browser back/forward, which bypasses navigate()
    setArrivedVia(variant);
    // router.push(..., { scroll: false }) suppresses Next's own hash scrolling, so land on the target ourselves.
    const hash = window.location.hash;
    if (hash) {
      ScrollTrigger.refresh(); // pin spacers must exist before the target's offset is measured
      if (!scrollToHash(hash, lenis)) {
        lenis?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
      }
    } else {
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }
    if (!overlay.current) return;
    if (variant === "fade") gsap.to(overlay.current, { autoAlpha: 0, duration: 0.6, ease: HOUSE_EASE, delay: 0.05 });
    else gsap.set(overlay.current, { autoAlpha: 0 });
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TransitionContext.Provider value={{ navigate, arrivedVia }}>
      {children}
      <div ref={overlay} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[70] bg-ink opacity-0" />
    </TransitionContext.Provider>
  );
}
