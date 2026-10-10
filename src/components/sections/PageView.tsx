// src/components/sections/PageView.tsx
import type { Page, Site } from "@/content/schema";
import { Hero } from "./Hero";
import { SectionRenderer } from "./SectionRenderer";
import { NextPage } from "./NextPage";

export function PageView({ page, site }: { page: Page; site: Site }) {
  return (
    <>
      {page.hero && <Hero hero={page.hero} />}
      <SectionRenderer sections={page.sections} site={site} />
      <NextPage next={page.next} />
    </>
  );
}
