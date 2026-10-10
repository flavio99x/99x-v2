import { SiteSchema, PageSchema, type Page, type Site } from "./schema";
import { site as siteEn } from "./en/site";
import { home } from "./en/pages/home";

export type Locale = "en";
export type PageSlug = Page["slug"];

const sites: Record<Locale, Site> = { en: SiteSchema.parse(siteEn) };
const pageRegistry: Record<Locale, Partial<Record<PageSlug, Page>>> = {
  en: { home: PageSchema.parse(home) },
};

export function getSite(locale: Locale = "en"): Site { return sites[locale]; }
export function getPage(slug: PageSlug, locale: Locale = "en"): Page {
  const page = pageRegistry[locale][slug];
  if (!page) throw new Error(`Page not registered: ${locale}/${slug}`);
  return page;
}
export function getAllPages(locale: Locale = "en"): Page[] {
  return Object.values(pageRegistry[locale]).filter((p): p is Page => Boolean(p));
}
