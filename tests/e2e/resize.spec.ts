import { test, expect } from "@playwright/test";

test("resizing through breakpoints mid-page leaves no overlapping sections", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator("[aria-label='Locations']").scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 1500);
  for (const w of [800, 375, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(400);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator("footer")).toBeInViewport();
  // sections stack in document order without overlap
  const tops = await page.locator("main section").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().top + window.scrollY));
  for (let i = 1; i < tops.length; i++) expect(tops[i]).toBeGreaterThanOrEqual(tops[i - 1]);
});
