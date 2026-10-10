import Image from "next/image";
import type { Hero as HeroT } from "@/content/schema";
import { RevealLines } from "@/components/motion/RevealLines";
import { Parallax } from "@/components/motion/Parallax";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonSm } from "@/components/ui/ButtonSm";

export function Hero({ hero }: { hero: HeroT }) {
  return (
    <section data-theme="dark" className="relative flex h-svh min-h-[36em] flex-col justify-end overflow-hidden bg-ink text-paper site-x pb-8">
      <Parallax className="absolute inset-0" amount={8}>
        <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="100vw" className="object-cover" />
      </Parallax>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
      <div className="relative grid-12 items-end gap-y-10">
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-8">
          <Eyebrow className="text-paper/70">{hero.eyebrow}</Eyebrow>
          <RevealLines as="h1" lines={hero.lines} className="text-hero" waitForLoader />
        </div>
        <div className="col-span-12 flex flex-col items-start gap-8 lg:col-span-4 lg:items-end">
          {hero.metric && (
            <p className="flex flex-col gap-1 font-mono font-light uppercase lg:text-right">
              <span className="text-eyebrow-m text-paper/60">{hero.metric.label}</span>
              <span className="text-body-m">{hero.metric.value}</span>
            </p>
          )}
          {hero.cards && (
            <ul className="hidden gap-4 md:flex">
              {hero.cards.map((c) => (
                <li key={c.link.href} className="relative h-36 w-54 overflow-hidden rounded-[4px] border border-paper/20">
                  <Image src={c.image.src} alt="" fill sizes="216px" className="object-cover" />
                  <ButtonSm link={c.link} className="absolute bottom-2 left-2" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
