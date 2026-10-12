"use client";
import { forwardRef } from "react";

// Osmo nav toggle: two bars that cross into an X; the label stays "Menu" and aria-expanded carries the state.
export const MenuButton = forwardRef<HTMLButtonElement, { open: boolean; onClick: () => void }>(
  function MenuButton({ open, onClick }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={onClick}
        className="flex h-10 items-center gap-2.5 rounded-xs pr-4 pl-2.5 transition-[background-color,gap] duration-600 ease-nav in-data-[nav=open]:gap-0.75 hover-fine:hover:bg-paper/6"
      >
        <span aria-hidden="true" className="nav-burger relative flex h-1.75 w-5.5 flex-col items-center justify-center">
          <span className="absolute h-px w-full bg-current" />
          <span className="absolute h-px w-full bg-current" />
        </span>
        <span className="mb-px text-[calc(var(--u)*1.125)] leading-none font-medium tracking-[-0.02em]">Menu</span>
      </button>
    );
  },
);
