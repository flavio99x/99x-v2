// src/lib/seo.ts
import type { Metadata } from "next";
import type { Page, Site } from "@/content/schema";

export function buildMetadata(page: Page): Metadata {
  const { title, description, ogImage } = page.meta;
  return {
    title: page.slug === "home" ? { absolute: title } : title,
    description,
    alternates: { canonical: page.path },
    openGraph: {
      title, description, url: page.path, siteName: "99x", type: "website", locale: "en",
      images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.src] },
  };
}

export function organizationJsonLd(site: Site) {
  const hq = site.offices[0];
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "99x",
    url: site.url,
    logo: `${site.url}/brand/99x-logo.svg`,
    sameAs: site.socials.map((s) => s.href),
    email: site.footer.contact.email,
    telephone: site.footer.contact.phone,
    address: { "@type": "PostalAddress", streetAddress: "Dronning Eufemias gate 16", postalCode: "0191", addressLocality: hq.city, addressCountry: hq.countryCode },
  };
}
