import { cn } from "@/lib/cn";
import type { Link } from "@/content/schema";
import { SmartLink } from "./SmartLink";

export function ButtonSm({ link, className }: { link: Link; className?: string }) {
  return (
    <SmartLink
      link={link}
      className={cn(
        "group/sm inline-flex h-7 min-h-7 items-center gap-2 overflow-hidden rounded-xs bg-paper px-2 text-ink transition-colors duration-500 ease-house hover:bg-accent focus-visible:bg-accent",
        className,
      )}
    >
      <span className="font-mono text-eyebrow-s font-light uppercase transition-transform duration-500 ease-house group-hover/sm:translate-x-1">
        {link.label}
      </span>
      <svg aria-hidden="true" viewBox="0 0 12 12" className="size-2 fill-current"><path d="M3 1.5v9L10 6z" /></svg>
    </SmartLink>
  );
}
