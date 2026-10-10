"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import type { NumberedListSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Button } from "@/components/ui/Button";
import { TickRuler } from "@/components/ui/TickRuler";
import { gsap, useGSAP, ScrollTrigger, DUR } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { whenNear } from "@/lib/near";

export function NumberedList({ section: s }: { section: T }) {
  const ref = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP((context) => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    return whenNear(el, context, () => {
      // Reveal (hidden -> full contrast) rather than a dimmed scrub, so no text ever rests at low contrast.
      el.querySelectorAll("li").forEach((li) =>
        gsap.fromTo(li, { autoAlpha: 0, y: "1em" }, { autoAlpha: 1, y: 0, duration: DUR.card, ease: "power2.out", scrollTrigger: { trigger: li, start: "top 85%", once: true } }),
      );
      ScrollTrigger.create({ trigger: el, start: "top 80%", end: "bottom 55%", onUpdate: (self) => setProgress(self.progress) });
    });
  }, { scope: ref });

  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div className="grid-12 gap-y-12">
        {s.image && (
          <div className="col-span-12 lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md lg:sticky lg:top-24">
              <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 992px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
        )}
        <div className={s.image ? "col-span-12 lg:col-span-6 lg:col-start-7" : "col-span-12 lg:col-span-8 lg:col-start-5"}>
          <div className="mb-8 h-6 text-current"><TickRuler orientation="horizontal" count={48} progress={progress} /></div>
          <ol ref={ref} className="flex flex-col">
            {s.items.map((it, i) => (
              <li key={it.title} className="grid grid-cols-[calc(var(--u)*4)_1fr] gap-4 border-t border-current/20 py-8">
                <span className="font-mono text-eyebrow-m font-light">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-card">{it.title}</h3>
                  {it.description && <p className="text-body-s opacity-70">{it.description}</p>}
                </div>
              </li>
            ))}
          </ol>
          {s.link && <div className="mt-12"><Button link={s.link} variant={s.theme === "dark" ? "light" : "dark"} /></div>}
        </div>
      </div>
    </SectionShell>
  );
}
