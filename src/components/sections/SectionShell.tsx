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
  bottom?: "lg" | "md" | "none";
  /** false: the section renders its own tag (e.g. inside a pinned stage so it stays visible). */
  tag?: boolean;
  children?: React.ReactNode;
};

export function SectionShell({ theme, head, id, className, bottom = "lg", tag = true, children }: Props) {
  return (
    <section
      id={id}
      data-theme={theme}
      aria-label={head?.label}
      className={cn(
        "relative site-x pt-8",
        themeClass[theme],
        bottom === "lg" && "pb-40 lg:pb-64",
        bottom === "md" && "pb-32 lg:pb-48",
        className,
      )}
    >
      {head && (
        <div className="grid-12 mb-24 lg:mb-40">
          <div className="col-span-12 lg:col-span-8">
            {tag && (
              <span className="float-left">
                <SectionTag index={head.index} label={head.label} tone={theme === "dark" ? "light" : "dark"} />
              </span>
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
