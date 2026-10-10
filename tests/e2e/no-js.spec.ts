import { test, expect } from "@playwright/test";
test.use({ javaScriptEnabled: false });

for (const path of ["/", "/about-us", "/services", "/services/nearshore-tech-talent-usa", "/contact"]) {
  test(`${path} is readable without JS`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("[data-loader]")).toBeHidden();
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });
}

test("contact form posts natively and redirects", async ({ page }) => {
  // Each submitting test is its own client, so the API's per-IP rate limit (5 / 10 min) isn't shared across projects and re-runs.
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.19.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` });
  await page.goto("/contact");
  await page.getByLabel(/^Name/).fill("Ada");
  await page.getByLabel(/^Email/).fill("ada@example.com");
  await page.getByLabel(/^Message/).fill("Native form submission without JavaScript.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /send/i }).click();
  await expect(page).toHaveURL(/\/contact\?sent=1/);
});
