import { describe, it, expect } from "vitest";
import { isLowPowerDevice } from "@/components/three/lowPower";

const nav = (hardwareConcurrency: number | undefined, saveData?: boolean) =>
  ({ hardwareConcurrency, ...(saveData === undefined ? {} : { connection: { saveData } }) }) as unknown as Navigator;

describe("isLowPowerDevice", () => {
  it("is true only with <= 4 cores AND save-data on", () => {
    expect(isLowPowerDevice(nav(4, true))).toBe(true);
    expect(isLowPowerDevice(nav(2, true))).toBe(true);
    expect(isLowPowerDevice(nav(8, true))).toBe(false);
    expect(isLowPowerDevice(nav(4, false))).toBe(false);
    expect(isLowPowerDevice(nav(4))).toBe(false);
  });
  it("is false when the browser exposes nothing", () => {
    expect(isLowPowerDevice(nav(undefined, true))).toBe(false);
    expect(isLowPowerDevice({} as Navigator)).toBe(false);
  });
});
