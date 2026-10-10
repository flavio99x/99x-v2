import Image from "next/image";
import type { PeopleGridSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeUp } from "@/components/motion/FadeUp";

export function PeopleGrid({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <FadeUp className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {s.people.map((p) => (
          <figure key={p.name} data-fade className="flex flex-col gap-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-tint">
              {p.photo && <Image src={p.photo.src} alt={p.photo.alt} fill sizes="(min-width: 992px) 25vw, 50vw" className="object-cover grayscale transition duration-700 ease-house hover:grayscale-0" />}
            </div>
            <figcaption className="flex flex-col gap-2">
              <span className="text-body-m">{p.name}</span>
              <Eyebrow size="s" className="opacity-60">{p.role}</Eyebrow>
            </figcaption>
          </figure>
        ))}
      </FadeUp>
    </SectionShell>
  );
}
