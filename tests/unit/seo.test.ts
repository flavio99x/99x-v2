import { describe, it, expect, afterEach } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { buildMetadata } from "@/lib/seo";
import { getAllPages } from "@/content";

const saved = { VERCEL_ENV: process.env.VERCEL_ENV, SITE_INDEXABLE: process.env.SITE_INDEXABLE };
afterEach(() => {
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});

describe("seo", () => {
  it("sitemap lists the 5 built routes as absolute URLs", () => {
    const urls = sitemap().map((e) => e.url).sort();
    expect(urls).toEqual([
      "https://99x.io/", "https://99x.io/about-us", "https://99x.io/contact",
      "https://99x.io/services", "https://99x.io/services/nearshore-tech-talent-usa",
    ]);
  });
  it("robots allows crawling only on a production deploy marked indexable", () => {
    process.env.VERCEL_ENV = "preview";
    process.env.SITE_INDEXABLE = "true";
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
    process.env.VERCEL_ENV = "production";
    delete process.env.SITE_INDEXABLE;
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
    process.env.SITE_INDEXABLE = "true";
    expect(robots().rules).toEqual({ userAgent: "*", allow: "/" });
  });
  it("every page has canonical + og image", () => {
    for (const p of getAllPages()) {
      const m = buildMetadata(p);
      expect(m.alternates?.canonical).toBe(p.path);
      expect(m.openGraph?.images).toBeTruthy();
    }
  });
});
