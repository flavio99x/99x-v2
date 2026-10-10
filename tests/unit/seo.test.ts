import { describe, it, expect, afterEach } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { buildMetadata } from "@/lib/seo";
import { getAllPages } from "@/content";

const originalEnv = process.env.VERCEL_ENV;
afterEach(() => {
  if (originalEnv === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = originalEnv;
});

describe("seo", () => {
  it("sitemap lists the 5 built routes as absolute URLs", () => {
    const urls = sitemap().map((e) => e.url).sort();
    expect(urls).toEqual([
      "https://99x.io/", "https://99x.io/about-us", "https://99x.io/contact",
      "https://99x.io/services", "https://99x.io/services/nearshore-tech-talent-usa",
    ]);
  });
  it("robots disallows everything on preview deployments", () => {
    process.env.VERCEL_ENV = "preview";
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
    process.env.VERCEL_ENV = "production";
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
