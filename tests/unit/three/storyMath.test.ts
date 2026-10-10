import { describe, it, expect } from "vitest";
import { storyStep, pieceTarget } from "@/components/three/storyMath";

describe("storyStep", () => {
  it("has intro, 5 steps and outro", () => {
    expect(storyStep(0.05, 5).phase).toBe("intro");
    expect(storyStep(0.11, 5)).toMatchObject({ phase: "steps", active: 0 });
    expect(storyStep(0.5, 5)).toMatchObject({ phase: "steps", active: 2 });
    expect(storyStep(0.89, 5)).toMatchObject({ phase: "steps", active: 4 });
    expect(storyStep(0.95, 5).phase).toBe("outro");
  });
});

describe("pieceTarget", () => {
  it("is assembled at the start and the end", () => {
    for (const p of [0, 1]) for (let i = 0; i < 5; i++) {
      expect(pieceTarget(i, p, 5)).toEqual({ pos: [0, 0, 0], rot: [0, 0, 0], dim: 0 });
    }
  });
  it("brings the active piece forward and dims the others", () => {
    const mid = 0.1 + (0.8 / 5) * 2.5; // middle of step 2
    const active = pieceTarget(2, mid, 5);
    const other = pieceTarget(0, mid, 5);
    expect(active.pos[2]).toBeCloseTo(0.6);
    expect(active.dim).toBe(0);
    expect(other.dim).toBeCloseTo(0.6);
  });
  it("swings the active piece gently, never edge-on", () => {
    for (let k = 0; k <= 50; k++) {
      const prog = 0.1 + (0.8 / 5) * (2 + k / 50) - 1e-9;
      expect(Math.abs(pieceTarget(2, prog, 5).rot[1])).toBeLessThan(Math.PI / 4);
    }
  });
});
