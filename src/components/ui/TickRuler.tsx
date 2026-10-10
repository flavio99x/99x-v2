import { cn } from "@/lib/cn";

const WIDTHS = [0.75, 0.875, 1, 1.25, 1.5, 1.25, 1, 0.875];

export function TickRuler({ count = 24, orientation = "vertical", progress = 0, className }: { count?: number; orientation?: "vertical" | "horizontal"; progress?: number; className?: string }) {
  const active = Math.round(progress * count);
  return (
    <div aria-hidden="true" className={cn("flex justify-between", orientation === "vertical" ? "h-full flex-col" : "w-full flex-row", className)}>
      {Array.from({ length: count }, (_, i) => {
        const w = WIDTHS[i % WIDTHS.length];
        return (
          <span
            key={i}
            className="block bg-current transition-opacity duration-300"
            style={{
              opacity: i < active ? 0.75 : 0.2,
              ...(orientation === "vertical" ? { height: 1, width: `calc(var(--u) * ${w})` } : { width: 1, height: `calc(var(--u) * ${w})` }),
            }}
          />
        );
      })}
    </div>
  );
}
