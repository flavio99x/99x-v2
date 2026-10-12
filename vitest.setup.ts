import "@testing-library/jest-dom/vitest";

// jsdom lacks matchMedia; default to "no reduced motion"
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// vitest globals are off, so RTL's automatic cleanup is not registered
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(() => {
  if (typeof document !== "undefined") cleanup();
});
