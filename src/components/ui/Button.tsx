import { cn } from "@/lib/cn";
import type { Link } from "@/content/schema";
import { SmartLink } from "./SmartLink";

type Variant = "dark" | "light" | "next";
type Size = "md" | "xl";

const shell: Record<Variant, string> = {
  dark: "bg-ink text-paper",
  light: "bg-paper text-ink",
  next: "bg-paper text-ink",
};
const arrowFront: Record<Variant, string> = {
  dark: "bg-paper text-ink",
  light: "bg-ink text-paper",
  next: "bg-accent text-ink",
};

function Arrow({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("grid size-8 shrink-0 place-items-center rounded-sm", className)}>
      <svg viewBox="0 0 12 12" className="size-3 fill-current"><path d="M3 1.5v9L10 6z" /></svg>
    </span>
  );
}

export function ButtonInner({ label, variant = "dark", size = "md" }: { label: string; variant?: Variant; size?: Size }) {
  return (
    <span className={cn("group/btn relative inline-flex overflow-hidden rounded-md p-1", shell[variant])}>
      <span className="flex items-center transition-transform duration-500 ease-house group-hover/btn:translate-x-9 group-focus-visible/btn:translate-x-9">
        {/* hidden accent arrow that slides in from the left */}
        <Arrow className="absolute -left-8 bg-accent text-ink" />
        <span className={cn("font-mono font-light uppercase", size === "xl" ? "px-8 text-body-m" : "px-6 text-button")}>{label}</span>
        <Arrow className={cn(arrowFront[variant], "transition-opacity duration-500 group-hover/btn:opacity-0")} />
      </span>
    </span>
  );
}

export function Button({ link, variant = "dark", size = "md", className }: { link: Link; variant?: Variant; size?: Size; className?: string }) {
  return (
    <SmartLink link={link} className={cn("group/btn inline-block min-h-11", className)}>
      <ButtonInner label={link.label} variant={variant} size={size} />
    </SmartLink>
  );
}

export function ButtonAction({
  children, type = "button", variant = "dark", disabled, className,
}: { children: string; type?: "button" | "submit"; variant?: Variant; disabled?: boolean; className?: string }) {
  return (
    <button type={type} disabled={disabled} className={cn("group/btn inline-block min-h-11 disabled:opacity-50", className)}>
      <ButtonInner label={children} variant={variant} />
    </button>
  );
}
