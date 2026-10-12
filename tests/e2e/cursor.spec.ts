import { test, expect } from "@playwright/test";

// Every visible, enabled button and link must show the hand cursor.
const offenders = () =>
  Array.from(document.querySelectorAll<HTMLElement>("a[href], button, [role='button'], [role='tab']"))
    .filter((el) => el.getClientRects().length > 0 && !el.matches(":disabled, [aria-disabled='true']") && !el.closest("[inert]"))
    .filter((el) => getComputedStyle(el).cursor !== "pointer")
    .map((el) => `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40)}"`);

for (const path of ["/", "/about-us", "/services", "/services/nearshore-tech-talent-usa", "/contact"]) {
  test(`${path}: buttons and links use cursor pointer`, async ({ page }) => {
    await page.goto(path);
    expect(await page.evaluate(offenders)).toEqual([]);
  });
}

test("open menu: buttons and links use cursor pointer", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /menu/i }).click();
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link").first()).toBeFocused();
  expect(await page.evaluate(offenders)).toEqual([]);
});
