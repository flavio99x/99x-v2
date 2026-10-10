"use client";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type Props = {
  items: string[];
  value: number;
  onChange: (i: number) => void;
  label: string;
  idPrefix: string;
  tone?: "ink" | "tint" | "paper";
};

const tones = {
  ink: { bg: "bg-ink", idle: "text-paper", active: "text-ink", ind: "bg-paper" },
  tint: { bg: "bg-tint", idle: "text-ink", active: "text-paper", ind: "bg-ink" },
  paper: { bg: "bg-paper", idle: "text-ink", active: "text-paper", ind: "bg-ink" },
};

export function Toggle({ items, value, onChange, label, idPrefix, tone = "ink" }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = tones[tone];

  const move = (next: number) => {
    const i = (next + items.length) % items.length;
    onChange(i);
    refs.current[i]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className={cn("relative inline-flex rounded-md p-1", t.bg)}>
      <span
        aria-hidden="true"
        className={cn("absolute top-1 left-1 size-[calc(var(--u)*2.125)] rounded-sm transition-transform duration-500 ease-house", t.ind)}
        style={{ transform: `translateX(calc(${value} * var(--u) * 2.125))` }}
      />
      {items.map((item, i) => (
        <button
          key={item}
          ref={(el) => { refs.current[i] = el; }}
          role="tab"
          id={`${idPrefix}-tab-${i}`}
          aria-controls={`${idPrefix}-panel-${i}`}
          aria-selected={i === value}
          tabIndex={i === value ? 0 : -1}
          onClick={() => onChange(i)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); move(value + 1); }
            if (e.key === "ArrowLeft") { e.preventDefault(); move(value - 1); }
            if (e.key === "Home") { e.preventDefault(); move(0); }
            if (e.key === "End") { e.preventDefault(); move(items.length - 1); }
          }}
          className={cn(
            "relative z-10 grid size-[calc(var(--u)*2.125)] place-items-center font-mono text-eyebrow-s font-light transition-colors duration-500",
            i === value ? t.active : t.idle,
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
