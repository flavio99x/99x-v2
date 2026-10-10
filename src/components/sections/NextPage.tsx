import Image from "next/image";
import type { Page } from "@/content/schema";
import { Parallax } from "@/components/motion/Parallax";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { ButtonInner } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function NextPage({ next }: { next: Page["next"] }) {
  return (
    <section data-theme="dark" data-next-page aria-label={`Next: ${next.label}`} className="relative h-[150svh] bg-ink text-paper">
      <Parallax className="absolute inset-0" amount={10}>
        <Image src={next.image.src} alt="" fill sizes="100vw" className="object-cover" />
      </Parallax>
      <div aria-hidden="true" className="absolute inset-0 bg-ink/40" />
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center gap-6">
        <Eyebrow className="text-paper/70">{next.eyebrow}</Eyebrow>
        <TransitionLink href={next.href} variant="next" className="group/btn">
          <ButtonInner label={next.label} variant="next" size="xl" />
        </TransitionLink>
      </div>
    </section>
  );
}
