import { test, expect } from "@playwright/test";

test("old contact URL redirects permanently", async ({ request }) => {
  const res = await request.get("/about-us/contact-us", { maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers()["location"]).toContain("/contact");
});

test("form shows validation errors, then sends", async ({ page }) => {
  // Each submitting test is its own client, so the API's per-IP rate limit (5 / 10 min) isn't shared across projects and re-runs.
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.18.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` });
  await page.goto("/contact");
  await page.getByRole("button", { name: /send/i }).click();
  await expect(page.getByText("Please tell us your name.")).toBeVisible();
  await page.getByLabel(/^Name/).fill("Ada Lovelace");
  await page.getByLabel(/^Email/).fill("ada@example.com");
  await page.getByLabel(/^Message/).fill("We need a team of five engineers for a new product.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /send/i }).click();
  await expect(page.getByRole("status")).toContainText(/thanks/i);
});
