import Image from "next/image";
import type { CardGridSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { FadeUp } from "@/components/motion/FadeUp";
import { cn } from "@/lib/cn";

export function CardGrid({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      {/* Four tiles read as one row on desktop (2×2 on tablet); five or six keep the 3-column grid. */}
      <FadeUp className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", s.cards.length + (s.photo ? 1 : 0) === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
        {s.cards.map((c) => {
          const body = (
            <>
              <Icon name={c.icon} className="size-12" />
              <div className="flex flex-col gap-4">
                <h3 className="text-card">{c.title}</h3>
                {/* Linked cards reveal their description on hover/focus where a fine pointer exists; otherwise it's always shown. */}
                <p className={cn("text-body-s text-ink/70", c.link && "hover-fine:max-h-0 hover-fine:overflow-hidden hover-fine:opacity-0 hover-fine:transition-all hover-fine:duration-500 hover-fine:ease-house hover-fine:group-hover/card:max-h-40 hover-fine:group-hover/card:opacity-100 hover-fine:group-focus-within/card:max-h-40 hover-fine:group-focus-within/card:opacity-100")}>
                  {c.description}
                </p>
              </div>
            </>
          );
          const cls = "group/card flex aspect-square flex-col justify-between rounded-md bg-paper p-8 text-ink transition-colors duration-500 ease-house hover:bg-accent focus-within:bg-accent";
          return (
            <div key={c.title} data-fade>
              {c.link ? <SmartLink link={{ ...c.link, label: c.title }} className={cls}>{body}</SmartLink> : <div className={cls}>{body}</div>}
            </div>
          );
        })}
        {s.photo && (
          <div data-fade className="relative aspect-square overflow-hidden rounded-md">
            <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(min-width: 992px) 33vw, 100vw" className="object-cover" />
          </div>
        )}
      </FadeUp>
      {s.link && <div className="mt-12 flex justify-end"><Button link={s.link} /></div>}
    </SectionShell>
  );
}
