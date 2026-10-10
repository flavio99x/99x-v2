import Image from "next/image";
import type { MediaStatementSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { VideoLightbox } from "./VideoLightbox";
import { FadeUp } from "@/components/motion/FadeUp";

export function MediaStatement({ section: s }: { section: T }) {
  const [a, b] = s.images;
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <FadeUp className="grid-12 gap-y-12">
        <div data-fade className="relative col-span-12 aspect-[4/3] overflow-hidden rounded-md md:col-span-7">
          <Image src={a.src} alt={a.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
        </div>
        <div className="col-span-12 flex flex-col justify-end gap-8 md:col-span-4 md:col-start-9">
          <div data-fade className="relative aspect-[3/4] overflow-hidden rounded-md">
            <Image src={b.src} alt={b.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </div>
          <p className="text-body-m">{s.body}</p>
          {s.video && <VideoLightbox youtubeId={s.video.youtubeId} label={s.video.label} />}
        </div>
      </FadeUp>
    </SectionShell>
  );
}
