"use client";
import { useSyncExternalStore } from "react";
import type { Theme } from "@/content/schema";

type Ui = { menuOpen: boolean; headerTheme: Theme; headerHidden: boolean };
let state: Ui = { menuOpen: false, headerTheme: "dark", headerHidden: false };
const subs = new Set<() => void>();

const set = (patch: Partial<Ui>) => {
  state = { ...state, ...patch };
  subs.forEach((s) => s());
};

export const getUi = () => state;
export const setMenuOpen = (menuOpen: boolean) => set({ menuOpen });
export const setHeaderTheme = (headerTheme: Theme) => set({ headerTheme });
export const setHeaderHidden = (headerHidden: boolean) => set({ headerHidden });
export const useUi = () =>
  useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => state,
    () => state,
  );
