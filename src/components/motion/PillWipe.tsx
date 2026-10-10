// src/components/motion/PillWipe.tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function PillWipe({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const pills = ref.current?.querySelectorAll("[data-pill]");
      const words = ref.current?.querySelectorAll("[data-word]");
      if (!pills?.length || !words?.length) return;
      if (prefersReducedMotion()) {
        gsap.set(pills, { width: "0%" });
        return;
      }
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 75%", once: true } });
      tl.fromTo(pills, { width: "0%" }, { width: "100%", duration: 1, stagger: 0.025 })
        .set(words, { color: "var(--color-ink)" }, 1)
        .to(pills, { width: "0%", left: "100%", duration: 1, stagger: 0.025 }, 1);
    },
    { scope: ref },
  );
  return (
    // A <p> cannot carry aria-label (generic role), so the sentence is exposed as sr-only text instead.
    <p ref={ref} className={cn("text-xxl text-center", className)}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden="true" className="relative inline-block mr-[0.2em]">
          <span data-word className="relative z-10 text-ink">{w}</span>
          <span
            data-pill
            className="absolute inset-y-[0.08em] left-0 z-20 w-0 rounded-full"
            style={{ background: "linear-gradient(90deg, var(--color-ink), var(--color-accent-deep))" }}
          />
        </span>
      ))}
    </p>
  );
}
