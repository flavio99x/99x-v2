import { describe, it, expect } from "vitest";
import { getUi, setMenuOpen } from "@/components/layout/ui-store";

describe("ui store", () => {
  it("toggles the menu", () => {
    setMenuOpen(true);
    expect(getUi().menuOpen).toBe(true);
    setMenuOpen(false);
    expect(getUi().menuOpen).toBe(false);
  });
});
