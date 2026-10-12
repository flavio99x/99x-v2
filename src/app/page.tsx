// src/app/page.tsx
import { getPage, getSite } from "@/content";
import { PageView } from "@/components/sections/PageView";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(getPage("home"));

export default function HomePage() {
  return <PageView page={getPage("home")} site={getSite()} />;
}
