import type { LogoStorySection as T, Office } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { LogoStory } from "@/components/three/LogoStory";

export function LogoStorySection({ section: s, offices }: { section: T; offices: Office[] }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id} bottom="md" tag={false} className="overflow-x-clip">
      <LogoStory offices={offices} tag={s.head} />
    </SectionShell>
  );
}
