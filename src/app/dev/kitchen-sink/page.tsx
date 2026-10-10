"use client";
import { notFound } from "next/navigation";
import { useState } from "react";
import { Button, ButtonAction } from "@/components/ui/Button";
import { ButtonSm } from "@/components/ui/ButtonSm";
import { SectionTag } from "@/components/ui/SectionTag";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Stat";
import { TickRuler } from "@/components/ui/TickRuler";
import { Toggle } from "@/components/ui/Toggle";
import { Field } from "@/components/ui/Field";
import { ScrubText } from "@/components/motion/ScrubText";
import { RevealLines } from "@/components/motion/RevealLines";
import { PillWipe } from "@/components/motion/PillWipe";
import { FadeUp } from "@/components/motion/FadeUp";
import { ProofToggle } from "@/components/sections/ProofToggle";
import { NamesCylinder } from "@/components/sections/NamesCylinder";
import { Timeline } from "@/components/sections/Timeline";

const NAMES = ["Atlas", "Borealis", "Cadence", "Delta", "Ember", "Fjord", "Garnet", "Helix", "Ivory", "Juniper", "Kestrel", "Lumen"];
const TL = [2000, 2012, 2025].map((y) => ({ year: String(y), title: `Milestone ${y}`, image: { src: `/images/about/t-${y}.jpg`, alt: `Milestone photo ${y}`, width: 1600, height: 900 } }));

export default function KitchenSink() {
  if (process.env.NODE_ENV === "production") notFound();
  const [tab, setTab] = useState(0);
  return (
    <>
    <main className="bg-paper site-x flex flex-col gap-24 py-32">
      <RevealLines lines={["We build digital products,", "scale teams and put AI to work."]} className="text-hero" />
      <div className="flex flex-wrap gap-4 bg-tint p-8">
        <Button link={{ label: "About us", href: "/about-us" }} />
        <Button link={{ label: "Light", href: "/" }} variant="light" />
        <Button link={{ label: "Our services", href: "/services" }} variant="next" size="xl" />
        <ButtonAction type="button">Send</ButtonAction>
        <ButtonSm link={{ label: "Our services", href: "/services" }} />
      </div>
      <p className="grid-12"><span className="col-span-8 text-statement"><SectionTag index="S.01" label="About us" />For more than two decades, companies have trusted 99x to shape their products.</span></p>
      <ScrubText className="w-[57em] text-statement" text="Grey text that fills in as you scroll, line by line, character by character." />
      <FadeUp className="grid grid-cols-2 gap-4 w-[42em]">
        <Stat value="20+" label="Years building software" icon="calendar" />
        <Stat value="600+" label="People" icon="people" />
      </FadeUp>
      <PillWipe text="100+ companies transformed" />
      <div className="h-64 text-ink"><TickRuler progress={0.4} /></div>
      <Toggle items={["01", "02", "03"]} value={tab} onChange={setTab} label="Demo" idPrefix="demo" />
      <form className="flex w-[28em] flex-col gap-8"><Field name="name" label="Name" hint="Who should we reply to?" required /><Field name="email" type="email" label="Email" error="Enter a valid email address" required /></form>
      <Eyebrow>Eyebrow M</Eyebrow>
    </main>
      <ProofToggle section={{ type: "proofToggle", theme: "paper", head: { index: "S.06", label: "Why 99x" }, subline: "Why work with us", items: [{ value: "90%", text: "of clients say we met or exceeded expectations" }, { value: "100+", text: "companies transformed" }] }} />
      <NamesCylinder section={{ type: "namesCylinder", theme: "paper", head: { index: "S.07", label: "Names" }, names: NAMES }} />
      <Timeline section={{ type: "timeline", theme: "dark", head: { index: "S.03", label: "Timeline" }, items: TL }} />
      <div className="h-[50vh]" />
    </>
  );
}
