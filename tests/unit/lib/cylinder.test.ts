import { describe, it, expect } from "vitest";
import { cylinderItem, timelineIndex } from "@/lib/cylinder";

describe("cylinderItem", () => {
  it("focused item faces the viewer at full opacity", () => {
    expect(cylinderItem(3, 3)).toEqual({ angle: 0, opacity: 1, visible: true });
  });
  it("names at rest keep >= 3:1 contrast (opacity .55) and fade out only past two steps", () => {
    expect(cylinderItem(4, 3).opacity).toBeCloseTo(0.55);
    expect(cylinderItem(1, 3).opacity).toBeCloseTo(0.55);
    expect(cylinderItem(3, 3.5).opacity).toBeCloseTo(0.775);
    expect(cylinderItem(0, 2.25).opacity).toBeCloseTo(0.275);
  });
  it("items more than 2.5 steps away are hidden (about five names visible)", () => {
    const r = cylinderItem(0, 3);
    expect(r.visible).toBe(false);
    expect(r.opacity).toBe(0);
    const shown = Array.from({ length: 12 }, (_, i) => cylinderItem(i, 5)).filter((x) => x.visible);
    expect(shown).toHaveLength(5);
  });
  it("clamps the rotation so names never shear into fake italics", () => {
    expect(cylinderItem(0, 10, 16).angle).toBe(-40);
    expect(cylinderItem(10, 0, 16).angle).toBe(40);
    expect(cylinderItem(4, 3, 16).angle).toBe(16);
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
