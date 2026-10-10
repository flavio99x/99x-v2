import type { MetadataRoute } from "next";
import { getAllPages, getSite } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSite().url;
  return getAllPages().map((p) => ({ url: `${base}${p.path}`, changeFrequency: "monthly", priority: p.path === "/" ? 1 : 0.8 }));
}
