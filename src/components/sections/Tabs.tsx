"use client";
import Image from "next/image";
import { useState } from "react";
import type { TabsSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Toggle } from "@/components/ui/Toggle";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Tabs({ section: s }: { section: T }) {
  const [i, setI] = useState(0);
  const prefix = s.id ?? "tabs";
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div className="grid-12 gap-y-8">
        <div className="col-span-12 flex flex-col gap-6 rounded-md bg-paper p-8 text-ink lg:col-span-5">
          <Toggle items={s.items.map((_, n) => String(n + 1).padStart(2, "0"))} value={i} onChange={setI} label={s.head.label} idPrefix={prefix} />
          {s.items.map((it, n) => (
            <div key={it.label} role="tabpanel" id={`${prefix}-panel-${n}`} aria-labelledby={`${prefix}-tab-${n}`} hidden={n !== i} className="flex flex-col gap-6">
              <Eyebrow>{it.label}</Eyebrow>
              <h3 className="text-h2">{it.heading}</h3>
              <p className="text-body-m text-ink/70">{it.body}</p>
            </div>
          ))}
        </div>
        <div className="relative col-span-12 aspect-[4/3] overflow-hidden rounded-md lg:col-span-7">
          {s.items.map((it, n) => (
            <Image key={it.image.src} src={it.image.src} alt={n === i ? it.image.alt : ""} fill sizes="(min-width: 992px) 58vw, 100vw"
              className="object-cover transition-opacity duration-700 ease-house" style={{ opacity: n === i ? 1 : 0 }} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
