import { describe, it, expect } from "vitest";
import { getSite } from "@/content";
import { BUILT_ROUTES } from "@/content/routes";

describe("site config", () => {
  const site = getSite();
  const allLinks = [
    ...site.nav.flatMap((g) => g.links),
    ...site.footer.columns.flatMap((c) => c.links),
    ...site.legal,
  ];

  it("every internal link points at a built route, anchor or mailto/tel", () => {
    for (const l of allLinks) {
      if (l.external) continue;
      const ok =
        l.href.startsWith("mailto:") ||
        l.href.startsWith("tel:") ||
        l.href.startsWith("#") ||
        (BUILT_ROUTES as readonly string[]).includes(l.href.split("#")[0]);
      expect(ok, `${l.label} -> ${l.href}`).toBe(true);
    }
  });

  it("every external link points at https", () => {
    for (const l of allLinks.filter((l) => l.external)) expect(l.href.startsWith("https://")).toBe(true);
  });

  it("has exactly 5 offices", () => {
    expect(site.offices).toHaveLength(5);
  });
});
