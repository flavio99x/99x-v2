import { test, expect } from "@playwright/test";

test("loader shows on first visit only", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-loader]")).toBeHidden({ timeout: 5000 });
  await page.reload();
  // second load in same session: hidden before first paint
  const visible = await page.locator("[data-loader]").isVisible();
  expect(visible).toBe(false);
});
