"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Office } from "@/content/schema";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionTag } from "@/components/ui/SectionTag";
import { StaticLogoFallback } from "./StaticLogoFallback";
import { storyStep } from "./storyMath";
import { isLowPowerDevice } from "./lowPower";
import { cn } from "@/lib/cn";

const LogoScene = dynamic(() => import("./LogoScene"), { ssr: false });

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};
const fmt = (n: number, pos: string, neg: string) => `${Math.abs(n).toFixed(2)}°${n >= 0 ? pos : neg}`;

// Tick coordinates are rounded so server and client render identical attribute strings.
const TICKS = 120;
const r3 = (n: number) => Math.round(n * 1000) / 1000;
const TICK_LINES = Array.from({ length: TICKS }, (_, i) => {
  const a = (i / TICKS) * Math.PI * 2 - Math.PI / 2;
  const r2 = i % 10 === 0 ? 44 : 46;
  return { x1: r3(Math.cos(a) * 48), y1: r3(Math.sin(a) * 48), x2: r3(Math.cos(a) * r2), y2: r3(Math.sin(a) * r2) };
});

type Scene = { svg: string; pointer: boolean };

export function LogoStory({ offices, tag }: { offices: Office[]; tag?: { label: string } }) {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [storyActive, setActive] = useState(-1);
  const [ticksOn, setTicksOn] = useState(0);
  const [scene, setScene] = useState<Scene | null>(null);

  // Load the 3D chunk (and the logo SVG) ~1.5 screens before the section.
  useEffect(() => {
    const el = stage.current;
    if (reduced || !el || !hasWebGL() || isLowPowerDevice()) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        fetch("/brand/99x-logo.svg")
          .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
          .then((svg) => {
            if (!cancelled) setScene({ svg, pointer: !window.matchMedia("(pointer: coarse)").matches });
          })
          .catch(() => {
            /* keep the static fallback */
          });
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [reduced]);

  useGSAP(
    () => {
      if (reduced || !stage.current) return;
      ScrollTrigger.create({
        trigger: stage.current,
        start: "top top",
        end: "+=500%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          // Rounded so React bails out (no re-render) unless a dial tick or the active office changes.
          setTicksOn(Math.round(self.progress * TICKS));
          setActive(storyStep(self.progress, offices.length).active);
        },
      });
    },
    { dependencies: [reduced, offices.length], scope: stage, revertOnUpdate: true },
  );

  // Ignore stale scroll state if reduced motion is switched on at runtime.
  const active = reduced ? -1 : storyActive;
  const current = active >= 0 ? offices[active] : null;
  const show3d = scene !== null && !reduced;

  // The stable outer wrapper is what React inserts/removes; GSAP's pin-spacer only ever wraps the inner stage,
  // so a reduced-motion toggle can never make React remove a node GSAP has re-parented.
  return (
    <div>
      <div
        ref={stage}
        data-pinned={reduced ? undefined : ""}
        className={cn("relative grid-12 items-center", reduced ? "gap-y-12" : "h-svh max-md:content-center max-md:gap-y-6 max-md:pt-20")}
      >
        <div className="col-span-12 flex flex-col gap-6 md:col-span-3">
          {tag && <span className="-mb-2"><SectionTag label={tag.label} /></span>}
          <Eyebrow as="h3">Offices</Eyebrow>
        <ol className="flex flex-col gap-2">
          {offices.map((o, i) => (
            <li
              key={o.id}
              className={cn("text-h2 transition-opacity duration-500", reduced || active === i ? "opacity-100" : "opacity-50")}
              aria-current={active === i ? "true" : undefined}
            >
              {o.city}
            </li>
          ))}
        </ol>
        </div>
        <div className="relative col-span-12 mx-auto aspect-square w-[80%] md:col-span-6 md:w-full">
          <div className="absolute inset-[6%] rounded-full">
            <Dial on={reduced ? TICKS : ticksOn} />
          </div>
          {/* The canvas overhangs the dial so inactive pieces can park outside the ring; the stage receives pointer events. */}
          <div className={cn("absolute", show3d ? "pointer-events-none inset-[-30%]" : "inset-[14%]")}>
            {show3d ? (
              <LogoScene svgText={scene.svg} progress={progress} pointer={scene.pointer} eventSource={stage} />
            ) : (
              <StaticLogoFallback active={active} />
            )}
          </div>
        </div>
        <div className="col-span-12 flex flex-col gap-3 md:col-span-3 md:items-end md:text-right" aria-live="polite">
          {current ? (
            <>
              <Eyebrow>{`${current.city} [${current.countryCode}]`}</Eyebrow>
              <Eyebrow className="opacity-60">{`${fmt(current.lat, "N", "S")} ${fmt(current.lng, "E", "W")}`}</Eyebrow>
              <a href={`mailto:${current.email}`} className="text-body-s underline-offset-4 hover:underline">
                {current.email}
              </a>
            </>
          ) : (
            <Eyebrow className="opacity-60">{reduced ? "Five offices, one team" : "Scroll to explore"}</Eyebrow>
          )}
        </div>
      </div>
    </div>
  );
}

function Dial({ on }: { on: number }) {
  return (
    <svg viewBox="-50 -50 100 100" className="h-full w-full" aria-hidden="true">
      {TICK_LINES.map((l, i) => (
        <line key={i} {...l} stroke="currentColor" strokeWidth={0.3} opacity={i < on ? 0.75 : 0.2} />
      ))}
    </svg>
  );
}
