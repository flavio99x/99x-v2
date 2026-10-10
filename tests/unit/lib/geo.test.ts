import { describe, it, expect } from "vitest";
import { project } from "@/lib/geo";

describe("project", () => {
  it("maps lat/lng to an equirectangular canvas", () => {
    expect(project(0, 0, 360, 180)).toEqual({ x: 180, y: 90 });
    expect(project(90, -180, 360, 180)).toEqual({ x: 0, y: 0 });
    expect(project(-90, 180, 360, 180)).toEqual({ x: 360, y: 180 });
  });
});
