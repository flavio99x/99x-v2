"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import type { TimelineSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { SectionTag } from "@/components/ui/SectionTag";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { timelineIndex } from "@/lib/cylinder";

export function Timeline({ section: s }: { section: T }) {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    if (reduced || !stage.current) return;
    ScrollTrigger.create({
      trigger: stage.current,
      start: "top top",
      end: `+=${s.items.length * 100}%`,
      pin: true,
      onUpdate: (self) => setActive(timelineIndex(self.progress, s.items.length)),
    });
  }, { dependencies: [reduced], scope: stage, revertOnUpdate: true });

  useGSAP(() => {
    if (!stage.current) return;
    stage.current.querySelectorAll<HTMLElement>("[data-digit-col]").forEach((col) =>
      gsap.to(col, { yPercent: (-100 / s.items.length) * active, duration: reduced ? 0 : 0.8 }),
    );
  }, { dependencies: [active, reduced], scope: stage });

  if (reduced) {
    return (
      <SectionShell theme="dark" head={s.head} id={s.id}>
        <ol className="flex flex-col">
          {s.items.map((it) => (
            <li key={it.year + it.title} className="grid grid-cols-[calc(var(--u)*6)_1fr] gap-4 border-t border-paper/20 py-6">
              <span className="font-mono text-eyebrow-m font-light">{it.year}</span>
              <span className="text-body-m">{it.title}</span>
            </li>
          ))}
        </ol>
      </SectionShell>
    );
  }

  return (
    <SectionShell theme="dark" id={s.id} bottom="none" className="px-0! pt-0!">
      {/* Stable React-owned wrapper: GSAP's pin-spacer only wraps the inner stage, so switching to the
          reduced-motion branch removes this wrapper (parent untouched) instead of the re-parented stage. */}
      <div>
        <div ref={stage} className="relative h-svh overflow-hidden">
          <h2 className="sr-only">{s.head.label}</h2>
          <div className="absolute left-[var(--site-margin)] top-28 z-10"><SectionTag index={s.head.index} label={s.head.label} tone="light" /></div>
          {s.items.map((it, i) => (
            <Image key={it.image.src} src={it.image.src} alt={i === active ? it.image.alt : ""} fill sizes="100vw"
              className="object-cover transition-opacity duration-700 ease-house" style={{ opacity: i === active ? 0.55 : 0 }} />
          ))}
          <div aria-hidden="true" className="absolute inset-0 grid grid-cols-4 items-center site-x text-[calc(var(--u)*14)] leading-none max-md:text-[calc(var(--u)*6)]">
            {[0, 1, 2, 3].map((pos) => (
              <div key={pos} className="h-[1em] overflow-hidden text-center">
                <div data-digit-col>
                  {s.items.map((it) => <div key={it.year + pos + it.title} className="h-[1em]">{it.year[pos]}</div>)}
                </div>
              </div>
            ))}
          </div>
          <ol className="absolute inset-x-0 bottom-16 flex flex-col items-center text-center site-x">
            {s.items.map((it, i) => (
              <li key={it.year + it.title} className={i === active ? "block" : "sr-only"}>
                <span className="sr-only">{it.year}: </span>
                <span className="text-body-m">{it.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionShell>
  );
}
