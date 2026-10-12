import { getPage, getSite } from "@/content";
import { PageView } from "@/components/sections/PageView";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(getPage("nearshore-usa"));

export default function NearshoreUsaPage() {
  return <PageView page={getPage("nearshore-usa")} site={getSite()} />;
}
