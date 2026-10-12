import { test, expect } from "@playwright/test";

test.describe("fluid scale", () => {
  test("1u = 16px at 1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const size = await page.evaluate(() => getComputedStyle(document.body).fontSize);
    expect(size).toBe("16px");
  });
  test("1u = 20px at 1800", async ({ page }) => {
    await page.setViewportSize({ width: 1800, height: 900 });
    await page.goto("/");
    const size = await page.evaluate(() => getComputedStyle(document.body).fontSize);
    expect(size).toBe("20px");
  });
  test("display font is Inter Tight", async ({ page }) => {
    await page.goto("/");
    const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(family.toLowerCase()).toContain("inter tight");
  });
});
