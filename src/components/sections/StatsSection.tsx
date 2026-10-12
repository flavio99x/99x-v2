import Image from "next/image";
import type { StatsSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Stat } from "@/components/ui/Stat";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/motion/FadeUp";

export function StatsSection({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div className="grid-12 gap-y-12">
        {s.image && (
          <div className="relative col-span-12 aspect-[4/5] overflow-hidden rounded-md md:col-span-6 lg:col-span-5">
            <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 992px) 35vw, 100vw" className="object-cover" />
          </div>
        )}
        <FadeUp className={s.image ? "col-span-12 grid grid-cols-2 content-start gap-x-4 gap-y-16 md:col-span-6 lg:col-span-6 lg:col-start-7" : "col-span-12 grid grid-cols-2 gap-x-4 gap-y-16 lg:grid-cols-4"}>
          {s.items.map((it) => <Stat key={it.label} {...it} />)}
        </FadeUp>
      </div>
      {(s.body || s.link) && (
        <div className="grid-12 mt-24">
          <div className="col-span-12 flex flex-col items-start gap-8 lg:col-span-4 lg:col-start-9">
            {s.body && <p className="text-body-m">{s.body}</p>}
            {s.link && <Button link={s.link} />}
          </div>
        </div>
      )}
    </SectionShell>
  );
}
