import Image from "next/image";
import type { ContactBlockSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { ContactForm } from "@/components/forms/ContactForm";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function ContactBlock({ section: s }: { section: T }) {
  const p = s.person;
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div className="grid-12 gap-y-12">
        <div className="col-span-12 flex flex-col gap-6 md:col-span-5 lg:col-span-4">
          {p.photo && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-md">
              <Image src={p.photo.src} alt={p.photo.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <p className="text-h2">{p.name}</p>
            <Eyebrow className="opacity-60">{p.role}</Eyebrow>
            {p.email && <a href={`mailto:${p.email}`} className="text-body-m underline-offset-4 hover:underline">{p.email}</a>}
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <ContactForm source={s.source} compact />
        </div>
      </div>
    </SectionShell>
  );
}
