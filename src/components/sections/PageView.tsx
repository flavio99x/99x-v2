// src/components/sections/PageView.tsx
import type { Page, Site } from "@/content/schema";
import { Hero } from "./Hero";
import { SectionRenderer } from "./SectionRenderer";
import { NextPage } from "./NextPage";

/** Index after the page's last numbered section, e.g. "S.09" when the last section is S.08. */
export function nextIndex(page: Page): string | undefined {
  const nums = page.sections.flatMap((s) => ("head" in s && s.head ? [Number(s.head.index.replace(/\D/g, ""))] : []));
  if (nums.length === 0) return undefined;
  return `S.${String(Math.max(...nums) + 1).padStart(2, "0")}`;
}

export function PageView({ page, site }: { page: Page; site: Site }) {
  return (
    <>
      {page.hero && <Hero hero={page.hero} />}
      <SectionRenderer sections={page.sections} site={site} />
      <NextPage next={page.next} index={nextIndex(page)} />
    </>
  );
}
