import { test, expect } from "@playwright/test";
test.use({ javaScriptEnabled: false });

for (const path of ["/", "/about-us", "/services", "/services/nearshore-tech-talent-usa", "/contact"]) {
  test(`${path} is readable without JS`, async ({ page }) => {
    await page.goto(path);
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
  await expect(page).toHaveURL(/\/contact\/sent$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/we've got your message/i);
});

test("native validation blocks an empty submission without JS", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("form[action='/api/contact']")).not.toHaveAttribute("novalidate");
  await page.getByRole("button", { name: /send/i }).click();
  await expect(page).toHaveURL(/\/contact$/);
  expect(await page.getByLabel(/^Name/).evaluate((el) => (el as HTMLInputElement).validity.valueMissing)).toBe(true);
});

test("the no-JS error page offers a way forward", async ({ page }) => {
  await page.goto("/contact/error");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("main").getByRole("link", { name: /hello\.norway@99x\.io/ })).toHaveAttribute("href", "mailto:hello.norway@99x.io");
});
