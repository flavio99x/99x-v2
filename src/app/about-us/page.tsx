import { getPage, getSite } from "@/content";
import { PageView } from "@/components/sections/PageView";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(getPage("about"));

export default function AboutPage() {
  return <PageView page={getPage("about")} site={getSite()} />;
}
