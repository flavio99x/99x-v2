// tests/unit/lib/loader.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("loader signal", () => {
  beforeEach(() => vi.resetModules());
  it("fires subscribers once when marked done", async () => {
    const { onLoaderDone, markLoaderDone } = await import("@/lib/loader");
    const cb = vi.fn();
    onLoaderDone(cb);
    markLoaderDone();
    markLoaderDone();
    expect(cb).toHaveBeenCalledTimes(1);
  });
  it("calls immediately when already done", async () => {
    const { onLoaderDone, markLoaderDone } = await import("@/lib/loader");
    markLoaderDone();
    const cb = vi.fn();
    onLoaderDone(cb);
    expect(cb).toHaveBeenCalledTimes(1);
  });
  it("unsubscribe prevents the call", async () => {
    const { onLoaderDone, markLoaderDone } = await import("@/lib/loader");
    const cb = vi.fn();
    const off = onLoaderDone(cb);
    off();
    markLoaderDone();
    expect(cb).not.toHaveBeenCalled();
  });
});
