import type { Site } from "@/content/schema";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";

function Tag({ children }: { children: string }) {
  return <span className="inline-block w-fit rounded-sm border border-ink px-1.5 py-1 font-mono text-eyebrow-s font-light uppercase">{children}</span>;
}

export function Footer({ site }: { site: Site }) {
  const year = new Date().getFullYear();
  return (
    <footer data-theme="paper" className="bg-paper text-ink site-x pt-24 pb-8">
      <div className="grid-12 gap-y-16">
        <div className="col-span-12 flex flex-col gap-8 lg:col-span-4">
          <img src="/brand/99x-logo.svg" alt="99x" width={96} height={49} className="w-24" />
          <div className="flex gap-4 text-accent-deep">
            {site.socials.map((s) => (
              <a key={s.href} href={s.href} rel="noopener" aria-label={s.label}><Icon name={s.icon} /></a>
            ))}
          </div>
        </div>
        {site.footer.columns.map((c) => (
          <div key={c.tag} className="col-span-6 flex flex-col gap-4 md:col-span-3 lg:col-span-2">
            <Tag>{c.tag}</Tag>
            <ul className="flex flex-col gap-1">
              {c.links.map((l) => (
                <li key={l.href}><SmartLink link={l} className="font-medium leading-[1.4] text-ink/60 hover:text-ink" /></li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-12 flex flex-col gap-4 md:col-span-6 lg:col-span-2">
          <Tag>Contact</Tag>
          <address className="flex flex-col gap-1 not-italic font-medium leading-[1.4] text-ink/60">
            <span>{site.footer.contact.address}</span>
            <a href={`mailto:${site.footer.contact.email}`} className="hover:text-ink">{site.footer.contact.email}</a>
            <a href={`tel:${site.footer.contact.phone.replace(/\s/g, "")}`} className="hover:text-ink">{site.footer.contact.phone}</a>
          </address>
        </div>
      </div>
      <div className="mt-48 flex flex-col items-center gap-3 border-t border-ink/20 pt-6 text-center font-medium text-ink/60">
        <p>© {year} 99x. All rights reserved.</p>
        <ul className="flex flex-wrap justify-center gap-6">
          {site.legal.map((l) => <li key={l.href}><SmartLink link={l} className="hover:text-ink" /></li>)}
        </ul>
      </div>
    </footer>
  );
}
