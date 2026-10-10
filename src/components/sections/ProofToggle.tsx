"use client";
import { useEffect, useRef, useState } from "react";
import type { ProofToggleSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Toggle } from "@/components/ui/Toggle";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";

export function ProofToggle({ section: s }: { section: T }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const prefix = s.id ?? "proof";

  useEffect(() => {
    if (reduced || paused || userPaused) return;
    const t = setInterval(() => setI((n) => (n + 1) % s.items.length), 6000);
    return () => clearInterval(t);
  }, [reduced, paused, userPaused, s.items.length]);

  useGSAP(() => {
    if (reduced || !panel.current) return;
    gsap.fromTo(panel.current.querySelectorAll("[data-line-inner]"), { yPercent: 100 }, { yPercent: 0, duration: 0.6, stagger: 0.05 });
  }, { dependencies: [i], scope: panel });

  const item = s.items[i];
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div
        className="flex flex-col items-center gap-12 text-center"
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false); }}
      >
        <Eyebrow>{s.subline}</Eyebrow>
        <div className="flex items-center gap-4">
          <Toggle items={s.items.map((_, n) => String(n + 1).padStart(2, "0"))} value={i} onChange={(n) => { setUserPaused(true); setI(n); }} label={s.subline} idPrefix={prefix} tone="ink" />
          {!reduced && (
            <button type="button" aria-pressed={userPaused} onClick={() => setUserPaused((v) => !v)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md bg-ink px-4 font-mono text-eyebrow-s font-light uppercase text-paper transition-opacity duration-500 ease-house hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2">
              {userPaused ? "Play" : "Pause"}
            </button>
          )}
        </div>
        <div ref={panel} role="tabpanel" id={`${prefix}-panel-${i}`} aria-labelledby={`${prefix}-tab-${i}`} aria-live={reduced || userPaused ? "polite" : "off"} className="flex min-h-[2.2em] max-w-[57em] flex-col items-center gap-4 text-statement">
          <span className="mask-line"><span data-line-inner className="block text-xxl">{item.value}</span></span>
          <span className="mask-line"><span data-line-inner className="block">{item.text}</span></span>
        </div>
      </div>
    </SectionShell>
  );
}
