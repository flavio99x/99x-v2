"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

export const HOUSE_EASE = "house";
export const NAV_EASE = "nav";
export const DUR = { reveal: 1.2, hover: 0.5, card: 0.8 } as const;

let registered = false;
if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
  CustomEase.create(HOUSE_EASE, "M0,0 C0.6,0 0,1 1,1");
  CustomEase.create(NAV_EASE, "M0,0 C0.625,0.05 0,1 1,1");
  gsap.defaults({ ease: HOUSE_EASE, duration: DUR.reveal });
  // Transform pinning: originally needed because the old menu transformed the page shell. The nav no longer does,
  // but every pinned section was built and verified on transform pins; re-test them all before switching to fixed.
  ScrollTrigger.defaults({ pinType: "transform" });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
