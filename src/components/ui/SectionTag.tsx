import { cn } from "@/lib/cn";

export function SectionTag({ label, tone = "dark" }: { label: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-sm px-1.5 py-1 font-mono text-eyebrow-s font-light uppercase",
        tone === "dark" ? "bg-ink text-paper" : "bg-paper text-ink",
      )}
    >
      {label}
    </span>
  );
}
