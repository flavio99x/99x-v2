import { describe, it, expect } from "vitest";
import { cylinderItem, timelineIndex } from "@/lib/cylinder";

describe("cylinderItem", () => {
  it("focused item faces the viewer at full opacity", () => {
    expect(cylinderItem(3, 3)).toEqual({ angle: 0, opacity: 1, visible: true });
  });
  it("items beyond 90° are hidden", () => {
    const r = cylinderItem(0, 10, 18);
    expect(r.visible).toBe(false);
    expect(r.opacity).toBe(0);
  });
  it("opacity never drops below 0.08 while visible", () => {
    const r = cylinderItem(0, 5, 18); // 90°
    expect(r.visible).toBe(true);
    expect(r.opacity).toBeCloseTo(0.08);
  });
});

describe("timelineIndex", () => {
  it("maps progress to index and clamps", () => {
    expect(timelineIndex(0, 7)).toBe(0);
    expect(timelineIndex(0.5, 7)).toBe(3);
    expect(timelineIndex(1, 7)).toBe(6);
    expect(timelineIndex(1.2, 7)).toBe(6);
    expect(timelineIndex(-1, 7)).toBe(0);
  });
});
