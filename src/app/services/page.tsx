import { getPage, getSite } from "@/content";
import { PageView } from "@/components/sections/PageView";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(getPage("services"));

export default function ServicesPage() {
  return <PageView page={getPage("services")} site={getSite()} />;
}
