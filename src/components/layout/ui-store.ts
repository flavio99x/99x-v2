"use client";
import { useSyncExternalStore } from "react";

type Ui = { menuOpen: boolean };
let state: Ui = { menuOpen: false };
const subs = new Set<() => void>();

const set = (patch: Partial<Ui>) => {
  state = { ...state, ...patch };
  subs.forEach((s) => s());
};

export const getUi = () => state;
export const setMenuOpen = (menuOpen: boolean) => set({ menuOpen });
export const useUi = () =>
  useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => state,
    () => state,
  );
