import { cn } from "@/lib/cn";

type Props = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  size?: "m" | "s";
  className?: string;
  as?: "p" | "span" | "h2" | "h3";
  [data: `data-${string}`]: string | number | boolean | undefined;
};

export function Eyebrow({ children, size = "m", className, as: Tag = "p", ...rest }: Props) {
  return (
    <Tag {...rest} className={cn("font-mono font-light uppercase", size === "m" ? "text-eyebrow-m" : "text-eyebrow-s", className)}>
      {children}
    </Tag>
  );
}
