import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const path of ["/", "/about-us", "/services", "/services/nearshore-tech-talent-usa", "/contact"]) {
  test(`${path} has no serious axe violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(3000); // let the hero reveal finish
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious.map((v) => [v.id, v.nodes.map((n) => n.target)]), null, 2)).toEqual([]);
  });
}

test("open menu has no serious axe violations", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(3000); // let the hero reveal finish
  await page.getByRole("button", { name: /menu/i }).click();
  await page.waitForTimeout(1500); // panel unfolds and its columns settle
  const results = await new AxeBuilder({ page }).include("[data-nav-bar]").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious, JSON.stringify(serious.map((v) => [v.id, v.nodes.map((n) => n.target)]), null, 2)).toEqual([]);
});

test("proof toggle is keyboard operable", async ({ page }) => {
  await page.goto("/");
  const tab = page.getByRole("tab", { name: "01" }).first();
  await tab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "02" }).first()).toHaveAttribute("aria-selected", "true");
});

test("video lightbox opens and closes with keyboard", async ({ page }) => {
  await page.goto("/about-us");
  const open = page.getByRole("button", { name: "Watch: This is 99x" });
  await open.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("dialog[open] iframe")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
});

test("statement text keeps its full sentence for screen readers", async ({ page }) => {
  await page.goto("/");
  const h2 = page.locator("section[aria-label='About us'] h2").first();
  await expect(h2).toHaveAccessibleName(/trusted 99x to shape their products/);
});
