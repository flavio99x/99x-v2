// src/components/motion/FadeUp.tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, DUR } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

export function FadeUp({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const items = ref.current?.querySelectorAll<HTMLElement>("[data-fade]");
      if (!items?.length || prefersReducedMotion()) return;
      gsap.set(items, { autoAlpha: 0, y: "2em" });
      ScrollTrigger.batch(items, {
        start: "top 85%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: DUR.card, ease: "power2.out", stagger: 0.08 }),
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
