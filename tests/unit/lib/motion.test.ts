// tests/unit/lib/motion.test.ts
import { describe, it, expect, vi, afterEach } from "vitest";
import { prefersReducedMotion } from "@/lib/motion";

describe("prefersReducedMotion", () => {
  afterEach(() => vi.restoreAllMocks());
  it("is false by default", () => expect(prefersReducedMotion()).toBe(false));
  it("is true when the media query matches", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    expect(prefersReducedMotion()).toBe(true);
  });
});
