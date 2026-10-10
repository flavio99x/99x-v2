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
  it("visible items keep at least 3:1 contrast (opacity floor 0.55); depth fades via foreshortening", () => {
    const r = cylinderItem(0, 5, 18); // 90°: edge-on, so the floor is not perceived
    expect(r.visible).toBe(true);
    expect(r.opacity).toBeCloseTo(0.55);
    expect(cylinderItem(0, 1, 18).opacity).toBeCloseTo(Math.cos(Math.PI / 10)); // 18°: cosine falloff above the floor
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
