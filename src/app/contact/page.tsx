import { getPage, getSite } from "@/content";
import { PageView } from "@/components/sections/PageView";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(getPage("contact"));

export default function ContactPage() {
  return <PageView page={getPage("contact")} site={getSite()} />;
}
