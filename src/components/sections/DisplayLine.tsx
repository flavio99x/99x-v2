import type { DisplayLineSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { PillWipe } from "@/components/motion/PillWipe";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function DisplayLine({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div className="flex flex-col items-center gap-8 text-center">
        {s.fill === "pill" ? (
          <PillWipe text={s.text} />
        ) : (
          <p
            className="text-xxl bg-cover bg-center bg-clip-text text-transparent"
            style={{ backgroundImage: s.image ? `url(${s.image.src})` : undefined }}
          >
            {s.text}
          </p>
        )}
        {s.subline && <Eyebrow>{s.subline}</Eyebrow>}
        {s.body && <p className="mt-8 max-w-[42em] text-body-m">{s.body}</p>}
      </div>
    </SectionShell>
  );
}
