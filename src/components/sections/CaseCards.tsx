import Image from "next/image";
import type { CaseCardsSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { PillWipe } from "@/components/motion/PillWipe";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { FadeUp } from "@/components/motion/FadeUp";

export function CaseCards({ section: s }: { section: T }) {
  const cols = s.cards.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      {s.display && (
        <div className="mb-24 flex flex-col items-center gap-6 text-center">
          <PillWipe text={s.display.text} />
          <Eyebrow>{s.display.subline}</Eyebrow>
        </div>
      )}
      <FadeUp className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${cols}`}>
        {s.cards.map((c) => (
          <SmartLink key={c.link.href} link={{ ...c.link, label: c.title }} className="group/case flex flex-col gap-4">
            <div data-fade className="relative aspect-[179/220] overflow-hidden rounded-md bg-ink">
              <Image src={c.image.src} alt={c.image.alt} fill sizes="(min-width: 992px) 30vw, 100vw" className="object-cover transition-transform duration-700 ease-house group-hover/case:scale-105" />
              <Eyebrow size="s" className="absolute top-4 left-4 rounded-xs bg-paper px-2 py-1 text-ink">{c.tag}</Eyebrow>
            </div>
            <h3 className="text-body-m">{c.title}</h3>
          </SmartLink>
        ))}
      </FadeUp>
      {s.link && <div className="mt-16 flex justify-center"><Button link={s.link} /></div>}
    </SectionShell>
  );
}
