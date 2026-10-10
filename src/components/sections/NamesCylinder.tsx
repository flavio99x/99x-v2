"use client";
import { useRef } from "react";
import type { NamesCylinderSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { TickRuler } from "@/components/ui/TickRuler";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { cylinderItem } from "@/lib/cylinder";

export function NamesCylinder({ section: s }: { section: T }) {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reduced || !stage.current) return;
    const items = Array.from(stage.current.querySelectorAll<HTMLElement>("[data-name]"));
    // gsap cannot parse calc()/var(), so resolve the fluid unit to px and re-resolve on every refresh.
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;width:var(--u)";
    stage.current.appendChild(probe);
    let radius = probe.offsetWidth * 14;
    let focus = 0;
    const apply = (f: number) => {
      focus = f;
      items.forEach((el, i) => {
        const { angle, opacity, visible } = cylinderItem(i, f);
        gsap.set(el, { rotateX: -angle, z: radius, opacity, visibility: visible ? "visible" : "hidden", transformOrigin: `50% 50% ${-radius}px` });
      });
    };
    apply(0);
    ScrollTrigger.create({
      trigger: stage.current,
      start: "top top",
      end: `+=${s.names.length * 15}%`,
      pin: true,
      scrub: true,
      onUpdate: (self) => apply(self.progress * (s.names.length - 1)),
      onRefresh: () => { radius = probe.offsetWidth * 14; apply(focus); },
    });
    return () => probe.remove();
  }, { dependencies: [reduced], scope: stage, revertOnUpdate: true });

  if (reduced) {
    return (
      <SectionShell theme={s.theme} head={s.head} id={s.id}>
        <ul className="columns-2 gap-4 text-h2 md:columns-3">
          {s.names.map((n) => <li key={n} className="break-inside-avoid py-1">{n}</li>)}
        </ul>
      </SectionShell>
    );
  }

  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id} bottom="md">
      {/* Stable React-owned wrapper: GSAP's pin-spacer only wraps the inner stage, so switching to the
          reduced-motion branch removes this wrapper (parent untouched) instead of the re-parented stage. */}
      <div>
        <div ref={stage} className="relative h-svh">
          <div className="absolute inset-y-[15%] left-0 text-ink"><TickRuler count={40} /></div>
          <div className="absolute inset-y-[15%] right-0 flex text-ink [&>div]:items-end"><TickRuler count={40} /></div>
          <ul className="sr-only">
            {s.names.map((n) => <li key={n}>{n}</li>)}
          </ul>
          <ul aria-hidden="true" className="absolute inset-0 grid place-items-center [perspective:calc(var(--u)*60)] [transform-style:preserve-3d]">
            {s.names.map((n) => (
              <li key={n} data-name className="absolute text-center text-[calc(var(--u)*5)] leading-none tracking-[-0.025em] will-change-transform max-md:text-[calc(var(--u)*3)]">
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
