import { test, expect } from "@playwright/test";

for (const path of ["/", "/about-us", "/services", "/services/nearshore-tech-talent-usa", "/contact"]) {
  test(`${path} has one h1, title, description and JSON-LD`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/99x/);
    expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(JSON.parse(ld!)["@type"]).toBe("Organization");
  });
}

test("unknown route renders the 404 page", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.locator("#main").getByRole("link", { name: /home/i })).toBeVisible();
});
