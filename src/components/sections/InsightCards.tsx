import Image from "next/image";
import type { InsightCardsSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { FadeUp } from "@/components/motion/FadeUp";

export function InsightCards({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <FadeUp className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {s.cards.map((c) => (
          <SmartLink key={c.link.href} link={{ ...c.link, label: c.title }} className="group/ins flex flex-col justify-between gap-8 rounded-md bg-tint p-6 md:aspect-[2/1] md:flex-row">
            <div data-fade className="flex flex-col justify-between gap-6">
              <Eyebrow size="s">{c.kind}</Eyebrow>
              <h3 className="text-body-m">{c.title}</h3>
            </div>
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-sm md:w-[40%]">
              <Image src={c.image.src} alt={c.image.alt} fill sizes="(min-width: 768px) 15vw, 100vw" className="object-cover transition-transform duration-700 ease-house group-hover/ins:scale-105" />
            </div>
          </SmartLink>
        ))}
      </FadeUp>
      {s.link && <div className="mt-12 flex justify-end"><Button link={s.link} /></div>}
    </SectionShell>
  );
}
