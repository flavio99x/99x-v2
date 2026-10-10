import { describe, it, expect } from "vitest";
import { nextIndex } from "@/components/sections/PageView";
import { getPage } from "@/content";

describe("nextIndex", () => {
  it("numbers the next-page tag after the page's last section", () => {
    expect(nextIndex(getPage("home"))).toBe("S.09");
    expect(nextIndex(getPage("about"))).toBe("S.09");
    expect(nextIndex(getPage("nearshore-usa"))).toBe("S.07");
  });
});
