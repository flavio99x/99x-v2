"use client";
import { setMenuOpen } from "./ui-store";
import { SmartLink } from "@/components/ui/SmartLink";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";
import type { Site } from "@/content/schema";

const close = () => setMenuOpen(false);

/** Contents of the unfolding nav panel: one column per nav group, then a contact card. Each `.nav-col`
 *  rises in on open, staggered by its `--i`. */
export function Menu({ site }: { site: Site }) {
  const { contact } = site.footer;
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:flex lg:flex-row">
      <nav aria-label="Main" className="contents">
        {site.nav.map((group, i) => (
          <div
            key={group.label}
            style={{ "--i": i } as React.CSSProperties}
            className={cn("nav-col flex w-full flex-col gap-5.5 rounded-[var(--u)] p-6 lg:p-10", i === 0 && "bg-paper/5")}
          >
            <Eyebrow className="text-paper/60">{group.label}</Eyebrow>
            <ul>
              {group.links.map((l) => (
                <li key={l.href} className="border-b border-paper/10 last:border-0">
                  <SmartLink link={l} onClick={close} className="flex w-full items-center pt-4.25 pb-4.5">
                    <span className="nav-underline text-nav">{l.label}</span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div
        style={{ "--i": site.nav.length } as React.CSSProperties}
        className="nav-col flex w-full flex-col justify-between gap-10 rounded-[var(--u)] bg-accent p-6 text-ink lg:p-10"
      >
        <div className="flex flex-col gap-5.5">
          <Eyebrow className="text-ink/75">{site.cta.label}</Eyebrow>
          <ul>
            <li className="border-b border-ink/15">
              <a href={`mailto:${contact.email}`} className="flex w-full pt-4.25 pb-4.5"><span className="nav-underline text-nav">{contact.email}</span></a>
            </li>
            <li>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex w-full pt-4.25 pb-4.5"><span className="nav-underline text-nav">{contact.phone}</span></a>
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex gap-2">
            {site.socials.map((s) => (
              <a key={s.href} href={s.href} rel="noopener" aria-label={s.label} className="grid size-10 place-items-center rounded-full bg-ink/10 transition-colors duration-200 hover:bg-ink/20">
                <SocialIcon name={s.icon} className="size-4" />
              </a>
            ))}
          </div>
          <div className="flex gap-4 text-body-s font-medium">
            {site.languages.map((lang) => (
              <SmartLink
                key={lang.code}
                link={{ label: lang.label, href: lang.href, external: lang.href.startsWith("https://") }}
                onClick={close}
                className={lang.active ? "underline underline-offset-4" : "text-ink/75 hover:text-ink"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
