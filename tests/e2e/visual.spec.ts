import { test } from "@playwright/test";

for (const path of ["/", "/about-us", "/services", "/services/nearshore-tech-talent-usa", "/contact"]) {
  test(`capture ${path}`, async ({ page }, info) => {
    await page.goto(path);
    await page.waitForTimeout(3500);
    const name = path === "/" ? "home" : path.slice(1).replace(/\//g, "_");
    await page.screenshot({ path: `test-results/visual/${info.project.name}-${name}.png`, fullPage: false });
  });
}
