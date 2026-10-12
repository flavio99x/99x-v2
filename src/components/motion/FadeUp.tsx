// src/components/motion/FadeUp.tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, DUR } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { whenNear } from "@/lib/near";

export function FadeUp({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    (context) => {
      const el = ref.current;
      const items = el?.querySelectorAll<HTMLElement>("[data-fade]");
      if (!el || !items?.length || prefersReducedMotion()) return;
      return whenNear(el, context, () => {
        gsap.set(items, { autoAlpha: 0, y: "2em" });
        ScrollTrigger.batch(items, {
          start: "top 85%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: DUR.card, ease: "power2.out", stagger: 0.08 }),
        });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
