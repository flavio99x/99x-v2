import { cn } from "@/lib/cn";

export function SectionTag({ index, label, tone = "dark" }: { index: string; label: string; tone?: "dark" | "light" }) {
  const line = tone === "dark" ? "border-ink" : "border-paper";
  return (
    <span className="mr-4 inline-flex w-fit translate-y-[-0.35em] flex-col align-middle font-mono text-eyebrow-s font-light uppercase">
      <span className={cn("self-start rounded-t-sm border px-1.5 py-1", line)}>{index}</span>
      <span className={cn("rounded-sm rounded-tl-none border px-1.5 py-1", line, tone === "dark" ? "bg-ink text-paper" : "bg-paper text-ink")}>
        {label}
      </span>
    </span>
  );
}
