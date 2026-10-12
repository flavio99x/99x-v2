import type { MetadataRoute } from "next";
import { isIndexable } from "@/lib/indexable";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isIndexable() ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: "https://99x.io/sitemap.xml",
  };
}
