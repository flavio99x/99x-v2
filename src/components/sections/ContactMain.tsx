import type { ContactMainSection as T, Office } from "@/content/schema";
import { ContactForm } from "@/components/forms/ContactForm";
import { WorldDotMap } from "./WorldDotMap";
import { RevealLines } from "@/components/motion/RevealLines";
import { cn } from "@/lib/cn";

export function ContactMain({ section: s, offices }: { section: T; offices: Office[] }) {
  return (
    <section data-theme={s.theme} id={s.id} className={cn("site-x pt-32 pb-40 lg:pb-64", s.theme === "tint" ? "bg-tint" : "bg-paper")}>
      <div className="grid-12 gap-y-16">
        <div className="col-span-12 lg:col-span-6">
          <div className="lg:sticky lg:top-32"><WorldDotMap offices={offices} /></div>
        </div>
        <div className="col-span-12 flex flex-col gap-12 lg:col-span-5 lg:col-start-8 lg:max-w-[28em]">
          <RevealLines as="h1" lines={[s.heading]} className="text-statement" waitForLoader />
          <p className="text-body-m text-ink/70">{s.intro}</p>
          <ContactForm source={s.source} />
        </div>
      </div>
    </section>
  );
}
