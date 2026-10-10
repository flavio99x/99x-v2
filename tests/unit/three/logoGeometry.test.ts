import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { buildPieces, PIECE_COLORS } from "@/components/three/logoGeometry";

const svg = readFileSync(path.join(process.cwd(), "public/brand/99x-logo.svg"), "utf8");

describe("buildPieces", () => {
  const pieces = buildPieces(svg);
  it("builds exactly 5 pieces in brand colours", () => {
    expect(pieces).toHaveLength(5);
    expect(pieces.map((p) => p.color.toUpperCase())).toEqual(PIECE_COLORS);
  });
  it("every piece has non-empty geometry", () => {
    for (const p of pieces) expect(p.geometry.getAttribute("position").count).toBeGreaterThan(0);
  });
  it("the logo is centred around the origin", () => {
    const xs = pieces.map((p) => p.center.x);
    expect(Math.min(...xs)).toBeLessThan(0);
    expect(Math.max(...xs)).toBeGreaterThan(0);
  });
});
