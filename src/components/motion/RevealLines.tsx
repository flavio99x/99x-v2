// src/components/motion/RevealLines.tsx
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type Props = {
  as?: "h1" | "h2" | "p" | "div";
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
};

// Masked line reveal, driven by CSS (.reveal-line in globals.css) so it plays from first paint.
export function RevealLines({ as: Tag = "h1", lines, className, lineClassName, delay = 0 }: Props) {
  return (
    // aria-label keeps the sentence intact for screen readers; visual lines are aria-hidden.
    <Tag className={className} aria-label={lines.join(" ")} style={delay ? ({ "--delay": `${delay}s` } as CSSProperties) : undefined}>
      {lines.map((line, i) => (
        <span key={i} className={cn("mask-line", lineClassName)} aria-hidden="true">
          <span className="reveal-line block" style={{ "--i": i } as CSSProperties}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
