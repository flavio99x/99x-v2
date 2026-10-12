import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: "http://localhost:3100", trace: "on-first-retry" },
  webServer: {
    command: "pnpm build && pnpm start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    // `next start` reads .env; never let the suite send real contact emails through Resend.
    env: { CONTACT_PROVIDER: "log" },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } },
    {
      name: "reduced-motion",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" },
    },
  ],
});
