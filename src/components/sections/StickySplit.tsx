import Image from "next/image";
import type { StickySplitSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function StickySplit({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div className={cn("grid-12 gap-y-12 border-t border-ink/20 pt-8", s.theme === "dark" && "border-paper/20")}>
        <div className={cn("relative col-span-12 aspect-[4/5] overflow-hidden rounded-md lg:col-span-6", s.mediaSide === "right" && "lg:order-2 lg:col-start-7")}>
          <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 992px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className={cn("col-span-12 lg:col-span-4", s.mediaSide === "left" ? "lg:col-start-8" : "lg:col-start-2 lg:order-1")}>
          <div className="flex flex-col items-start gap-8 lg:sticky lg:top-[40svh]">
            <h3 className="text-h2">{s.heading}</h3>
            <p className="text-body-m opacity-70">{s.body}</p>
            {s.link && <Button link={s.link} variant={s.theme === "dark" ? "light" : "dark"} />}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
