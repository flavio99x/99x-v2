import Image from "next/image";
import type { DivisionContactsSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/motion/FadeUp";

export function DivisionContacts({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <FadeUp className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {s.divisions.map((d) => (
          <a key={d.email} data-fade href={`mailto:${d.email}`} className="group/div flex aspect-square flex-col justify-between rounded-md bg-paper p-8 text-ink transition-colors duration-500 ease-house hover:bg-accent focus-visible:bg-accent">
            <Eyebrow>{d.label}</Eyebrow>
            <div className="flex flex-col gap-4">
              <p className="text-card">{d.heading}</p>
              <span className="text-body-s underline-offset-4 group-hover/div:underline">{d.email}</span>
            </div>
          </a>
        ))}
      </FadeUp>
      <ul className="mt-32 grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-2 lg:grid-cols-5">
        {s.people.map((p) => (
          <li key={p.name} className="flex flex-col gap-3">
            {p.photo && <div className="relative aspect-square w-24 overflow-hidden rounded-md"><Image src={p.photo.src} alt={p.photo.alt} fill sizes="96px" className="object-cover" /></div>}
            <span className="text-body-m">{p.name}</span>
            <Eyebrow size="s" className="opacity-60">{p.role}</Eyebrow>
            {p.email && <a href={`mailto:${p.email}`} className="text-body-s underline-offset-4 hover:underline">{p.email}</a>}
            {p.phone && <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="text-body-s underline-offset-4 hover:underline">{p.phone}</a>}
          </li>
        ))}
      </ul>
      <div className="mt-32 grid-12 border-t border-current/20 pt-8">
        <p className="col-span-12 text-h2 md:col-span-5">{s.internships.heading}</p>
        <div className="col-span-12 mt-6 flex flex-col items-start gap-6 md:col-span-4 md:col-start-9 md:mt-0">
          <p className="text-body-m opacity-70">{s.internships.body}</p>
          <Button link={{ label: "Email us", href: `mailto:${s.internships.email}` }} />
        </div>
      </div>
    </SectionShell>
  );
}
