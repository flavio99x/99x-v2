import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });

test("reduced motion: no loader, static 3D fallback, static lists", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-loader]")).toBeHidden();
  await expect(page.locator("section[aria-label='Locations'] canvas")).toHaveCount(0);
  await expect(page.locator("section[aria-label='Locations'] svg path").first()).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});
