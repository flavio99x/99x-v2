"use client";
import { useRef } from "react";
import { gsap, useGSAP, HOUSE_EASE } from "@/lib/gsap";
import { markLoaderDone } from "@/lib/loader";
import { prefersReducedMotion } from "@/lib/motion";

const KEY = "99x-loaded";

export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}
    if (seen || prefersReducedMotion()) {
      gsap.set(ref.current, { display: "none" });
      markLoaderDone();
      return;
    }
    const tl = gsap.timeline({ onComplete: () => { gsap.set(ref.current, { display: "none" }); } });
    tl.from("[data-loader-tile]", { scale: 0.6, autoAlpha: 0, duration: 0.6, ease: HOUSE_EASE })
      .to("[data-loader-tile]", { width: "calc(var(--u) * 9)", duration: 0.8, ease: HOUSE_EASE })
      .from("[data-loader-mark]", { autoAlpha: 0, duration: 0.4 }, "<0.3")
      .to("[data-loader-square]", { scale: 40, duration: 1, ease: HOUSE_EASE })
      // Mark "seen" only once the intro has actually played (a mount-time write is lost to StrictMode's double effect run).
      .add(() => { try { sessionStorage.setItem(KEY, "1"); } catch {} markLoaderDone(); }, "-=0.4")
      .to(ref.current, { autoAlpha: 0, duration: 0.4 }, "-=0.2");
  }, { scope: ref });

  return (
    <div ref={ref} data-loader aria-hidden="true" className="fixed inset-0 z-[90] grid place-items-center overflow-hidden bg-ink">
      <span data-loader-square className="absolute size-4 rounded-xs bg-paper" />
      <span data-loader-tile className="relative z-10 grid h-[calc(var(--u)*2.8)] w-[calc(var(--u)*2.8)] place-items-center overflow-hidden rounded-md bg-paper">
        <img data-loader-mark src="/brand/99x-logo.svg" alt="" width={74} height={38} className="w-[calc(var(--u)*5)] max-w-none" />
      </span>
    </div>
  );
}
