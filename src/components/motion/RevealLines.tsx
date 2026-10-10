// src/components/motion/RevealLines.tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, DUR } from "@/lib/gsap";
import { onLoaderDone } from "@/lib/loader";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Props = {
  as?: "h1" | "h2" | "p" | "div";
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  waitForLoader?: boolean;
};

export function RevealLines({ as: Tag = "h1", lines, className, lineClassName, delay = 0, waitForLoader = false }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const inner = ref.current?.querySelectorAll("[data-line-inner]");
      if (!inner?.length) return;
      if (prefersReducedMotion()) {
        gsap.set(inner, { yPercent: 0 });
        return;
      }
      gsap.set(inner, { yPercent: 110 });
      const play = () => gsap.to(inner, { yPercent: 0, duration: DUR.reveal, stagger: 0.03, delay });
      if (waitForLoader) return onLoaderDone(play);
      play();
    },
    { scope: ref },
  );

  return (
    // aria-label keeps the sentence intact for screen readers; visual lines are aria-hidden.
    <Tag ref={ref as never} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, i) => (
        <span key={i} className={cn("mask-line", lineClassName)} aria-hidden="true">
          <span data-line-inner className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
