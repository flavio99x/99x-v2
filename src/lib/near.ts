// src/lib/near.ts
"use client";
import type { gsap } from "gsap";

type Cleanup = void | (() => void);

/**
 * Runs `setup` once `el` comes within `rootMargin` of the viewport (default: one screen away), inside the
 * given GSAP context so everything it creates is still reverted on unmount. Keeps per-section motion setup
 * (SplitText measuring, ScrollTrigger creation — both force layout) out of the hydration task, while
 * sections are still fully prepared before they can be seen.
 * Returns a cleanup for useGSAP.
 */
export function whenNear(el: Element, context: gsap.Context, setup: () => Cleanup, rootMargin = "100% 0px"): () => void {
  let cleanup: Cleanup;
  let done = false;
  const io = new IntersectionObserver(
    (entries) => {
      if (done || !entries.some((e) => e.isIntersecting)) return;
      done = true;
      io.disconnect();
      if (!context.isReverted) cleanup = context.add(setup);
    },
    { rootMargin },
  );
  io.observe(el);
  return () => {
    done = true;
    io.disconnect();
    cleanup?.();
  };
}
