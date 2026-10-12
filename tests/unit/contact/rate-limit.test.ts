import { describe, it, expect } from "vitest";
import { createRateLimiter } from "@/lib/contact/rate-limit";

describe("rate limiter", () => {
  it("allows up to the limit within the window, then blocks, then resets", () => {
    const rl = createRateLimiter({ limit: 3, windowMs: 60_000 });
    expect(rl.hit("ip", 0)).toBe(true);
    expect(rl.hit("ip", 1)).toBe(true);
    expect(rl.hit("ip", 2)).toBe(true);
    expect(rl.hit("ip", 3)).toBe(false);
    expect(rl.hit("other", 3)).toBe(true);
    expect(rl.hit("ip", 60_001)).toBe(true);
  });
});
