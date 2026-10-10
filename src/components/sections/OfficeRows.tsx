import type { Office, OfficeRowsSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function OfficeRows({ section: s, offices }: { section: T; offices: Office[] }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      {s.body && <p className="mb-16 max-w-[42em] text-body-m">{s.body}</p>}
      <ol className="flex flex-col">
        {offices.map((o, i) => (
          <li key={o.id} className="grid grid-cols-12 items-baseline gap-4 border-t border-current/20 py-6 last:border-b">
            <Eyebrow as="span" className="col-span-2 md:col-span-1">{String(i + 1).padStart(2, "0")}</Eyebrow>
            <span className="col-span-10 text-h2 md:col-span-4">{o.city}</span>
            <Eyebrow as="span" className="col-span-10 col-start-3 opacity-60 md:col-span-2 md:col-start-auto">{o.country}</Eyebrow>
            <address className="col-span-10 col-start-3 not-italic text-body-s opacity-70 md:col-span-3 md:col-start-auto">{o.address}</address>
            <a href={`mailto:${o.email}`} className="col-span-10 col-start-3 text-body-s underline-offset-4 hover:underline md:col-span-2 md:col-start-auto md:text-right">{o.email}</a>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
