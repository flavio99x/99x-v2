import { test, expect } from "@playwright/test";

test("loader shows on first visit only", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-loader]")).toBeHidden({ timeout: 5000 });
  await page.reload();
  // second load in same session: hidden before first paint
  const visible = await page.locator("[data-loader]").isVisible();
  expect(visible).toBe(false);
});

test("loader gets out of the way even if the JS bundles never load", async ({ page }) => {
  // Abort the JS chunks only; the stylesheet (also under /chunks/) must still load.
  await page.route((url) => url.pathname.startsWith("/_next/static/chunks/") && url.pathname.endsWith(".js"), (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("[data-loader]")).toBeHidden({ timeout: 5000 });
  await expect(page.locator("h1")).toBeVisible();
});
