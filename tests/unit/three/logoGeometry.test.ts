import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { buildPieces, PIECE_COLORS, PIECE_GROUPS } from "@/components/three/logoGeometry";

const svg = readFileSync(path.join(process.cwd(), "public/brand/99x-logo.svg"), "utf8");
const fillOf = (id: string) => new RegExp(`id="${id}"[^>]*fill="(#[0-9A-Fa-f]{6})"`).exec(svg)?.[1]?.toUpperCase();

describe("buildPieces", () => {
  const pieces = buildPieces(svg);
  it("builds exactly 5 pieces in brand colours", () => {
    expect(pieces).toHaveLength(5);
    expect(pieces.map((p) => p.color.toUpperCase())).toEqual(PIECE_COLORS);
  });
  it("keeps every source path's original fill (9 tails stay bronze / brown)", () => {
    expect(pieces.map((p) => p.parts.map((pt) => pt.color.toUpperCase()))).toEqual(
      PIECE_GROUPS.map((ids) => ids.map(fillOf)),
    );
    expect(pieces[0].parts[1].color.toUpperCase()).toBe("#BC8E58");
    expect(pieces[1].parts[1].color.toUpperCase()).toBe("#905B54");
  });
  it("every part has non-empty geometry", () => {
    for (const p of pieces) for (const pt of p.parts) expect(pt.geometry.getAttribute("position").count).toBeGreaterThan(0);
  });
  it("the logo is centred around the origin", () => {
    const xs = pieces.map((p) => p.center.x);
    expect(Math.min(...xs)).toBeLessThan(0);
    expect(Math.max(...xs)).toBeGreaterThan(0);
  });
});
