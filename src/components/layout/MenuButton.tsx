"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const MenuButton = forwardRef<HTMLButtonElement, { open: boolean; onClick: () => void; tone: "dark" | "light" }>(
  function MenuButton({ open, onClick, tone }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={onClick}
        className="flex items-center gap-3"
      >
        <span className="text-body-s font-medium">{open ? "Close" : "Menu"}</span>
        <span
          className={cn(
            "relative grid size-12 place-items-center rounded-full border transition-colors duration-500 ease-house",
            open ? "border-accent bg-accent text-ink" : tone === "light" ? "border-paper/40" : "border-ink/40",
          )}
        >
          <span className={cn("absolute h-px w-4 bg-current transition-transform duration-[1200ms] ease-house", open ? "rotate-45" : "-translate-y-[3px]")} />
          <span className={cn("absolute h-px w-4 bg-current transition-transform duration-[1200ms] ease-house", open ? "-rotate-45" : "translate-y-[3px]")} />
        </span>
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
    );
  },
);
