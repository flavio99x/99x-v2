import type { SectionHead, Theme } from "@/content/schema";
import { SectionTag } from "@/components/ui/SectionTag";
import { ScrubText } from "@/components/motion/ScrubText";
import { cn } from "@/lib/cn";

const themeClass: Record<Theme, string> = {
  dark: "bg-ink text-paper",
  paper: "bg-paper text-ink",
  tint: "bg-tint text-ink",
};

type Props = {
  theme: Theme;
  head?: SectionHead;
  id?: string;
  className?: string;
  /** Full-bleed stage that draws its own edges (e.g. the pinned timeline): no section padding. */
  flush?: boolean;
  /** false: the section renders its own tag (e.g. inside a pinned stage so it stays visible). */
  tag?: boolean;
  /** Hairline above the section tag (sticky-split sections). */
  rule?: boolean;
  children?: React.ReactNode;
};

export function SectionShell({ theme, head, id, className, flush = false, tag = true, rule = false, children }: Props) {
  return (
    <section
      id={id}
      data-theme={theme}
      aria-label={head?.label}
      className={cn(
        "relative",
        !flush && "site-x section-y",
        themeClass[theme],
        className,
      )}
    >
      {head && (
        <div className={cn("grid-12 mb-24 lg:mb-40", rule && "border-t pt-8", rule && (theme === "dark" ? "border-paper/20" : "border-ink/20"))}>
          <div className="col-span-12 lg:col-span-8">
            {tag && (
              <div className="mb-6">
                <SectionTag label={head.label} tone={theme === "dark" ? "light" : "dark"} />
              </div>
            )}
            {head.statement && <ScrubText as="h2" className="text-statement" text={head.statement} />}
            {!head.statement && <h2 className="sr-only">{head.label}</h2>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
