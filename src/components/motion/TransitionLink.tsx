"use client";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { usePageTransition } from "./PageTransition";

type Props = ComponentProps<typeof NextLink> & { variant?: "fade" | "next" };

export function TransitionLink({ href, variant = "fade", onClick, ...rest }: Props) {
  const { navigate } = usePageTransition();
  return (
    <NextLink
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        const target = typeof href === "string" ? href : href.pathname ?? "/";
        if (target.includes("#") && target.split("#")[0] === window.location.pathname) return; // same-page anchor
        e.preventDefault();
        const from = (e.currentTarget.closest("[data-next-page]") as HTMLElement | null) ?? undefined;
        void navigate(target, { variant, from });
      }}
      {...rest}
    />
  );
}
