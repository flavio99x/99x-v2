import { test, expect } from "@playwright/test";

const chain = ["/", "/about-us", "/services", "/services/nearshore-tech-talent-usa", "/contact", "/"];

test("next-page chain and back/forward keep the page healthy", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/");
  for (let i = 1; i < chain.length; i++) {
    const panel = page.locator("[data-next-page]");
    await panel.scrollIntoViewIfNeeded();
    await panel.getByRole("link").click();
    await expect(page).toHaveURL(new RegExp(`${chain[i].replace(/\//g, "\\/")}$`));
    await expect(page.locator("h1")).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();
  }
  for (let i = 0; i < 4; i++) {
    await page.goBack();
    await expect(page.locator("h1")).toBeVisible();
  }
  // no leftover pin spacers from previous pages
  const spacers = await page.locator(".pin-spacer").count();
  const pinnedSections = await page.locator("[data-pinned]").count();
  expect(spacers).toBeLessThanOrEqual(pinnedSections + 3);
});

test("browser back closes an open menu", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /menu/i });
  await button.click();
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(button).toHaveAttribute("aria-expanded", "false");
});
