// src/components/motion/ScrubText.tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { whenNear } from "@/lib/near";

type Props = { as?: "p" | "h2" | "div"; text: string; className?: string };

export function ScrubText({ as: Tag = "p", text, className }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (context) => {
      if (!ref.current || prefersReducedMotion()) return;
      const el = ref.current;
      return whenNear(el, context, () => {
        let tweens: gsap.core.Tween[] = [];
        // autoSplit re-splits on resize/font load; kill the previous tweens each time.
        const split = SplitText.create(el, {
          type: "lines,words,chars",
          aria: "auto",
          autoSplit: true,
          charsClass: "split-char",
          onSplit(self) {
            tweens.forEach((t) => t.kill());
            tweens = self.lines.map((line) =>
              gsap.fromTo(
                line.querySelectorAll(".split-char"),
                { opacity: 0.2 },
                { opacity: 1, ease: "none", stagger: 0.02, scrollTrigger: { trigger: line, start: "top 85%", end: "top 50%", scrub: true } },
              ),
            );
          },
        });
        return () => {
          tweens.forEach((t) => t.kill());
          split.revert();
        };
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {text}
    </Tag>
  );
}
