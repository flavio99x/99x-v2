// tests/unit/content/pages.test.ts
import { describe, it, expect } from "vitest";
import { getAllPages, getPage } from "@/content";
import { BUILT_ROUTES } from "@/content/routes";
import type { Page, Section } from "@/content/schema";

const pages = getAllPages();
const byPath = new Map(pages.map((p) => [p.path, p]));

function links(page: Page) {
  const out: { label: string; href: string; external?: boolean }[] = [];
  const visit = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(visit);
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (typeof o.href === "string" && typeof o.label === "string") out.push(o as never);
      Object.values(o).forEach(visit);
    }
  };
  visit(page.hero);
  visit(page.sections);
  return out;
}
const sectionIds = (p: Page) => new Set(p.sections.map((s: Section) => s.id).filter(Boolean));

describe.each(pages.map((p) => [p.slug, p] as const))("page %s", (_slug, page) => {
  it("internal links resolve to built routes and existing anchors", () => {
    for (const l of links(page)) {
      if (l.external || l.href.startsWith("mailto:") || l.href.startsWith("tel:")) continue;
      const [path, hash] = l.href.split("#");
      const targetPath = path || page.path;
      expect(BUILT_ROUTES as readonly string[], `${l.label} -> ${l.href}`).toContain(targetPath);
      if (hash) {
        const target = byPath.get(targetPath);
        if (target) expect(sectionIds(target).has(hash), `missing #${hash} on ${targetPath}`).toBe(true);
      }
    }
  });

  it("next page points at a built route and reuses its hero image", () => {
    expect(BUILT_ROUTES as readonly string[]).toContain(page.next.href);
    const target = byPath.get(page.next.href);
    if (target?.hero) expect(page.next.image.src).toBe(target.hero.image.src);
  });
});

describe("home", () => {
  it("is registered at /", () => expect(getPage("home").path).toBe("/"));
});

describe("about", () => {
  it("is registered at /about-us", () => expect(getPage("about").path).toBe("/about-us"));
});

describe("services", () => {
  it("has anchors for every division", () => {
    const ids = getPage("services").sections.map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["nearshore-usa", "nearshore-europe", "product-engineering", "web-solutions"]));
  });
});

describe("nearshore-usa", () => {
  it("has the contact block anchored at #talk", () => {
    const s = getPage("nearshore-usa").sections.find((x) => x.type === "contactBlock");
    expect(s?.id).toBe("talk");
  });
});

describe("registry", () => {
  it("registers all five pages", () => {
    expect(getAllPages().map((p) => p.slug).sort()).toEqual(["about", "contact", "home", "nearshore-usa", "services"]);
  });
});
