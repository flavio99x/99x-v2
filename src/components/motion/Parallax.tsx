// src/components/motion/Parallax.tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function Parallax({ children, className, amount = 10 }: { children: React.ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const inner = ref.current?.firstElementChild;
      if (!inner || prefersReducedMotion()) return;
      gsap.fromTo(
        inner,
        { yPercent: -amount },
        { yPercent: amount, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-[-10%] h-[120%] w-[120%] will-change-transform">{children}</div>
    </div>
  );
}
