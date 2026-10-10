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
      if (busy.current || href === pathname) return;
      busy.current = true;
      const variant = opts?.variant ?? "fade";
      pending.current = variant;
      setMenuOpen(false);
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
    setArrivedVia(variant);
    if (!window.location.hash) {
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    ScrollTrigger.refresh();
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
