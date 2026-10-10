import { test, expect } from "@playwright/test";

test.describe("menu", () => {
  test("opens with click, traps focus, closes with Escape", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: /menu/i });
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav).toBeVisible();
    // Focus moves into the dialog on open
    await expect(nav.getByRole("link").first()).toBeFocused();
    await expect(nav.getByRole("link", { name: "About us" })).toBeVisible();
    // Tab many times: focus must stay inside the menu dialog
    for (let i = 0; i < 25; i++) await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => !!document.activeElement?.closest("[data-menu]"));
    expect(inside).toBe(true);
    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("menu link navigates and closes the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /menu/i }).click();
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("button", { name: /menu/i })).toHaveAttribute("aria-expanded", "false");
  });

  test("skip link moves focus to main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });
});

test("menu link to the current page closes the menu", async ({ page }) => {
  await page.goto("/contact");
  const button = page.getByRole("button", { name: /menu/i });
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Contact" }).click();
  await expect(button).toHaveAttribute("aria-expanded", "false");
});
