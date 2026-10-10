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
          // Photo-filled text: the clipped image is decorative, so the solid ink fallback colour stays the
          // text colour for contrast tools and for browsers without background-clip:text.
          <p
            className="text-xxl text-ink supports-[background-clip:text]:bg-cover supports-[background-clip:text]:bg-[center_55%] supports-[background-clip:text]:bg-clip-text supports-[background-clip:text]:text-transparent"
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
