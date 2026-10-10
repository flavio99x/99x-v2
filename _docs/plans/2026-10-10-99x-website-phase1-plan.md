# 99x Website Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first 5 pages of the new 99x website (Home, About us, Services, Nearshore Tech Talent USA, Contact) on Next.js, recreating the cominvi.com.mx design system with 99x content, including a scroll-driven 3D logo.

**Architecture:** Static App Router pages render typed content objects (`src/content`) through a `SectionRenderer` into server-rendered section components; motion and interactivity live in small client islands (GSAP + ScrollTrigger + SplitText, Lenis). The 3D logo is a React Three Fiber scene dynamically imported only on Home. A contact route handler validates with zod and sends through a pluggable provider.

**Tech Stack:** Next.js 16.4, React 19.3, TypeScript (strict), Tailwind CSS 4.3, GSAP 3.15 + @gsap/react 2.1, Lenis 1.3, three 0.186 + @react-three/fiber 9.8 + @react-three/drei 10.7, zod 4, Vitest 5 + Testing Library, Playwright 1.64 + @axe-core/playwright, sharp (asset script), pnpm, Vercel.

**Spec:** `_docs/specs/2026-10-10-99x-website-phase1-design.md` (read it before starting any task). Supporting: `_docs/reference/cominvi-design-analysis.md` + `_docs/reference/cominvi-shots/` (visual target), `_docs/content/source/*.md` (current 99x content), `_docs/content/open-questions.md`.

## Global Constraints

- All docs / `.md` files go in `_docs/` — except `CLAUDE.md` / `AGENTS.md` at the repo root.
- Node ≥ 22, pnpm ≥ 10. TypeScript `strict: true`. No `any` in `src/` (use `unknown` + narrowing).
- Visual system = cominvi: tokens exactly as spec §5 (`ink #160F17`, `paper #FFFFFF`, `tint #EFE8F3`, `accent #C49FD5`, `accent-deep #4A3255`; logo colours only in logo/3D).
- Fonts: Inter Tight (500, 700) + Geist Mono (300) via `next/font/google` (CSS vars `--font-inter-tight` / `--font-geist-mono`), surfaced as Tailwind `font-display` / `font-mono`. Only these weights.
- Fluid scale: 1 unit (`--u`) = 16px at 1440px viewport; size everything with `calc(var(--u) * n)` via Tailwind tokens — never raw `px` for layout/type (1px hairlines excepted).
- House ease: `CustomEase "M0,0 C0.6,0 0,1 1,1"` (CSS fallback `cubic-bezier(.6,0,0,1)`); reveal 1.2s, hover 0.5s, card 0.8s `power2.out`.
- Copy: rewritten, sentence-case headings; mono labels uppercase via CSS (`uppercase`), never typed in caps in content. No invented clients, numbers, awards or testimonials — only facts present in `_docs/content/source/`.
- Every image has a meaningful `alt` (schema-enforced, min 3 chars, must not look like a filename).
- `prefers-reduced-motion: reduce` → no Lenis, no pins/scrubs, no 3D, instant/short fades.
- Unbuilt pages link to `https://99x.io/...` (external flag in content).
- Never ship the direction contract/spec text in source comments, DOM or bundles.
- Commit after every task with a conventional-commit message ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Navigating between pages repeatedly** (menu, TransitionLink, NextPage, browser back) — expect no stale ScrollTriggers/pins, scroll at top, header visible, Lenis running. Pinned by `tests/e2e/navigation.spec.ts` in Task 19 (visit all 5 pages via NextPage chain then back ×4, assert `h1` visible and `window.scrollY === 0` after each forward nav).
2. **JS disabled / slow JS** — content must be fully readable and the contact form must still submit natively; loader must not cover the page. Pinned by `tests/e2e/no-js.spec.ts` in Task 19 (`javaScriptEnabled: false`).
3. **Resizing / rotating mid-page** (desktop ↔ mobile breakpoints, pinned sections) — expect no overlapping/blank sections. Pinned in Task 9 + Task 12 (`ScrollTrigger.refresh` on resize via `matchMedia` contexts) and e2e `tests/e2e/resize.spec.ts` in Task 19.
4. **Contact form abuse & bad input** (empty, huge message, invalid email, honeypot filled, rapid repeats, non-JSON body) — expect clear field errors, 400/429 codes, never a 500. Pinned in Task 10 unit tests (incl. 5,000-char limit and malformed body).
5. **Keyboard-only and screen-reader users in animated UI** (menu focus trap, toggles, lightbox, split text) — expect full operability and readable labels. Pinned by `tests/e2e/a11y.spec.ts` (axe + keyboard flows) in Task 19 and unit tests in Tasks 6/7.

---

## File structure (locked)

```
.
├── CLAUDE.md                         # agent guide (Task 20)
├── next.config.ts                    # redirects, images
├── vitest.config.ts / vitest.setup.ts
├── playwright.config.ts
├── scripts/fetch-images.mjs          # downloads + optimises 99x photography (Task 4)
├── public/brand/                     # 99x-logo.svg, 99x-logo-white.svg, logo-exploded.png
├── public/images/<page>/*.jpg        # optimised photography
├── src/
│   ├── app/
│   │   ├── layout.tsx                # fonts, Loader, Header, Menu, page shell, Footer, SmoothScroll, PageTransition
│   │   ├── globals.css               # Tailwind v4 @theme tokens + fluid scale + base
│   │   ├── page.tsx                  # Home
│   │   ├── about-us/page.tsx
│   │   ├── services/page.tsx
│   │   ├── services/nearshore-tech-talent-usa/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── api/contact/route.ts
│   │   ├── sitemap.ts, robots.ts, not-found.tsx
│   │   └── dev/kitchen-sink/page.tsx # dev-only component gallery (404 in production)
│   ├── content/
│   │   ├── schema.ts                 # zod schemas + types
│   │   ├── images.json               # generated by scripts/fetch-images.mjs
│   │   ├── img.ts                    # img(path, alt) helper reading images.json
│   │   ├── index.ts                  # getSite, getPage, getAllPages
│   │   └── en/site.ts, en/pages/{home,about,services,nearshore-usa,contact}.ts
│   ├── components/
│   │   ├── ui/ Button.tsx ButtonSm.tsx SectionTag.tsx Eyebrow.tsx Stat.tsx Icon.tsx TickRuler.tsx Toggle.tsx Field.tsx SmartLink.tsx
│   │   ├── sections/ SectionRenderer.tsx SectionShell.tsx Hero.tsx StatsSection.tsx CardGrid.tsx StickySplit.tsx NumberedList.tsx
│   │   │            DisplayLine.tsx CaseCards.tsx InsightCards.tsx MediaStatement.tsx VideoLightbox.tsx Tabs.tsx
│   │   │            ProofToggle.tsx NamesCylinder.tsx Timeline.tsx OfficeRows.tsx PeopleGrid.tsx ContactBlock.tsx
│   │   │            ContactMain.tsx DivisionContacts.tsx WorldDotMap.tsx NextPage.tsx LogoStorySection.tsx
│   │   ├── forms/ ContactForm.tsx
│   │   ├── layout/ Header.tsx Menu.tsx MenuButton.tsx Footer.tsx Loader.tsx SkipLink.tsx PageShell.tsx
│   │   ├── motion/ SmoothScroll.tsx RevealLines.tsx ScrubText.tsx FadeUp.tsx Parallax.tsx PillWipe.tsx
│   │   │           PageTransition.tsx TransitionLink.tsx
│   │   └── three/ LogoStory.tsx LogoScene.tsx logoGeometry.ts StaticLogoFallback.tsx
│   └── lib/
│       ├── gsap.ts                   # plugin registration, eases, defaults
│       ├── motion.ts                 # prefersReducedMotion(), useReducedMotion()
│       ├── loader.ts                 # onLoaderDone()/markLoaderDone()
│       ├── fonts.ts
│       ├── cn.ts
│       ├── seo.ts                    # buildMetadata(page), organizationJsonLd(site)
│       └── contact/ schema.ts provider.ts rate-limit.ts
└── tests/
    ├── unit/**                       # vitest
    └── e2e/**                        # playwright
```

---

### Task 1: Scaffold, tooling and test harness

**Files:**
- Create: whole Next.js scaffold, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts`
- Modify: `package.json` (scripts), `.gitignore`

**Interfaces:**
- Produces: scripts `pnpm dev`, `pnpm build`, `pnpm test` (vitest run), `pnpm test:e2e` (playwright), `pnpm lint`, `pnpm typecheck`. Path alias `@/*` → `src/*`.

- [ ] **Step 1: Scaffold into a temp folder and merge (repo is non-empty)**

```bash
cd /Users/flavio/Documents/99x/99x-v2
pnpm dlx create-next-app@16.4.0 .scaffold --ts --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*" --use-pnpm --yes
rsync -a --exclude .git --exclude .gitignore .scaffold/ ./
cat .scaffold/.gitignore >> .gitignore
rm -rf .scaffold
pnpm install
```

- [ ] **Step 2: Add dependencies**

```bash
pnpm add gsap@3.15.0 @gsap/react@2.1.2 lenis@1.3.26 three@0.186.1 @react-three/fiber@9.8.1 @react-three/drei@10.7.9 zod@4.6.5 clsx
pnpm add -D vitest@5.0.3 @vitejs/plugin-react jsdom @testing-library/react@16.3.3 @testing-library/dom @testing-library/user-event @testing-library/jest-dom vite-tsconfig-paths @playwright/test@1.64.0 @axe-core/playwright@4.13.0 @types/three sharp
pnpm exec playwright install chromium
```

- [ ] **Step 3: Write `vitest.config.ts` and `vitest.setup.ts`**

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    css: false,
  },
});
```

```ts
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";

// jsdom lacks matchMedia; default to "no reduced motion"
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
```

- [ ] **Step 4: Write `playwright.config.ts`**

```ts
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
```

- [ ] **Step 5: Add scripts to `package.json`**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "images": "node scripts/fetch-images.mjs"
  }
}
```

(Merge into the existing `scripts` object; keep any others the scaffold created.)

- [ ] **Step 6: Write smoke tests**

```ts
// tests/unit/smoke.test.ts
import { describe, it, expect } from "vitest";
describe("harness", () => {
  it("runs", () => expect(1 + 1).toBe(2));
});
```

```ts
// tests/e2e/smoke.spec.ts
import { test, expect } from "@playwright/test";
test("home responds", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
});
```

- [ ] **Step 7: Run everything**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e --project=desktop`
Expected: all PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 app with Tailwind v4, Vitest and Playwright

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Design tokens, fluid scale and fonts

**Files:**
- Create: `src/lib/fonts.ts`, `src/lib/cn.ts`
- Replace: `src/app/globals.css`, `src/app/layout.tsx` (temporary minimal version), `src/app/page.tsx` (temporary token check)
- Test: `tests/e2e/tokens.spec.ts`

**Interfaces:**
- Produces Tailwind utilities used everywhere:
  - colours: `ink`, `paper`, `tint`, `accent`, `accent-deep`, `logo-sage|lavender|sand|bronze|brown|red|mauve`
  - fonts: `font-display`, `font-mono`
  - type: `text-hero` (3.5u/1.1), `text-xxl` (7u/0.8), `text-statement` (3u/1), `text-next` (3.5u/1), `text-h2` (2u/1), `text-card` (2u/1.1), `text-stat` (2.5u/1), `text-menu` (2u/0.9), `text-body-m` (1.25u/1.1), `text-body-s` (1u/1.2), `text-eyebrow-m` (.75u/1), `text-eyebrow-s` (.7u/.9), `text-button` (.813u/.8), `text-label` (1.5u/1.1)
  - spacing: Tailwind numeric scale where `1` = 0.25u (so `p-8` = 2u, `pb-64` = 16u)
  - radii: `rounded-xs` (2px), `rounded-sm` (.25u), `rounded-md` (.5u)
  - breakpoints: `sm` 480px, `md` 768px, `lg` 992px, `xl` 1440px
  - eases: `ease-house`
- `cn(...classes)` = clsx.

- [ ] **Step 1: Write the failing e2e test**

```ts
// tests/e2e/tokens.spec.ts
import { test, expect } from "@playwright/test";

test.describe("fluid scale", () => {
  test("1u = 16px at 1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const size = await page.evaluate(() => getComputedStyle(document.body).fontSize);
    expect(size).toBe("16px");
  });
  test("1u = 20px at 1800", async ({ page }) => {
    await page.setViewportSize({ width: 1800, height: 900 });
    await page.goto("/");
    const size = await page.evaluate(() => getComputedStyle(document.body).fontSize);
    expect(size).toBe("20px");
  });
  test("display font is Inter Tight", async ({ page }) => {
    await page.goto("/");
    const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(family.toLowerCase()).toContain("inter tight");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e --project=desktop tests/e2e/tokens.spec.ts`
Expected: FAIL (font size / family mismatch).

- [ ] **Step 3: Write `src/lib/fonts.ts` and `src/lib/cn.ts`**

```ts
// src/lib/fonts.ts
import { Inter_Tight, Geist_Mono } from "next/font/google";

// Stand-ins for Helvetica Now Display (700/500) and PP Supply Mono (300).
// To switch to licensed fonts, replace these with next/font/local — nothing else changes.
export const fontDisplay = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-geist-mono",
  display: "swap",
});
```

```ts
// src/lib/cn.ts
import clsx, { type ClassValue } from "clsx";
export const cn = (...inputs: ClassValue[]) => clsx(inputs);
```

- [ ] **Step 4: Write `src/app/globals.css`**

```css
@import "tailwindcss";

/* ---------- Fluid scale (Osmo-style): 1u = 16px at the design width ---------- */
:root {
  --size-unit: 16;
  --size-container-ideal: 1440;
  --size-container-min: 992px;
  --size-container-max: 1920px;
  --size-container: clamp(var(--size-container-min), 100vw, var(--size-container-max));
  --u: calc(var(--size-container) / (var(--size-container-ideal) / var(--size-unit)));
  --site-margin: calc(var(--u) * 2);
}
@media (max-width: 991px) {
  :root { --size-container-ideal: 834; --size-container-min: 768px; --size-container-max: 991px; --site-margin: var(--u); }
}
@media (max-width: 767px) {
  :root { --size-container-ideal: 550; --size-container-min: 480px; --size-container-max: 767px; }
}
@media (max-width: 479px) {
  :root { --size-container-ideal: 390; --size-container-min: 320px; --size-container-max: 479px; }
}

@theme {
  --breakpoint-sm: 480px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1440px;
  --breakpoint-2xl: initial;

  --color-*: initial;
  --color-ink: #160f17;
  --color-paper: #ffffff;
  --color-tint: #efe8f3;
  --color-accent: #c49fd5;
  --color-accent-deep: #4a3255;
  --color-transparent: transparent;
  --color-current: currentColor;
  --color-logo-sage: #a2b372;
  --color-logo-lavender: #c49fd5;
  --color-logo-sand: #ccb189;
  --color-logo-bronze: #bc8e58;
  --color-logo-brown: #905b54;
  --color-logo-red: #b44b4b;
  --color-logo-mauve: #7a6977;

  /* next/font exposes --font-inter-tight / --font-geist-mono; Tailwind tokens wrap them (distinct names avoid a var() cycle) */
  --font-display: var(--font-inter-tight), "Helvetica Neue", Arial, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;

  --spacing: calc(var(--u) * 0.25);

  --text-hero: calc(var(--u) * 3.5);
  --text-hero--line-height: 1.1;
  --text-xxl: calc(var(--u) * 7);
  --text-xxl--line-height: 0.8;
  --text-xxl--letter-spacing: -0.025em;
  --text-statement: calc(var(--u) * 3);
  --text-statement--line-height: 1;
  --text-statement--letter-spacing: -0.0098em;
  --text-next: calc(var(--u) * 3.5);
  --text-next--line-height: 1;
  --text-h2: calc(var(--u) * 2);
  --text-h2--line-height: 1;
  --text-card: calc(var(--u) * 2);
  --text-card--line-height: 1.1;
  --text-card--letter-spacing: -0.025em;
  --text-stat: calc(var(--u) * 2.5);
  --text-stat--line-height: 1;
  --text-stat--letter-spacing: -0.0098em;
  --text-menu: calc(var(--u) * 2);
  --text-menu--line-height: 0.9;
  --text-menu--letter-spacing: -0.0075em;
  --text-body-m: calc(var(--u) * 1.25);
  --text-body-m--line-height: 1.1;
  --text-body-s: var(--u);
  --text-body-s--line-height: 1.2;
  --text-label: calc(var(--u) * 1.5);
  --text-label--line-height: 1.1;
  --text-eyebrow-m: calc(var(--u) * 0.75);
  --text-eyebrow-m--line-height: 1;
  --text-eyebrow-s: calc(var(--u) * 0.7);
  --text-eyebrow-s--line-height: 0.9;
  --text-button: calc(var(--u) * 0.813);
  --text-button--line-height: 0.8;

  --radius-xs: 2px;
  --radius-sm: calc(var(--u) * 0.25);
  --radius-md: calc(var(--u) * 0.5);

  --ease-house: cubic-bezier(0.6, 0, 0, 1);
}

/* Mobile type steps down like cominvi */
@media (max-width: 767px) {
  :root {
    --text-statement: calc(var(--u) * 2);
    --text-xxl: calc(var(--u) * 4);
    --text-hero: calc(var(--u) * 2.5);
    --text-next: calc(var(--u) * 2.5);
  }
}

@layer base {
  html { color-scheme: light; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  body {
    font-size: var(--u);
    font-family: var(--font-display);
    font-weight: 700;
    line-height: 1.2;
    background: var(--color-ink);
    color: var(--color-ink);
  }
  html.lenis, html.lenis body { height: auto; }
  .lenis.lenis-smooth { scroll-behavior: auto !important; }
  .lenis.lenis-stopped { overflow: hidden; }
  a { color: inherit; text-decoration: none; }
  :focus-visible { outline: 2px solid var(--color-accent-deep); outline-offset: 2px; }
  [data-theme="dark"] :focus-visible { outline-color: var(--color-accent); }
  img, video { display: block; max-width: 100%; }
}

@utility site-x { padding-inline: var(--site-margin); }
@utility grid-12 { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--u); }
@utility mask-line { overflow: hidden; display: block; }
```

- [ ] **Step 5: Minimal layout and page so the test can run**

```tsx
// src/app/layout.tsx  (temporary — replaced in Task 7)
import "./globals.css";
import { fontDisplay, fontMono } from "@/lib/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// src/app/page.tsx  (temporary — replaced in Task 13)
export default function Home() {
  return (
    <main className="bg-paper site-x py-8">
      <h1 className="text-hero">Token check</h1>
      <p className="font-mono font-light uppercase text-eyebrow-m">Eyebrow</p>
    </main>
  );
}
```

- [ ] **Step 6: Run tests**

Run: `pnpm test:e2e --project=desktop tests/e2e/tokens.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: design tokens, fluid scale and fonts

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Content schema, site config and accessors

**Files:**
- Create: `src/content/schema.ts`, `src/content/img.ts`, `src/content/images.json` (seed `{}`), `src/content/index.ts`, `src/content/en/site.ts`, `src/content/routes.ts`
- Test: `tests/unit/content/schema.test.ts`, `tests/unit/content/site.test.ts`

**Interfaces:**
- Produces (exact exports from `src/content/schema.ts`):
  - `LinkSchema` / `type Link = { label: string; href: string; external?: boolean }`
  - `ImgSchema` / `type Img = { src: string; alt: string; width: number; height: number }`
  - `ThemeSchema` / `type Theme = "dark" | "paper" | "tint"`
  - `SectionHeadSchema` / `type SectionHead = { index: string; label: string; statement?: string }`
  - `PersonSchema` / `type Person = { name: string; role: string; email?: string; phone?: string; photo?: Img }`
  - `OfficeSchema` / `type Office = { id: string; city: string; country: string; countryCode: string; address: string; email: string; lat: number; lng: number }`
  - `HeroSchema`, `SectionSchema` (discriminated union on `type`), `PageSchema`, `SiteSchema` and the inferred types `Hero`, `Section`, `Page`, `Site`, plus one type per section: `StatsSection`, `CardGridSection`, `StickySplitSection`, `NumberedListSection`, `DisplayLineSection`, `CaseCardsSection`, `InsightCardsSection`, `MediaStatementSection`, `TabsSection`, `ProofToggleSection`, `NamesCylinderSection`, `TimelineSection`, `OfficeRowsSection`, `PeopleGridSection`, `ContactBlockSection`, `ContactMainSection`, `DivisionContactsSection`, `LogoStorySection`.
- `src/content/img.ts`: `img(path: string, alt: string): Img` — `path` relative to `public/images/` (e.g. `"home/hero.jpg"`), dims from `images.json`; throws if missing.
- `src/content/routes.ts`: `BUILT_ROUTES = ["/", "/about-us", "/services", "/services/nearshore-tech-talent-usa", "/contact"] as const`.
- `src/content/index.ts`: `getSite(locale?: "en"): Site`, `getPage(slug: PageSlug, locale?: "en"): Page`, `getAllPages(locale?: "en"): Page[]`, `type PageSlug = "home" | "about" | "services" | "nearshore-usa" | "contact"`.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/unit/content/schema.test.ts
import { describe, it, expect } from "vitest";
import { ImgSchema, LinkSchema, SectionSchema } from "@/content/schema";

describe("ImgSchema", () => {
  it("rejects filename-like alt text", () => {
    const r = ImgSchema.safeParse({ src: "/images/a.jpg", alt: "IMG_0745", width: 10, height: 10 });
    expect(r.success).toBe(false);
  });
  it("rejects alt with a file extension", () => {
    const r = ImgSchema.safeParse({ src: "/images/a.jpg", alt: "photo.jpg", width: 10, height: 10 });
    expect(r.success).toBe(false);
  });
  it("accepts descriptive alt", () => {
    const r = ImgSchema.safeParse({ src: "/images/a.jpg", alt: "Engineers at a whiteboard", width: 10, height: 10 });
    expect(r.success).toBe(true);
  });
});

describe("LinkSchema", () => {
  it("requires external links to be absolute https", () => {
    expect(LinkSchema.safeParse({ label: "x", href: "/ai-99x", external: true }).success).toBe(false);
    expect(LinkSchema.safeParse({ label: "x", href: "https://99x.io/ai-99x", external: true }).success).toBe(true);
  });
  it("allows mailto and anchors as internal", () => {
    expect(LinkSchema.safeParse({ label: "x", href: "mailto:hi@99x.io" }).success).toBe(true);
    expect(LinkSchema.safeParse({ label: "x", href: "#talk" }).success).toBe(true);
  });
});

describe("SectionSchema", () => {
  it("rejects unknown section types", () => {
    expect(SectionSchema.safeParse({ type: "carousel" }).success).toBe(false);
  });
  it("parses a namesCylinder section", () => {
    const r = SectionSchema.safeParse({
      type: "namesCylinder",
      theme: "paper",
      head: { index: "S.07", label: "Trusted by", statement: "Companies that build with us." },
      names: ["Adra", "Kavli", "OBOS"],
    });
    expect(r.success).toBe(true);
  });
});
```

```ts
// tests/unit/content/site.test.ts
import { describe, it, expect } from "vitest";
import { getSite } from "@/content";
import { BUILT_ROUTES } from "@/content/routes";

describe("site config", () => {
  const site = getSite();
  const allLinks = [
    ...site.nav.flatMap((g) => g.links),
    ...site.footer.columns.flatMap((c) => c.links),
    ...site.legal,
  ];

  it("every internal link points at a built route, anchor or mailto/tel", () => {
    for (const l of allLinks) {
      if (l.external) continue;
      const ok =
        l.href.startsWith("mailto:") ||
        l.href.startsWith("tel:") ||
        l.href.startsWith("#") ||
        (BUILT_ROUTES as readonly string[]).includes(l.href.split("#")[0]);
      expect(ok, `${l.label} -> ${l.href}`).toBe(true);
    }
  });

  it("every external link points at https", () => {
    for (const l of allLinks.filter((l) => l.external)) expect(l.href.startsWith("https://")).toBe(true);
  });

  it("has exactly 5 offices", () => {
    expect(site.offices).toHaveLength(5);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test tests/unit/content`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/content/schema.ts`**

```ts
import { z } from "zod";

const FILENAME_LIKE = /(^(img|dsc|image|screenshot|chatgpt)[\s_-]?\d*)|(\.(jpe?g|png|webp|avif|svg)$)|(^\d+$)/i;

export const LinkSchema = z
  .object({ label: z.string().min(1), href: z.string().min(1), external: z.boolean().optional() })
  .refine((l) => !l.external || l.href.startsWith("https://"), { message: "external links must be https" });
export type Link = z.infer<typeof LinkSchema>;

export const ImgSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(3).refine((a) => !FILENAME_LIKE.test(a.trim()), { message: "alt looks like a filename" }),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type Img = z.infer<typeof ImgSchema>;

export const ThemeSchema = z.enum(["dark", "paper", "tint"]);
export type Theme = z.infer<typeof ThemeSchema>;

export const SectionHeadSchema = z.object({
  index: z.string().regex(/^S\.\d{2}$/),
  label: z.string().min(1),
  statement: z.string().optional(),
});
export type SectionHead = z.infer<typeof SectionHeadSchema>;

export const PersonSchema = z.object({
  name: z.string(),
  role: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  photo: ImgSchema.optional(),
});
export type Person = z.infer<typeof PersonSchema>;

export const OfficeSchema = z.object({
  id: z.string(),
  city: z.string(),
  country: z.string(),
  countryCode: z.string().length(2),
  address: z.string(),
  email: z.string().email(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type Office = z.infer<typeof OfficeSchema>;

const IconName = z.enum([
  "calendar", "people", "globe", "chart", "code", "browser", "users", "spark",
  "layers", "shield", "clock", "star", "heart", "mobile", "database", "arrow",
]);
export type IconName = z.infer<typeof IconName>;

export const HeroSchema = z.object({
  eyebrow: z.string(),
  lines: z.array(z.string()).min(1).max(3),
  image: ImgSchema,
  metric: z.object({ label: z.string(), value: z.string() }).optional(),
  cards: z.array(z.object({ image: ImgSchema, link: LinkSchema })).max(2).optional(),
});
export type Hero = z.infer<typeof HeroSchema>;

const base = { theme: ThemeSchema, head: SectionHeadSchema, id: z.string().optional() };

export const StatsSectionSchema = z.object({
  type: z.literal("stats"),
  ...base,
  image: ImgSchema.optional(),
  items: z.array(z.object({ value: z.string(), label: z.string(), icon: IconName })).min(2).max(4),
  body: z.string().optional(),
  link: LinkSchema.optional(),
});
export const CardGridSectionSchema = z.object({
  type: z.literal("cardGrid"),
  ...base,
  cards: z
    .array(z.object({ title: z.string(), description: z.string(), icon: IconName, link: LinkSchema.optional() }))
    .min(2)
    .max(6),
  photo: ImgSchema.optional(),
  link: LinkSchema.optional(),
});
export const StickySplitSectionSchema = z.object({
  type: z.literal("stickySplit"),
  ...base,
  image: ImgSchema,
  mediaSide: z.enum(["left", "right"]),
  heading: z.string(),
  body: z.string(),
  link: LinkSchema.optional(),
});
export const NumberedListSectionSchema = z.object({
  type: z.literal("numberedList"),
  ...base,
  image: ImgSchema.optional(),
  items: z.array(z.object({ title: z.string(), description: z.string().optional() })).min(1),
  link: LinkSchema.optional(),
});
export const DisplayLineSectionSchema = z.object({
  type: z.literal("displayLine"),
  ...base,
  text: z.string(),
  subline: z.string().optional(),
  fill: z.enum(["pill", "image"]),
  image: ImgSchema.optional(),
  body: z.string().optional(),
});
export const CaseCardsSectionSchema = z.object({
  type: z.literal("caseCards"),
  ...base,
  display: z.object({ text: z.string(), subline: z.string() }).optional(),
  cards: z.array(z.object({ title: z.string(), tag: z.string(), image: ImgSchema, link: LinkSchema })).min(1).max(4),
  link: LinkSchema.optional(),
});
export const InsightCardsSectionSchema = z.object({
  type: z.literal("insightCards"),
  ...base,
  cards: z.array(z.object({ kind: z.string(), title: z.string(), image: ImgSchema, link: LinkSchema })).min(1).max(3),
  link: LinkSchema.optional(),
});
export const MediaStatementSectionSchema = z.object({
  type: z.literal("mediaStatement"),
  ...base,
  body: z.string(),
  images: z.tuple([ImgSchema, ImgSchema]),
  video: z.object({ youtubeId: z.string(), label: z.string() }).optional(),
});
export const TabsSectionSchema = z.object({
  type: z.literal("tabs"),
  ...base,
  items: z.array(z.object({ label: z.string(), heading: z.string(), body: z.string(), image: ImgSchema })).min(2).max(4),
});
export const ProofToggleSectionSchema = z.object({
  type: z.literal("proofToggle"),
  ...base,
  subline: z.string(),
  items: z.array(z.object({ value: z.string(), text: z.string() })).min(2).max(4),
});
export const NamesCylinderSectionSchema = z.object({
  type: z.literal("namesCylinder"),
  ...base,
  names: z.array(z.string()).min(3),
});
export const TimelineSectionSchema = z.object({
  type: z.literal("timeline"),
  ...base,
  items: z.array(z.object({ year: z.string().regex(/^\d{4}$/), title: z.string(), image: ImgSchema })).min(2),
});
export const OfficeRowsSectionSchema = z.object({ type: z.literal("officeRows"), ...base, body: z.string().optional() });
export const PeopleGridSectionSchema = z.object({ type: z.literal("peopleGrid"), ...base, people: z.array(PersonSchema).min(1) });
export const ContactBlockSectionSchema = z.object({
  type: z.literal("contactBlock"),
  ...base,
  person: PersonSchema,
  source: z.string(),
});
export const ContactMainSectionSchema = z.object({
  type: z.literal("contactMain"),
  theme: ThemeSchema,
  id: z.string().optional(),
  heading: z.string(),
  intro: z.string(),
  source: z.string(),
});
export const DivisionContactsSectionSchema = z.object({
  type: z.literal("divisionContacts"),
  ...base,
  divisions: z.array(z.object({ label: z.string(), heading: z.string(), email: z.string().email() })).min(1),
  people: z.array(PersonSchema),
  internships: z.object({ heading: z.string(), body: z.string(), email: z.string().email() }),
});
export const LogoStorySectionSchema = z.object({ type: z.literal("logoStory"), ...base });

export const SectionSchema = z.discriminatedUnion("type", [
  StatsSectionSchema, CardGridSectionSchema, StickySplitSectionSchema, NumberedListSectionSchema,
  DisplayLineSectionSchema, CaseCardsSectionSchema, InsightCardsSectionSchema, MediaStatementSectionSchema,
  TabsSectionSchema, ProofToggleSectionSchema, NamesCylinderSectionSchema, TimelineSectionSchema,
  OfficeRowsSectionSchema, PeopleGridSectionSchema, ContactBlockSectionSchema, ContactMainSectionSchema,
  DivisionContactsSectionSchema, LogoStorySectionSchema,
]);
export type Section = z.infer<typeof SectionSchema>;
export type StatsSection = z.infer<typeof StatsSectionSchema>;
export type CardGridSection = z.infer<typeof CardGridSectionSchema>;
export type StickySplitSection = z.infer<typeof StickySplitSectionSchema>;
export type NumberedListSection = z.infer<typeof NumberedListSectionSchema>;
export type DisplayLineSection = z.infer<typeof DisplayLineSectionSchema>;
export type CaseCardsSection = z.infer<typeof CaseCardsSectionSchema>;
export type InsightCardsSection = z.infer<typeof InsightCardsSectionSchema>;
export type MediaStatementSection = z.infer<typeof MediaStatementSectionSchema>;
export type TabsSection = z.infer<typeof TabsSectionSchema>;
export type ProofToggleSection = z.infer<typeof ProofToggleSectionSchema>;
export type NamesCylinderSection = z.infer<typeof NamesCylinderSectionSchema>;
export type TimelineSection = z.infer<typeof TimelineSectionSchema>;
export type OfficeRowsSection = z.infer<typeof OfficeRowsSectionSchema>;
export type PeopleGridSection = z.infer<typeof PeopleGridSectionSchema>;
export type ContactBlockSection = z.infer<typeof ContactBlockSectionSchema>;
export type ContactMainSection = z.infer<typeof ContactMainSectionSchema>;
export type DivisionContactsSection = z.infer<typeof DivisionContactsSectionSchema>;
export type LogoStorySection = z.infer<typeof LogoStorySectionSchema>;

export const PageSchema = z.object({
  slug: z.enum(["home", "about", "services", "nearshore-usa", "contact"]),
  path: z.string().startsWith("/"),
  meta: z.object({ title: z.string().max(60), description: z.string().min(50).max(160), ogImage: ImgSchema }),
  hero: HeroSchema.optional(),
  sections: z.array(SectionSchema).min(1),
  next: z.object({ label: z.string(), eyebrow: z.string(), href: z.string().startsWith("/"), image: ImgSchema }),
});
export type Page = z.infer<typeof PageSchema>;

const NavGroupSchema = z.object({ label: z.string(), links: z.array(LinkSchema) });
export const SiteSchema = z.object({
  name: z.literal("99x"),
  url: z.string().url(),
  nav: z.array(NavGroupSchema).min(1),
  cta: LinkSchema,
  languages: z.array(z.object({ code: z.string(), label: z.string(), href: z.string(), active: z.boolean() })),
  socials: z.array(z.object({ label: z.string(), href: z.string().url(), icon: z.enum(["linkedin", "youtube"]) })),
  footer: z.object({
    columns: z.array(z.object({ tag: z.string(), links: z.array(LinkSchema) })),
    contact: z.object({ address: z.string(), email: z.string().email(), phone: z.string() }),
  }),
  legal: z.array(LinkSchema),
  offices: z.array(OfficeSchema).length(5),
});
export type Site = z.infer<typeof SiteSchema>;
```

- [ ] **Step 4: Write `src/content/img.ts`, seed `images.json`, and `routes.ts`**

```ts
// src/content/img.ts
import manifest from "./images.json";
import type { Img } from "./schema";

type Manifest = Record<string, { width: number; height: number }>;

export function img(path: string, alt: string): Img {
  const entry = (manifest as Manifest)[path];
  if (!entry) throw new Error(`Image not in manifest: ${path}. Run \`pnpm images\`.`);
  return { src: `/images/${path}`, alt, width: entry.width, height: entry.height };
}
```

```json
{}
```
(save as `src/content/images.json`; Task 4 regenerates it)

```ts
// src/content/routes.ts
export const BUILT_ROUTES = ["/", "/about-us", "/services", "/services/nearshore-tech-talent-usa", "/contact"] as const;
export type BuiltRoute = (typeof BUILT_ROUTES)[number];
```

- [ ] **Step 5: Write `src/content/en/site.ts`**

```ts
import type { Site } from "../schema";

const X = (path: string) => `https://99x.io${path}`;

export const site: Site = {
  name: "99x",
  url: "https://99x.io",
  nav: [
    {
      label: "What we do",
      links: [
        { label: "Services", href: "/services" },
        { label: "Tech talent USA", href: "/services/nearshore-tech-talent-usa" },
        { label: "Tech talent Europe", href: X("/services/tech-experts-Europe"), external: true },
        { label: "Product engineering", href: X("/services/product-engineering"), external: true },
        { label: "Web solutions", href: X("/services/web-solutions"), external: true },
        { label: "AI at 99x", href: X("/ai-99x"), external: true },
      ],
    },
    {
      label: "Knowledge",
      links: [
        { label: "Case studies", href: X("/case-studies"), external: true },
        { label: "Insights", href: X("/Insights"), external: true },
        { label: "Events", href: X("/events"), external: true },
      ],
    },
    {
      label: "Company",
      links: [
        { label: "About us", href: "/about-us" },
        { label: "Careers", href: X("/careers"), external: true },
        { label: "Contact", href: "/contact" },
      ],
    },
  ],
  cta: { label: "Contact us", href: "/contact" },
  languages: [
    { code: "en", label: "En", href: "/", active: true },
    { code: "no", label: "No", href: X("/no"), active: false },
  ],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/99xio", icon: "linkedin" },
    { label: "YouTube", href: "https://www.youtube.com/@99xio", icon: "youtube" },
  ],
  footer: {
    columns: [
      {
        tag: "What we do",
        links: [
          { label: "Services", href: "/services" },
          { label: "Tech talent USA", href: "/services/nearshore-tech-talent-usa" },
          { label: "Tech talent Europe", href: X("/services/tech-experts-Europe"), external: true },
          { label: "Product engineering", href: X("/services/product-engineering"), external: true },
          { label: "Web solutions", href: X("/services/web-solutions"), external: true },
        ],
      },
      {
        tag: "Knowledge",
        links: [
          { label: "Case studies", href: X("/case-studies"), external: true },
          { label: "Insights", href: X("/Insights"), external: true },
          { label: "Events", href: X("/events"), external: true },
        ],
      },
      {
        tag: "Company",
        links: [
          { label: "About us", href: "/about-us" },
          { label: "Careers", href: X("/careers"), external: true },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
    contact: { address: "Dronning Eufemias gate 16, 0191 Oslo", email: "hello.norway@99x.io", phone: "+47 24 07 70 11" },
  },
  legal: [
    { label: "The Transparency Act", href: X("/compliance/the-transparency-act"), external: true },
    { label: "Privacy policy", href: X("/compliance/privacy-policy"), external: true },
    { label: "Cookie policy", href: X("/compliance/cookie-policy"), external: true },
  ],
  offices: [
    { id: "oslo", city: "Oslo", country: "Norway", countryCode: "NO", address: "Dronning Eufemias gate 16, 0191 Oslo", email: "hello.norway@99x.io", lat: 59.9075, lng: 10.7601 },
    { id: "colombo", city: "Colombo", country: "Sri Lanka", countryCode: "LK", address: "65 Walukarama Rd, Colombo 00300", email: "hello.srilanka@99x.io", lat: 6.8939, lng: 79.8553 },
    { id: "alges", city: "Algés", country: "Portugal", countryCode: "PT", address: "Alameda Fernão Lopes 16, 13º, 1495-190 Algés", email: "hello.portugal@99x.io", lat: 38.7036, lng: -9.2275 },
    { id: "vitoria", city: "Vitória", country: "Brazil", countryCode: "BR", address: "Av. Nossa Senhora da Penha 1495, Room 504, Vitória/ES", email: "hello.brazil@99x.io", lat: -20.3008, lng: -40.2958 },
    { id: "kuala-lumpur", city: "Kuala Lumpur", country: "Malaysia", countryCode: "MY", address: "Suite 802, Level 8, Menara Binjai, 50450 Kuala Lumpur", email: "hello.malaysia@99x.io", lat: 3.1587, lng: 101.7188 },
  ],
};
```

Before committing, verify the three legal URLs return 200 (`curl -sI https://99x.io/compliance/privacy-policy | head -1` etc.); if a slug differs, take the real one from `_docs/content/sitemap-current.md`.

- [ ] **Step 6: Write `src/content/index.ts`** (pages are registered in Tasks 13–17; start with site only)

```ts
import { SiteSchema, PageSchema, type Page, type Site } from "./schema";
import { site as siteEn } from "./en/site";

export type Locale = "en";
export type PageSlug = Page["slug"];

const sites: Record<Locale, Site> = { en: SiteSchema.parse(siteEn) };

// Pages are added to this registry as they are built (Tasks 13–17).
const pageRegistry: Record<Locale, Partial<Record<PageSlug, Page>>> = { en: {} };

export function registerPages(locale: Locale, pages: Page[]) {
  for (const p of pages) pageRegistry[locale][p.slug] = PageSchema.parse(p);
}

export function getSite(locale: Locale = "en"): Site {
  return sites[locale];
}

export function getPage(slug: PageSlug, locale: Locale = "en"): Page {
  const page = pageRegistry[locale][slug];
  if (!page) throw new Error(`Page not registered: ${locale}/${slug}`);
  return page;
}

export function getAllPages(locale: Locale = "en"): Page[] {
  return Object.values(pageRegistry[locale]).filter((p): p is Page => Boolean(p));
}
```

- [ ] **Step 7: Run tests**

Run: `pnpm test tests/unit/content && pnpm typecheck`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(content): typed content schema, site config and accessors

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Brand and photography assets

**Files:**
- Create: `scripts/fetch-images.mjs`, `scripts/image-manifest.mjs`, `public/brand/99x-logo.svg`, `public/brand/99x-logo-white.svg`, `src/app/icon.png`, `src/app/apple-icon.png`
- Generate: `public/images/**`, `src/content/images.json`
- Test: `tests/unit/content/images.test.ts`

**Interfaces:**
- Produces: `images.json` keys used by content in Tasks 13–17 — exactly the `out` values in `scripts/image-manifest.mjs` below. `public/brand/99x-logo.svg` (used by Header, Loader, Footer, 3D).

- [ ] **Step 1: Write the manifest (`scripts/image-manifest.mjs`)**

Each entry: `page` = source file in `_docs/content/source/` (without `.md`), `match` = substring of the original filename, `out` = path under `public/images/`.

```js
export const manifest = [
  // home
  { page: "home", match: "Increo_Wittrup_DSC0565_WEB", out: "home/hero.jpg" },
  { page: "home", match: "Increo_Wittrup_DSC0747_WEB", out: "home/about-portrait.jpg" },
  { page: "home", match: "Increo_Wittrup_DSC0597_WEB", out: "home/services-tile.jpg" },
  { page: "home", match: "creative-people-working-in-the-office", out: "home/ai.jpg" },
  { page: "home", match: "interflora_mac", out: "home/case-interflora.jpg" },
  { page: "home", match: "Norwegian%20Household", out: "home/case-boligmappa.jpg" },
  { page: "home", match: "BagID_baglineup", out: "home/case-bagid.jpg" },
  { page: "home", match: "99x_Blog_What-is-data-science", out: "home/insight-data-science.jpg" },
  { page: "home", match: "Webinar_Socail", out: "home/insight-mcp.jpg" },
  { page: "home", match: "DSC09085", out: "home/insight-agentic.jpg" },
  // about
  { page: "about-us", match: "full/99X_JPEG%20beskj", out: "about/hero.jpg" },
  { page: "about-us", match: "Management%20picture", out: "about/management.jpg" },
  { page: "about-us", match: "99x%20tech.jpg", out: "about/office.jpg" },
  { page: "about-us", match: "the-sunday-morning-interview-with-mano", out: "about/t-2000.jpg" },
  { page: "about-us", match: "steinar_johenrik_seeds", out: "about/t-2006.jpg" },
  { page: "about-us", match: "294201.jpeg", out: "about/t-2012.jpg" },
  { page: "about-us", match: "Seeds.jpg", out: "about/t-2021.jpg" },
  { page: "about-us", match: "Malaysian%20Employees", out: "about/t-2023.jpg" },
  { page: "about-us", match: "gture_99x", out: "about/t-2025.jpg" },
  { page: "about-us", match: "increo_99x", out: "about/t-2026.jpg" },
  { page: "about-us", match: "c9cac033-45dc-4448-b433-1e19af578ade", out: "about/tab-partner.jpg" },
  { page: "about-us", match: "driv1.jpg", out: "about/tab-work.jpg" },
  { page: "about-us", match: "497332772_18393927574118865", out: "about/tab-culture.jpg" },
  { page: "about-us", match: "Odd%20Sverre%20Ostlie,%20CEO", out: "people/odd-sverre-ostlie.jpg" },
  { page: "about-us", match: "Trygve%20Christian%20Moe", out: "people/trygve-moe.jpg" },
  { page: "about-us", match: "block-640-640/6.jpg", out: "people/stein-eric-moe.jpg" },
  { page: "about-us", match: "Carlos%20C.%20Silva", out: "people/carlos-coutinho-silva.jpg" },
  { page: "about-us", match: "Hasith%20Yaggahavita", out: "people/hasith-yaggahavita.jpg" },
  { page: "about-us", match: "Eiliv%20M.%20Liljevik", out: "people/eiliv-liljevik.jpg" },
  { page: "about-us", match: "block-640-640/Thiers-2024-10-29-2", out: "people/thiers-santos.jpg" },
  { page: "about-us", match: "block-640-640/7.jpg", out: "people/terje-aasgaard.jpg" },
  // contact
  { page: "about-us_contact-us", match: "Guilherme%20RP", out: "people/guilherme-ramos-pereira.jpg" },
  { page: "about-us_contact-us", match: "Steinar%20b&w", out: "people/steinar-magnussen.jpg" },
  { page: "about-us_contact-us", match: "Chrishan%20de%20Mel", out: "people/chrishan-de-mel.jpg" },
  { page: "about-us_contact-us", match: "Dag%20Honningsv", out: "people/dag-honningsvag.jpg" },
  // services
  { page: "services", match: "block-910-682/tech%20experts", out: "services/hero.jpg" },
  { page: "services", match: "this-looks-like-our-best-choice", out: "services/web-solutions.jpg" },
  { page: "services", match: "IMG_0654", out: "services/product-engineering.jpg" },
  // nearshore usa
  { page: "services_nearshore-tech-talent-usa", match: "full/IMG_0745", out: "nearshore-usa/hero.jpg" },
  { page: "services_nearshore-tech-talent-usa", match: "full/Increo_Wittrup_DSC0586_WEB", out: "nearshore-usa/partners.jpg" },
  { page: "services_nearshore-tech-talent-usa", match: "startup-business-people-group", out: "nearshore-usa/ai.jpg" },
  { page: "services_nearshore-tech-talent-usa", match: "crowdfunding", out: "nearshore-usa/case-crowdfunding.jpg" },
  { page: "services_nearshore-tech-talent-usa", match: "block-666-436/office-buildings", out: "nearshore-usa/case-cre.jpg" },
  { page: "services_nearshore-tech-talent-usa", match: "printly-c", out: "nearshore-usa/case-printly.jpg" },
  { page: "services_nearshore-tech-talent-usa", match: "Autonix-c", out: "nearshore-usa/case-qr.jpg" },
];
```

The Services page reuses `nearshore-usa/hero.jpg` (USA block) and `about/office.jpg` (Europe block) so the duplicated stock image of the old site disappears.

- [ ] **Step 2: Write `scripts/fetch-images.mjs`**

```js
// Downloads source photography from 99x.io, resizes, writes public/images/** and src/content/images.json.
// Usage: pnpm images   (idempotent; skips files that already exist unless --force)
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { manifest } from "./image-manifest.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "_docs/content/source");
const OUT_DIR = path.join(ROOT, "public/images");
const JSON_OUT = path.join(ROOT, "src/content/images.json");
const force = process.argv.includes("--force");
const URL_RE = /https:\/\/99x\.io\/_\/media:image\/[^\s)`"']+/g;

const exists = (p) => access(p).then(() => true, () => false);

async function findUrl(page, match) {
  const md = await readFile(path.join(SRC_DIR, `${page}.md`), "utf8");
  const urls = [...new Set(md.match(URL_RE) ?? [])].filter((u) => u.includes(match));
  if (!urls.length) throw new Error(`No URL in ${page}.md matching "${match}"`);
  // Prefer the largest rendition: rewrite the size segment to "full".
  return urls[0].replace(/\/(block-\d+-\d+|square-\d+|full)\//, "/full/");
}

const result = {};
for (const { page, match, out } of manifest) {
  const dest = path.join(OUT_DIR, out);
  await mkdir(path.dirname(dest), { recursive: true });
  if (force || !(await exists(dest))) {
    const url = await findUrl(page, match);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).rotate().resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
    console.log("✓", out);
  }
  const { width, height } = await sharp(dest).metadata();
  result[out] = { width, height };
}
await writeFile(JSON_OUT, JSON.stringify(result, null, 2) + "\n");
console.log(`Wrote ${Object.keys(result).length} entries to src/content/images.json`);
```

- [ ] **Step 3: Write the failing test**

```ts
// tests/unit/content/images.test.ts
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import manifest from "@/content/images.json";
import { manifest as source } from "../../../scripts/image-manifest.mjs";

describe("image manifest", () => {
  it("has an entry and a file for every manifest item", () => {
    for (const { out } of source) {
      expect(manifest, out).toHaveProperty(out);
      expect(existsSync(path.join(process.cwd(), "public/images", out)), out).toBe(true);
    }
  });
});
```

Add `"allowJs": true` to `tsconfig.json` `compilerOptions` if typecheck complains about the `.mjs` import, and add `declare module "*.mjs";` is NOT needed when `allowJs` is on.

Run: `pnpm test tests/unit/content/images.test.ts`
Expected: FAIL (manifest empty).

- [ ] **Step 4: Fetch brand assets and images**

```bash
mkdir -p public/brand
curl -sL "https://99x.io/_/no.seeds.99x:asset/000001a0f87c68d0/svg/ux/99x-logo.svg" -o public/brand/99x-logo.svg
curl -sL "https://99x.io/_/media:image/english/030aa318-edfd-4e1c-88ed-e7d5cf699a7d:326fdfbdc9b3f6e59d839f5ff6f5a2b6/full/99xlogo_white.svg" -o public/brand/99x-logo-white.svg
curl -sL "https://99x.io/_/media:image/english/f30e4600-246c-4f58-a9c9-a52687f8380c:dd8b9f5ad77350140d1bb1d0edbc62fb/square-192/99xfavicon-512x512.png" -o src/app/icon.png
cp src/app/icon.png src/app/apple-icon.png
pnpm images
```

Expected: 46 `✓` lines and "Wrote 46 entries". If a `match` finds nothing, open the corresponding `_docs/content/source/<page>.md`, search for a similar filename and fix the `match` string (do not delete the entry).

- [ ] **Step 5: Visual review of photography**

Open each image under `public/images/` (Finder quick look or the Read tool). For any image that is clearly wrong for its role (e.g. a screenshot where a team photo is expected, or a timeline image unrelated to its year), swap the `match` for a better candidate from the same source page and re-run `pnpm images --force`. Record every swap and any image still weak in `_docs/content/open-questions.md` under "Assets".

- [ ] **Step 6: Run tests**

Run: `pnpm test tests/unit/content/images.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(assets): brand logos, favicon and optimised 99x photography

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Motion engine — GSAP setup, smooth scroll, reduced motion, primitives

**Files:**
- Create: `src/lib/gsap.ts`, `src/lib/motion.ts`, `src/lib/loader.ts`, `src/components/motion/{SmoothScroll,RevealLines,ScrubText,FadeUp,Parallax,PillWipe}.tsx`
- Test: `tests/unit/lib/motion.test.ts`, `tests/unit/lib/loader.test.ts`

**Interfaces:**
- `src/lib/gsap.ts` exports `gsap`, `ScrollTrigger`, `SplitText`, `useGSAP`, `HOUSE_EASE = "house"`, `DUR = { reveal: 1.2, hover: 0.5, card: 0.8 }`. Importing it registers plugins once (client only).
- `src/lib/motion.ts`: `prefersReducedMotion(): boolean`, `useReducedMotion(): boolean` (subscribes to changes).
- `src/lib/loader.ts`: `markLoaderDone(): void`, `isLoaderDone(): boolean`, `onLoaderDone(cb: () => void): () => void` (calls immediately if already done; returns unsubscribe). Event name `"loader:done"` on `window`.
- `SmoothScroll` provides `useLenis(): Lenis | null` via context; children rendered unchanged.
- `<RevealLines as="h1" lines={string[]} className delay? waitForLoader? />` — one masked line per entry.
- `<ScrubText as="p" text className />` — statement scrub effect.
- `<FadeUp className>` children — batch fade-up for children with `[data-fade]`.
- `<Parallax className amount?: number (default 10)>` children — wraps media at 120% scale.
- `<PillWipe text className />` — XXL text with gradient pill wipe.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/unit/lib/motion.test.ts
import { describe, it, expect, vi, afterEach } from "vitest";
import { prefersReducedMotion } from "@/lib/motion";

describe("prefersReducedMotion", () => {
  afterEach(() => vi.restoreAllMocks());
  it("is false by default", () => expect(prefersReducedMotion()).toBe(false));
  it("is true when the media query matches", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    expect(prefersReducedMotion()).toBe(true);
  });
});
```

```ts
// tests/unit/lib/loader.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("loader signal", () => {
  beforeEach(() => vi.resetModules());
  it("fires subscribers once when marked done", async () => {
    const { onLoaderDone, markLoaderDone } = await import("@/lib/loader");
    const cb = vi.fn();
    onLoaderDone(cb);
    markLoaderDone();
    markLoaderDone();
    expect(cb).toHaveBeenCalledTimes(1);
  });
  it("calls immediately when already done", async () => {
    const { onLoaderDone, markLoaderDone } = await import("@/lib/loader");
    markLoaderDone();
    const cb = vi.fn();
    onLoaderDone(cb);
    expect(cb).toHaveBeenCalledTimes(1);
  });
  it("unsubscribe prevents the call", async () => {
    const { onLoaderDone, markLoaderDone } = await import("@/lib/loader");
    const cb = vi.fn();
    const off = onLoaderDone(cb);
    off();
    markLoaderDone();
    expect(cb).not.toHaveBeenCalled();
  });
});
```

Run: `pnpm test tests/unit/lib`
Expected: FAIL (modules missing).

- [ ] **Step 2: Implement `src/lib/motion.ts` and `src/lib/loader.ts`**

```ts
// src/lib/motion.ts
"use client";
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener?.("change", cb);
  return () => mq.removeEventListener?.("change", cb);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
```

```ts
// src/lib/loader.ts
let done = false;
const subs = new Set<() => void>();

export function isLoaderDone() {
  return done;
}

export function markLoaderDone() {
  if (done) return;
  done = true;
  subs.forEach((cb) => cb());
  subs.clear();
  if (typeof window !== "undefined") window.dispatchEvent(new Event("loader:done"));
}

export function onLoaderDone(cb: () => void): () => void {
  if (done) {
    cb();
    return () => {};
  }
  subs.add(cb);
  return () => subs.delete(cb);
}
```

Run: `pnpm test tests/unit/lib` → PASS.

- [ ] **Step 3: Implement `src/lib/gsap.ts`**

```ts
"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

export const HOUSE_EASE = "house";
export const DUR = { reveal: 1.2, hover: 0.5, card: 0.8 } as const;

let registered = false;
if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
  CustomEase.create(HOUSE_EASE, "M0,0 C0.6,0 0,1 1,1");
  gsap.defaults({ ease: HOUSE_EASE, duration: DUR.reveal });
  // Transform pinning keeps pinned sections correct while the menu transforms the page shell.
  ScrollTrigger.defaults({ pinType: "transform" });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
```

- [ ] **Step 4: Implement `SmoothScroll`**

```tsx
// src/components/motion/SmoothScroll.tsx
"use client";
import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({ lerp: 0.125, smoothWheel: true });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
```

- [ ] **Step 5: Implement the primitives**

```tsx
// src/components/motion/RevealLines.tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, DUR } from "@/lib/gsap";
import { onLoaderDone } from "@/lib/loader";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Props = {
  as?: "h1" | "h2" | "p" | "div";
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  waitForLoader?: boolean;
};

export function RevealLines({ as: Tag = "h1", lines, className, lineClassName, delay = 0, waitForLoader = false }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const inner = ref.current?.querySelectorAll("[data-line-inner]");
      if (!inner?.length) return;
      if (prefersReducedMotion()) {
        gsap.set(inner, { yPercent: 0 });
        return;
      }
      gsap.set(inner, { yPercent: 110 });
      const play = () => gsap.to(inner, { yPercent: 0, duration: DUR.reveal, stagger: 0.03, delay });
      if (waitForLoader) return onLoaderDone(play);
      play();
    },
    { scope: ref },
  );

  return (
    // aria-label keeps the sentence intact for screen readers; visual lines are aria-hidden.
    <Tag ref={ref as never} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, i) => (
        <span key={i} className={cn("mask-line", lineClassName)} aria-hidden="true">
          <span data-line-inner className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
```

Note: the server-rendered HTML shows lines in place (no `yPercent` until JS runs), so no-JS users and crawlers see text.

```tsx
// src/components/motion/ScrubText.tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type Props = { as?: "p" | "h2" | "div"; text: string; className?: string };

export function ScrubText({ as: Tag = "p", text, className }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      let tweens: gsap.core.Tween[] = [];
      // autoSplit re-splits on resize/font load; kill the previous tweens each time.
      const split = SplitText.create(ref.current, {
        type: "lines,words,chars",
        aria: "auto",
        autoSplit: true,
        charsClass: "split-char",
        onSplit(self) {
          tweens.forEach((t) => t.kill());
          tweens = self.lines.map((line) =>
            gsap.fromTo(
              line.querySelectorAll(".split-char"),
              { opacity: 0.2 },
              { opacity: 1, ease: "none", stagger: 0.02, scrollTrigger: { trigger: line, start: "top 85%", end: "top 50%", scrub: true } },
            ),
          );
        },
      });
      return () => {
        tweens.forEach((t) => t.kill());
        split.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {text}
    </Tag>
  );
}
```

```tsx
// src/components/motion/FadeUp.tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, DUR } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

export function FadeUp({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const items = ref.current?.querySelectorAll<HTMLElement>("[data-fade]");
      if (!items?.length || prefersReducedMotion()) return;
      gsap.set(items, { autoAlpha: 0, y: "2em" });
      ScrollTrigger.batch(items, {
        start: "top 85%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: DUR.card, ease: "power2.out", stagger: 0.08 }),
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

```tsx
// src/components/motion/Parallax.tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function Parallax({ children, className, amount = 10 }: { children: React.ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const inner = ref.current?.firstElementChild;
      if (!inner || prefersReducedMotion()) return;
      gsap.fromTo(
        inner,
        { yPercent: -amount },
        { yPercent: amount, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-[-10%] h-[120%] w-[120%] will-change-transform">{children}</div>
    </div>
  );
}
```

```tsx
// src/components/motion/PillWipe.tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function PillWipe({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const pills = ref.current?.querySelectorAll("[data-pill]");
      const words = ref.current?.querySelectorAll("[data-word]");
      if (!pills?.length || !words?.length) return;
      if (prefersReducedMotion()) {
        gsap.set(pills, { width: "0%" });
        return;
      }
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 75%", once: true } });
      tl.fromTo(pills, { width: "0%" }, { width: "100%", duration: 1, stagger: 0.025 })
        .set(words, { color: "var(--color-ink)" }, 1)
        .to(pills, { width: "0%", left: "100%", duration: 1, stagger: 0.025 }, 1);
    },
    { scope: ref },
  );
  return (
    <p ref={ref} className={cn("text-xxl text-center", className)} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden="true" className="relative inline-block mr-[0.2em]">
          <span data-word className="relative z-10 text-ink">{w}</span>
          <span
            data-pill
            className="absolute inset-y-[0.08em] left-0 z-20 w-0 rounded-full"
            style={{ background: "linear-gradient(90deg, var(--color-ink), var(--color-accent-deep))" }}
          />
        </span>
      ))}
    </p>
  );
}
```

- [ ] **Step 6: Typecheck and test**

Run: `pnpm typecheck && pnpm test`
Expected: PASS. (Visual verification of these primitives happens in Task 6's kitchen sink.)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(motion): GSAP/Lenis engine, reduced-motion and reveal primitives

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: UI primitives and the dev kitchen sink

**Files:**
- Create: `src/components/ui/{SmartLink,Button,ButtonSm,SectionTag,Eyebrow,Stat,Icon,TickRuler,Toggle,Field}.tsx`, `src/app/dev/kitchen-sink/page.tsx`
- Test: `tests/unit/ui/SmartLink.test.tsx`, `tests/unit/ui/Toggle.test.tsx`, `tests/unit/ui/SectionTag.test.tsx`

**Interfaces:**
- `SmartLink(props: { link: Link; className?: string; children?: ReactNode; onClick? })` — internal → `TransitionLink` (Task 7; until then `next/link`), external → `<a target="_self" rel="noopener">`; `mailto:`/`tel:`/`#` → plain `<a>`.
- `Button({ link, variant?: "dark" | "light" | "next"; size?: "md" | "xl"; className? })` — renders a `SmartLink`. `ButtonAction({ children, type, variant, disabled })` same look as `<button>`.
- `ButtonSm({ link, className? })`.
- `SectionTag({ index: string; label: string; tone?: "dark" | "light" })`.
- `Eyebrow({ children, size?: "m" | "s", className?, as? })`.
- `Stat({ value, label, icon: IconName })`.
- `Icon({ name: IconName | "linkedin" | "youtube" | "play" | "close", className? })` — 24×24 viewBox, `stroke-width 1.5`, `aria-hidden`.
- `TickRuler({ count?: number (default 24), orientation?: "vertical" | "horizontal", progress?: number (0–1), className? })`.
- `Toggle({ items: string[], value: number, onChange(i), label: string, tone?: "ink" | "tint" | "paper", idPrefix: string })` — WAI-ARIA tablist; tab ids `${idPrefix}-tab-${i}`, controls `${idPrefix}-panel-${i}`.
- `Field({ name, label, hint?, type?: "text"|"email"|"tel"|"textarea", required?, error?, autoComplete? })`.

- [ ] **Step 1: Write failing tests**

```tsx
// tests/unit/ui/SmartLink.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SmartLink } from "@/components/ui/SmartLink";

describe("SmartLink", () => {
  it("renders external links as plain anchors with rel", () => {
    render(<SmartLink link={{ label: "AI", href: "https://99x.io/ai-99x", external: true }} />);
    const a = screen.getByRole("link", { name: "AI" });
    expect(a).toHaveAttribute("href", "https://99x.io/ai-99x");
    expect(a).toHaveAttribute("rel", "noopener");
  });
  it("renders mailto as plain anchor", () => {
    render(<SmartLink link={{ label: "Mail", href: "mailto:hello.norway@99x.io" }} />);
    expect(screen.getByRole("link", { name: "Mail" })).toHaveAttribute("href", "mailto:hello.norway@99x.io");
  });
  it("renders internal links", () => {
    render(<SmartLink link={{ label: "About", href: "/about-us" }} />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about-us");
  });
});
```

```tsx
// tests/unit/ui/Toggle.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Toggle } from "@/components/ui/Toggle";

function Harness({ onChange = vi.fn() }) {
  const [v, setV] = useState(0);
  return <Toggle items={["01", "02", "03"]} value={v} onChange={(i) => { setV(i); onChange(i); }} label="Proof points" idPrefix="t" />;
}

describe("Toggle", () => {
  it("exposes a tablist with the selected tab", () => {
    render(<Harness />);
    expect(screen.getByRole("tablist", { name: "Proof points" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "01" })).toHaveAttribute("aria-selected", "true");
  });
  it("moves with arrow keys and wraps", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    screen.getByRole("tab", { name: "01" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "03" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "03" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "01" })).toHaveAttribute("aria-selected", "true");
  });
  it("only the selected tab is in the tab order", () => {
    render(<Harness />);
    expect(screen.getByRole("tab", { name: "01" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "02" })).toHaveAttribute("tabindex", "-1");
  });
});
```

```tsx
// tests/unit/ui/SectionTag.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SectionTag } from "@/components/ui/SectionTag";

describe("SectionTag", () => {
  it("renders index and label", () => {
    const { container } = render(<SectionTag index="S.01" label="About us" />);
    expect(container.textContent).toContain("S.01");
    expect(container.textContent).toContain("About us");
  });
});
```

Run: `pnpm test tests/unit/ui` → FAIL.

- [ ] **Step 2: Implement `SmartLink`, `Button`, `ButtonSm`**

```tsx
// src/components/ui/SmartLink.tsx
import NextLink from "next/link";
import type { Link } from "@/content/schema";

type Props = { link: Link; className?: string; children?: React.ReactNode; onClick?: React.MouseEventHandler<HTMLAnchorElement> };

const isPlain = (href: string) => href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#");

export function SmartLink({ link, className, children, onClick }: Props) {
  const content = children ?? link.label;
  if (link.external) {
    return (
      <a href={link.href} rel="noopener" className={className} onClick={onClick}>
        {content}
      </a>
    );
  }
  if (isPlain(link.href)) {
    return (
      <a href={link.href} className={className} onClick={onClick}>
        {content}
      </a>
    );
  }
  return (
    <NextLink href={link.href} className={className} onClick={onClick}>
      {content}
    </NextLink>
  );
}
```

(Task 7 swaps `NextLink` for `TransitionLink` in this one place.)

```tsx
// src/components/ui/Button.tsx
import { cn } from "@/lib/cn";
import type { Link } from "@/content/schema";
import { SmartLink } from "./SmartLink";

type Variant = "dark" | "light" | "next";
type Size = "md" | "xl";

const shell: Record<Variant, string> = {
  dark: "bg-ink text-paper",
  light: "bg-paper text-ink",
  next: "bg-paper text-ink",
};
const arrowFront: Record<Variant, string> = {
  dark: "bg-paper text-ink",
  light: "bg-ink text-paper",
  next: "bg-accent text-ink",
};

function Arrow({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("grid size-8 shrink-0 place-items-center rounded-sm", className)}>
      <svg viewBox="0 0 12 12" className="size-3 fill-current"><path d="M3 1.5v9L10 6z" /></svg>
    </span>
  );
}

export function ButtonInner({ label, variant = "dark", size = "md" }: { label: string; variant?: Variant; size?: Size }) {
  return (
    <span className={cn("group/btn relative inline-flex overflow-hidden rounded-md p-1", shell[variant])}>
      <span className="flex items-center transition-transform duration-500 ease-house group-hover/btn:translate-x-9 group-focus-visible/btn:translate-x-9">
        {/* hidden accent arrow that slides in from the left */}
        <Arrow className="absolute -left-8 bg-accent text-ink" />
        <span className={cn("font-mono font-light uppercase", size === "xl" ? "px-8 text-body-m" : "px-6 text-button")}>{label}</span>
        <Arrow className={cn(arrowFront[variant], "transition-opacity duration-500 group-hover/btn:opacity-0")} />
      </span>
    </span>
  );
}

export function Button({ link, variant = "dark", size = "md", className }: { link: Link; variant?: Variant; size?: Size; className?: string }) {
  return (
    <SmartLink link={link} className={cn("group/btn inline-block min-h-11", className)}>
      <ButtonInner label={link.label} variant={variant} size={size} />
    </SmartLink>
  );
}

export function ButtonAction({
  children, type = "button", variant = "dark", disabled, className,
}: { children: string; type?: "button" | "submit"; variant?: Variant; disabled?: boolean; className?: string }) {
  return (
    <button type={type} disabled={disabled} className={cn("group/btn inline-block min-h-11 disabled:opacity-50", className)}>
      <ButtonInner label={children} variant={variant} />
    </button>
  );
}
```

```tsx
// src/components/ui/ButtonSm.tsx
import { cn } from "@/lib/cn";
import type { Link } from "@/content/schema";
import { SmartLink } from "./SmartLink";

export function ButtonSm({ link, className }: { link: Link; className?: string }) {
  return (
    <SmartLink
      link={link}
      className={cn(
        "group/sm inline-flex h-7 min-h-7 items-center gap-2 overflow-hidden rounded-xs bg-paper px-2 text-ink transition-colors duration-500 ease-house hover:bg-accent focus-visible:bg-accent",
        className,
      )}
    >
      <span className="font-mono text-eyebrow-s font-light uppercase transition-transform duration-500 ease-house group-hover/sm:translate-x-1">
        {link.label}
      </span>
      <svg aria-hidden="true" viewBox="0 0 12 12" className="size-2 fill-current"><path d="M3 1.5v9L10 6z" /></svg>
    </SmartLink>
  );
}
```

- [ ] **Step 3: Implement `SectionTag`, `Eyebrow`, `Stat`, `Icon`, `TickRuler`**

```tsx
// src/components/ui/SectionTag.tsx
import { cn } from "@/lib/cn";

export function SectionTag({ index, label, tone = "dark" }: { index: string; label: string; tone?: "dark" | "light" }) {
  const line = tone === "dark" ? "border-ink" : "border-paper";
  return (
    <span className="mr-4 inline-flex translate-y-[-0.35em] flex-col align-middle font-mono text-eyebrow-s font-light uppercase">
      <span className={cn("self-start rounded-t-sm border px-1.5 py-1", line)}>{index}</span>
      <span className={cn("rounded-sm rounded-tl-none border px-1.5 py-1", line, tone === "dark" ? "bg-ink text-paper" : "bg-paper text-ink")}>
        {label}
      </span>
    </span>
  );
}
```

```tsx
// src/components/ui/Eyebrow.tsx
import { cn } from "@/lib/cn";

export function Eyebrow({ children, size = "m", className, as: Tag = "p" }: { children: React.ReactNode; size?: "m" | "s"; className?: string; as?: "p" | "span" | "h2" | "h3" }) {
  return <Tag className={cn("font-mono font-light uppercase", size === "m" ? "text-eyebrow-m" : "text-eyebrow-s", className)}>{children}</Tag>;
}
```

```tsx
// src/components/ui/Icon.tsx
import type { IconName } from "@/content/schema";
import { cn } from "@/lib/cn";

type Name = IconName | "linkedin" | "youtube" | "play" | "close" | "plus";

const paths: Record<Name, React.ReactNode> = {
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  people: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5" /><circle cx="17" cy="9" r="2.5" /><path d="M17 14c2.4 0 4 1.5 4.5 4" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  code: <><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></>,
  browser: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></>,
  users: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></>,
  spark: <><path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  shield: <><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  star: <><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" /></>,
  heart: <><path d="M12 20s-8-4.6-8-10.2C4 6.6 6.4 4.5 9 4.5c1.4 0 2.4.7 3 1.6.6-.9 1.6-1.6 3-1.6 2.6 0 5 2.1 5 5.3C20 15.4 12 20 12 20Z" /></>,
  mobile: <><rect x="7" y="2.5" width="10" height="19" rx="2" /><path d="M11 18.5h2" /></>,
  database: <><ellipse cx="12" cy="5.5" rx="8" ry="3" /><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  play: <><path d="M8 5v14l11-7L8 5Z" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></>,
  youtube: <><rect x="2.5" y="5.5" width="19" height="13" rx="3.5" /><path d="m10 9 5 3-5 3V9Z" /></>,
};

export function Icon({ name, className }: { name: Name; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-6 fill-none stroke-current", className)} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}
```

```tsx
// src/components/ui/Stat.tsx
import type { IconName } from "@/content/schema";
import { Icon } from "./Icon";
import { Eyebrow } from "./Eyebrow";

export function Stat({ value, label, icon }: { value: string; label: string; icon: IconName }) {
  return (
    <div data-fade className="flex flex-col gap-6 border-t border-ink/20 pt-4">
      <Icon name={icon} className="size-12" />
      <p className="text-stat [text-box:trim-both_cap_alphabetic]">{value}</p>
      <Eyebrow>{label}</Eyebrow>
    </div>
  );
}
```

```tsx
// src/components/ui/TickRuler.tsx
import { cn } from "@/lib/cn";

const WIDTHS = [0.75, 0.875, 1, 1.25, 1.5, 1.25, 1, 0.875];

export function TickRuler({ count = 24, orientation = "vertical", progress = 0, className }: { count?: number; orientation?: "vertical" | "horizontal"; progress?: number; className?: string }) {
  const active = Math.round(progress * count);
  return (
    <div aria-hidden="true" className={cn("flex justify-between", orientation === "vertical" ? "h-full flex-col" : "w-full flex-row", className)}>
      {Array.from({ length: count }, (_, i) => {
        const w = WIDTHS[i % WIDTHS.length];
        return (
          <span
            key={i}
            className="block bg-current transition-opacity duration-300"
            style={{
              opacity: i < active ? 0.75 : 0.2,
              ...(orientation === "vertical" ? { height: 1, width: `calc(var(--u) * ${w})` } : { width: 1, height: `calc(var(--u) * ${w})` }),
            }}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Implement `Toggle` and `Field`**

```tsx
// src/components/ui/Toggle.tsx
"use client";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type Props = {
  items: string[];
  value: number;
  onChange: (i: number) => void;
  label: string;
  idPrefix: string;
  tone?: "ink" | "tint" | "paper";
};

const tones = {
  ink: { bg: "bg-ink", idle: "text-paper", active: "text-ink", ind: "bg-paper" },
  tint: { bg: "bg-tint", idle: "text-ink", active: "text-paper", ind: "bg-ink" },
  paper: { bg: "bg-paper", idle: "text-ink", active: "text-paper", ind: "bg-ink" },
};

export function Toggle({ items, value, onChange, label, idPrefix, tone = "ink" }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = tones[tone];

  const move = (next: number) => {
    const i = (next + items.length) % items.length;
    onChange(i);
    refs.current[i]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className={cn("relative inline-flex rounded-md p-1", t.bg)}>
      <span
        aria-hidden="true"
        className={cn("absolute top-1 left-1 size-[calc(var(--u)*2.125)] rounded-sm transition-transform duration-500 ease-house", t.ind)}
        style={{ transform: `translateX(calc(${value} * var(--u) * 2.125))` }}
      />
      {items.map((item, i) => (
        <button
          key={item}
          ref={(el) => { refs.current[i] = el; }}
          role="tab"
          id={`${idPrefix}-tab-${i}`}
          aria-controls={`${idPrefix}-panel-${i}`}
          aria-selected={i === value}
          tabIndex={i === value ? 0 : -1}
          onClick={() => onChange(i)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); move(value + 1); }
            if (e.key === "ArrowLeft") { e.preventDefault(); move(value - 1); }
            if (e.key === "Home") { e.preventDefault(); move(0); }
            if (e.key === "End") { e.preventDefault(); move(items.length - 1); }
          }}
          className={cn(
            "relative z-10 grid size-[calc(var(--u)*2.125)] place-items-center font-mono text-eyebrow-s font-light transition-colors duration-500",
            i === value ? t.active : t.idle,
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
```

```tsx
// src/components/ui/Field.tsx
import { cn } from "@/lib/cn";

type Props = {
  name: string;
  label: string;
  hint?: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  error?: string;
  autoComplete?: string;
  maxLength?: number;
};

export function Field({ name, label, hint, type = "text", required, error, autoComplete, maxLength }: Props) {
  const id = `f-${name}`;
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  const common = {
    id, name, required, autoComplete, maxLength,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: cn(
      "w-full border-0 border-b bg-transparent py-6 text-body-s font-bold outline-none placeholder:text-ink/30 focus-visible:border-accent-deep",
      error ? "border-logo-red" : "border-ink",
    ),
  };
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && <span id={`${id}-hint`} className="mt-1 text-body-s text-ink/50">{hint}</span>}
      {type === "textarea" ? <textarea rows={4} {...common} /> : <input type={type} {...common} />}
      {error && <p id={`${id}-err`} className="mt-2 font-mono text-eyebrow-m font-light uppercase text-logo-red">{error}</p>}
    </div>
  );
}
```

(`text-logo-red #B44B4B` on white is 5.3:1 — passes AA for the small mono error text.)

- [ ] **Step 5: Kitchen sink (dev only)**

```tsx
// src/app/dev/kitchen-sink/page.tsx
"use client";
import { notFound } from "next/navigation";
import { useState } from "react";
import { Button, ButtonAction } from "@/components/ui/Button";
import { ButtonSm } from "@/components/ui/ButtonSm";
import { SectionTag } from "@/components/ui/SectionTag";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Stat";
import { TickRuler } from "@/components/ui/TickRuler";
import { Toggle } from "@/components/ui/Toggle";
import { Field } from "@/components/ui/Field";
import { ScrubText } from "@/components/motion/ScrubText";
import { RevealLines } from "@/components/motion/RevealLines";
import { PillWipe } from "@/components/motion/PillWipe";
import { FadeUp } from "@/components/motion/FadeUp";

export default function KitchenSink() {
  if (process.env.NODE_ENV === "production") notFound();
  const [tab, setTab] = useState(0);
  return (
    <main className="bg-paper site-x flex flex-col gap-24 py-32">
      <RevealLines lines={["We build digital products,", "scale teams and put AI to work."]} className="text-hero" />
      <div className="flex flex-wrap gap-4 bg-tint p-8">
        <Button link={{ label: "About us", href: "/about-us" }} />
        <Button link={{ label: "Light", href: "/" }} variant="light" />
        <Button link={{ label: "Our services", href: "/services" }} variant="next" size="xl" />
        <ButtonAction type="button">Send</ButtonAction>
        <ButtonSm link={{ label: "Our services", href: "/services" }} />
      </div>
      <p className="grid-12"><span className="col-span-8 text-statement"><SectionTag index="S.01" label="About us" />For more than two decades, companies have trusted 99x to shape their products.</span></p>
      <ScrubText className="w-[57em] text-statement" text="Grey text that fills in as you scroll, line by line, character by character." />
      <FadeUp className="grid grid-cols-2 gap-4 w-[42em]">
        <Stat value="20+" label="Years building software" icon="calendar" />
        <Stat value="600+" label="People" icon="people" />
      </FadeUp>
      <PillWipe text="100+ companies transformed" />
      <div className="h-64 text-ink"><TickRuler progress={0.4} /></div>
      <Toggle items={["01", "02", "03"]} value={tab} onChange={setTab} label="Demo" idPrefix="demo" />
      <form className="flex w-[28em] flex-col gap-8"><Field name="name" label="Name" hint="Who should we reply to?" required /><Field name="email" type="email" label="Email" error="Enter a valid email address" required /></form>
      <Eyebrow>Eyebrow M</Eyebrow>
      <div className="h-[150vh]" />
    </main>
  );
}
```

- [ ] **Step 6: Run tests and visually compare**

Run: `pnpm test tests/unit/ui && pnpm typecheck`
Expected: PASS.

Run `pnpm dev`, open `http://localhost:3000/dev/kitchen-sink` at 1440×900 in the browser pane, and compare against `_docs/reference/cominvi-shots/home-d-01.png` (statement + tag + stats), `home-d-03.png` (buttons/cards). Check: button hover slides content and reveals lavender arrow; section tag sits inline with the statement baseline; statement chars fill as you scroll; pill wipe plays. Fix proportions until they match cominvi.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(ui): primitives (buttons, tags, stats, toggle, fields, icons, ticks) and kitchen sink

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Global layout — page shell, header, menu, footer, loader, transitions

**Files:**
- Create: `src/components/layout/{PageShell,Header,MenuButton,Menu,Footer,Loader,SkipLink}.tsx`, `src/components/motion/{PageTransition,TransitionLink}.tsx`, `src/components/layout/ui-store.ts`
- Modify: `src/app/layout.tsx` (final version), `src/components/ui/SmartLink.tsx` (use `TransitionLink`)
- Test: `tests/unit/layout/ui-store.test.ts`, `tests/e2e/menu.spec.ts`, `tests/e2e/loader.spec.ts`

**Interfaces:**
- `ui-store.ts` (tiny external store, no deps): `useUi(): { menuOpen: boolean; headerTheme: Theme; headerHidden: boolean }`, `setMenuOpen(b)`, `setHeaderTheme(t)`, `setHeaderHidden(b)`.
- `PageTransition` provides `usePageTransition(): { navigate(href: string, opts?: { variant?: "fade" | "next"; from?: HTMLElement }): Promise<void>; arrivedVia: "fade" | "next" | null }`.
- `TransitionLink(props: NextLink props & { variant?: "fade" | "next" })`.
- Sections must set `data-theme={theme}` on their root element (Header reads it).
- DOM ids: `#page` (shell that moves when menu opens), `#main` (skip-link target).

- [ ] **Step 1: Write failing tests**

```ts
// tests/unit/layout/ui-store.test.ts
import { describe, it, expect } from "vitest";
import { getUi, setMenuOpen, setHeaderTheme } from "@/components/layout/ui-store";

describe("ui store", () => {
  it("toggles the menu", () => {
    setMenuOpen(true);
    expect(getUi().menuOpen).toBe(true);
    setMenuOpen(false);
    expect(getUi().menuOpen).toBe(false);
  });
  it("stores header theme", () => {
    setHeaderTheme("tint");
    expect(getUi().headerTheme).toBe("tint");
  });
});
```

```ts
// tests/e2e/menu.spec.ts
import { test, expect } from "@playwright/test";

test.describe("menu", () => {
  test("opens with click, traps focus, closes with Escape", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: /menu/i });
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav).toBeVisible();
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
```

```ts
// tests/e2e/loader.spec.ts
import { test, expect } from "@playwright/test";

test("loader shows on first visit only", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-loader]")).toBeHidden({ timeout: 5000 });
  await page.reload();
  // second load in same session: hidden before first paint
  const visible = await page.locator("[data-loader]").isVisible();
  expect(visible).toBe(false);
});
```

Note: `/contact` doesn't exist until Task 17. Until then, mark the second menu test `test.fixme` and un-fixme it in Task 17 Step 6.

Run: `pnpm test tests/unit/layout` → FAIL.

- [ ] **Step 2: Implement `ui-store.ts`**

```ts
// src/components/layout/ui-store.ts
"use client";
import { useSyncExternalStore } from "react";
import type { Theme } from "@/content/schema";

type Ui = { menuOpen: boolean; headerTheme: Theme; headerHidden: boolean };
let state: Ui = { menuOpen: false, headerTheme: "dark", headerHidden: false };
const subs = new Set<() => void>();

const set = (patch: Partial<Ui>) => {
  state = { ...state, ...patch };
  subs.forEach((s) => s());
};

export const getUi = () => state;
export const setMenuOpen = (menuOpen: boolean) => set({ menuOpen });
export const setHeaderTheme = (headerTheme: Theme) => set({ headerTheme });
export const setHeaderHidden = (headerHidden: boolean) => set({ headerHidden });
export const useUi = () =>
  useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => state,
    () => state,
  );
```

Run: `pnpm test tests/unit/layout` → PASS.

- [ ] **Step 3: Implement `PageTransition` and `TransitionLink`**

```tsx
// src/components/motion/PageTransition.tsx
"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, HOUSE_EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useLenis } from "./SmoothScroll";
import { setMenuOpen } from "@/components/layout/ui-store";

type Variant = "fade" | "next";
type Ctx = { navigate: (href: string, opts?: { variant?: Variant; from?: HTMLElement }) => Promise<void>; arrivedVia: Variant | null };

const TransitionContext = createContext<Ctx>({ navigate: async () => {}, arrivedVia: null });
export const usePageTransition = () => useContext(TransitionContext);

export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const overlay = useRef<HTMLDivElement>(null);
  const pending = useRef<Variant | null>(null);
  const [arrivedVia, setArrivedVia] = useState<Variant | null>(null);
  const busy = useRef(false);

  const navigate = useCallback<Ctx["navigate"]>(
    async (href, opts) => {
      if (busy.current || href === pathname) return;
      busy.current = true;
      const variant = opts?.variant ?? "fade";
      pending.current = variant;
      setMenuOpen(false);
      const reduced = prefersReducedMotion();
      if (!reduced) {
        if (variant === "next" && opts?.from) {
          // Scroll the NextPage panel to the top so it becomes the next hero.
          await new Promise<void>((resolve) => {
            if (lenis) lenis.scrollTo(opts.from!, { duration: 1, easing: (t) => 1 - Math.pow(1 - t, 4), onComplete: () => resolve() });
            else { opts.from!.scrollIntoView({ behavior: "smooth" }); setTimeout(resolve, 900); }
          });
        } else {
          await gsap.to(overlay.current, { autoAlpha: 1, duration: 0.6, ease: HOUSE_EASE });
        }
      }
      router.push(href, { scroll: false });
    },
    [lenis, pathname, router],
  );

  // Enter phase: runs after the new route has rendered.
  useEffect(() => {
    const variant = pending.current;
    pending.current = null;
    busy.current = false;
    setArrivedVia(variant);
    if (!window.location.hash) {
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    ScrollTrigger.refresh();
    if (!overlay.current) return;
    if (variant === "fade") gsap.to(overlay.current, { autoAlpha: 0, duration: 0.6, ease: HOUSE_EASE, delay: 0.05 });
    else gsap.set(overlay.current, { autoAlpha: 0 });
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TransitionContext.Provider value={{ navigate, arrivedVia }}>
      {children}
      <div ref={overlay} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[70] bg-ink opacity-0" />
    </TransitionContext.Provider>
  );
}
```

```tsx
// src/components/motion/TransitionLink.tsx
"use client";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { usePageTransition } from "./PageTransition";

type Props = ComponentProps<typeof NextLink> & { variant?: "fade" | "next" };

export function TransitionLink({ href, variant = "fade", onClick, ...rest }: Props) {
  const { navigate } = usePageTransition();
  return (
    <NextLink
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        const target = typeof href === "string" ? href : href.pathname ?? "/";
        if (target.includes("#") && target.split("#")[0] === window.location.pathname) return; // same-page anchor
        e.preventDefault();
        const from = (e.currentTarget.closest("[data-next-page]") as HTMLElement | null) ?? undefined;
        void navigate(target, { variant, from });
      }}
      {...rest}
    />
  );
}
```

Modify `SmartLink.tsx`: replace the `NextLink` import/usage with `TransitionLink` (same props), and make the file `"use client"`.

- [ ] **Step 4: Implement `SkipLink`, `MenuButton`, `Header`**

```tsx
// src/components/layout/SkipLink.tsx
export function SkipLink() {
  return (
    <a href="#main" className="fixed top-2 left-2 z-[80] -translate-y-24 rounded-md bg-ink px-4 py-3 font-mono text-button font-light uppercase text-paper focus:translate-y-0">
      Skip to content
    </a>
  );
}
```

```tsx
// src/components/layout/MenuButton.tsx
"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const MenuButton = forwardRef<HTMLButtonElement, { open: boolean; onClick: () => void; tone: "dark" | "light" }>(
  function MenuButton({ open, onClick, tone }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={onClick}
        className="flex items-center gap-3"
      >
        <span className="text-body-s font-medium">{open ? "Close" : "Menu"}</span>
        <span
          className={cn(
            "relative grid size-12 place-items-center rounded-full border transition-colors duration-500 ease-house",
            open ? "border-accent bg-accent text-ink" : tone === "light" ? "border-paper/40" : "border-ink/40",
          )}
        >
          <span className={cn("absolute h-px w-4 bg-current transition-transform duration-[1200ms] ease-house", open ? "rotate-45" : "-translate-y-[3px]")} />
          <span className={cn("absolute h-px w-4 bg-current transition-transform duration-[1200ms] ease-house", open ? "-rotate-45" : "translate-y-[3px]")} />
        </span>
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
    );
  },
);
```

Note: the accessible name will be "Menu Open menu" / "Close Close menu" — the e2e regex `/menu/i` matches both.

```tsx
// src/components/layout/Header.tsx
"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/components/motion/SmoothScroll";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { MenuButton } from "./MenuButton";
import { setHeaderHidden, setHeaderTheme, setMenuOpen, useUi } from "./ui-store";
import { cn } from "@/lib/cn";
import type { Theme } from "@/content/schema";

export function Header() {
  const { menuOpen, headerTheme, headerHidden } = useUi();
  const pathname = usePathname();
  const lenis = useLenis();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastY = useRef(0);

  // Theme follows the section under the header.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]"));
    const triggers = sections.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 40px",
        end: "bottom 40px",
        onToggle: (self) => self.isActive && setHeaderTheme(el.dataset.theme as Theme),
      }),
    );
    if (sections[0]) setHeaderTheme(sections[0].dataset.theme as Theme);
    return () => triggers.forEach((t) => t.kill());
  }, [pathname]);

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) < 4) return;
      setHeaderHidden(y > lastY.current && y > 200);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) lenis?.stop();
    else lenis?.start();
  }, [menuOpen, lenis]);

  const light = menuOpen || headerTheme === "dark";
  const hidden = headerHidden && !menuOpen;

  return (
    <header className={cn("pointer-events-none fixed inset-x-0 top-6 z-[60] flex justify-between site-x", light ? "text-paper" : "text-ink")}>
      <TransitionLink
        href="/"
        aria-label="99x home"
        className={cn("pointer-events-auto flex items-stretch transition-transform duration-500 ease-house", hidden && "-translate-x-[9em]")}
      >
        <span className={cn("grid size-12 place-items-center rounded-md", light ? "bg-paper" : "bg-ink")}>
          {/* colour logo on paper tile / white logo on ink tile */}
          <img src={light ? "/brand/99x-logo.svg" : "/brand/99x-logo-white.svg"} alt="" width={32} height={16} className="w-8" />
        </span>
      </TransitionLink>
      <div className={cn("pointer-events-auto transition-transform duration-500 ease-house", hidden && "translate-x-[9em]")}>
        <MenuButton ref={buttonRef} open={menuOpen} tone={light ? "light" : "dark"} onClick={() => setMenuOpen(!menuOpen)} />
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Implement `Menu`**

```tsx
// src/components/layout/Menu.tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap, useGSAP, HOUSE_EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { setMenuOpen, useUi } from "./ui-store";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Site } from "@/content/schema";

export function Menu({ site }: { site: Site }) {
  const { menuOpen } = useUi();
  const ref = useRef<HTMLDivElement>(null);

  // Page shell drops down and insets (desktop) — cominvi signature.
  useGSAP(
    () => {
      const page = document.getElementById("page");
      if (!page) return;
      const desktop = window.matchMedia("(min-width: 992px)").matches;
      const reduced = prefersReducedMotion();
      const d = reduced ? 0 : 1.2;
      if (menuOpen) {
        gsap.set(ref.current, { visibility: "visible" });
        if (desktop) gsap.to(page, { y: () => ref.current!.querySelector("[data-menu-inner]")!.clientHeight, scale: 0.96, borderRadius: "calc(var(--u) * 0.5)", duration: d, ease: HOUSE_EASE });
        gsap.fromTo(ref.current!.querySelectorAll("[data-menu-item]"), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.03, duration: reduced ? 0 : 0.8, ease: HOUSE_EASE, delay: reduced ? 0 : 0.2 });
      } else {
        gsap.to(page, { y: 0, scale: 1, borderRadius: 0, duration: d, ease: HOUSE_EASE, clearProps: "transform,borderRadius" });
        gsap.to(ref.current, { visibility: "hidden", delay: d });
      }
    },
    { dependencies: [menuOpen] },
  );

  // Focus management + Escape + focus trap.
  useEffect(() => {
    if (!menuOpen) return;
    const root = ref.current!;
    const focusables = () => Array.from(root.querySelectorAll<HTMLElement>("a,button")).concat(
      Array.from(document.querySelectorAll<HTMLElement>("header button[aria-controls='site-menu']")),
    );
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        document.querySelector<HTMLElement>("header button[aria-controls='site-menu']")?.focus();
      }
      if (e.key === "Tab") {
        const els = focusables();
        const i = els.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        const next = e.shiftKey ? (i <= 0 ? els.length - 1 : i - 1) : (i === els.length - 1 ? 0 : i + 1);
        els[next]?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div
      ref={ref}
      id="site-menu"
      data-menu
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="invisible fixed inset-0 z-[55] bg-ink text-paper lg:bottom-auto"
    >
      <div data-menu-inner className="site-x grid min-h-svh grid-cols-1 content-end gap-12 pt-32 pb-12 lg:min-h-0 lg:grid-cols-12 lg:gap-4 lg:pt-32 lg:pb-16">
        <nav aria-label="Main" className="contents">
          {site.nav.map((group) => (
            <div key={group.label} className="flex flex-col gap-3 lg:col-span-3">
              <Eyebrow className="text-paper/50" data-menu-item>{group.label}</Eyebrow>
              {group.links.map((l) => (
                <span key={l.href} className="mask-line">
                  <SmartLink link={l} onClick={() => setMenuOpen(false)} className="group/ml flex items-center gap-3 text-menu" >
                    <span data-menu-item className="flex items-center gap-3 -translate-x-9 transition-transform duration-500 ease-house group-hover/ml:translate-x-0 group-focus-visible/ml:translate-x-0">
                      <Icon name="arrow" className="size-6 text-accent" />
                      {l.label}
                    </span>
                  </SmartLink>
                </span>
              ))}
            </div>
          ))}
        </nav>
        <div className="flex flex-col justify-between gap-8 lg:col-span-3" data-menu-item>
          <div className="flex gap-4 font-mono text-eyebrow-m font-light uppercase">
            {site.languages.map((lang) => (
              <SmartLink key={lang.code} link={{ label: lang.label, href: lang.href, external: lang.href.startsWith("https://") }} className={lang.active ? "text-accent" : "text-paper/60"} />
            ))}
          </div>
          <div className="flex gap-4">
            {site.socials.map((s) => (
              <a key={s.href} href={s.href} rel="noopener" aria-label={s.label} className="opacity-80 hover:opacity-100"><Icon name={s.icon} /></a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

Note: `Eyebrow` must forward extra props — add `...rest` passthrough to `Eyebrow` (`{...rest}` on the Tag) so `data-menu-item` lands on the element.

- [ ] **Step 6: Implement `Footer` and `Loader`**

```tsx
// src/components/layout/Footer.tsx
import type { Site } from "@/content/schema";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";

function Tag({ children }: { children: string }) {
  return <span className="inline-block rounded-sm border border-ink px-1.5 py-1 font-mono text-eyebrow-s font-light uppercase">{children}</span>;
}

export function Footer({ site }: { site: Site }) {
  const year = new Date().getFullYear();
  return (
    <footer data-theme="paper" className="bg-paper text-ink site-x pt-24 pb-8">
      <div className="grid-12 gap-y-16">
        <div className="col-span-12 flex flex-col gap-8 lg:col-span-4">
          <img src="/brand/99x-logo.svg" alt="99x" width={96} height={49} className="w-24" />
          <div className="flex gap-4 text-accent-deep">
            {site.socials.map((s) => (
              <a key={s.href} href={s.href} rel="noopener" aria-label={s.label}><Icon name={s.icon} /></a>
            ))}
          </div>
        </div>
        {site.footer.columns.map((c) => (
          <div key={c.tag} className="col-span-6 flex flex-col gap-4 md:col-span-3 lg:col-span-2">
            <Tag>{c.tag}</Tag>
            <ul className="flex flex-col gap-1">
              {c.links.map((l) => (
                <li key={l.href}><SmartLink link={l} className="font-medium leading-[1.4] text-ink/60 hover:text-ink" /></li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-12 flex flex-col gap-4 md:col-span-6 lg:col-span-2">
          <Tag>Contact</Tag>
          <address className="flex flex-col gap-1 not-italic font-medium leading-[1.4] text-ink/60">
            <span>{site.footer.contact.address}</span>
            <a href={`mailto:${site.footer.contact.email}`} className="hover:text-ink">{site.footer.contact.email}</a>
            <a href={`tel:${site.footer.contact.phone.replace(/\s/g, "")}`} className="hover:text-ink">{site.footer.contact.phone}</a>
          </address>
        </div>
      </div>
      <div className="mt-48 flex flex-col items-center gap-3 border-t border-ink/20 pt-6 text-center font-medium text-ink/60 md:flex-row md:justify-between">
        <p>© {year} 99x. All rights reserved.</p>
        <ul className="flex gap-6">
          {site.legal.map((l) => <li key={l.href}><SmartLink link={l} className="hover:text-ink" /></li>)}
        </ul>
      </div>
    </footer>
  );
}
```

```tsx
// src/components/layout/Loader.tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, HOUSE_EASE } from "@/lib/gsap";
import { markLoaderDone } from "@/lib/loader";
import { prefersReducedMotion } from "@/lib/motion";

const KEY = "99x-loaded";

export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}
    if (seen || prefersReducedMotion()) {
      gsap.set(ref.current, { display: "none" });
      markLoaderDone();
      return;
    }
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    const tl = gsap.timeline({ onComplete: () => { gsap.set(ref.current, { display: "none" }); } });
    tl.from("[data-loader-tile]", { scale: 0.6, autoAlpha: 0, duration: 0.6, ease: HOUSE_EASE })
      .to("[data-loader-tile]", { width: "calc(var(--u) * 9)", duration: 0.8, ease: HOUSE_EASE })
      .from("[data-loader-mark]", { autoAlpha: 0, duration: 0.4 }, "<0.3")
      .to("[data-loader-square]", { scale: 40, duration: 1, ease: HOUSE_EASE })
      .add(markLoaderDone, "-=0.4")
      .to(ref.current, { autoAlpha: 0, duration: 0.4 }, "-=0.2");
  }, { scope: ref });

  return (
    <div ref={ref} data-loader aria-hidden="true" className="fixed inset-0 z-[90] grid place-items-center overflow-hidden bg-ink">
      <span data-loader-square className="absolute size-4 rounded-xs bg-paper/0" />
      <span data-loader-tile className="relative z-10 grid h-[calc(var(--u)*2.8)] w-[calc(var(--u)*2.8)] place-items-center overflow-hidden rounded-md bg-paper">
        <img data-loader-mark src="/brand/99x-logo.svg" alt="" width={74} height={38} className="w-[calc(var(--u)*5)] max-w-none" />
      </span>
    </div>
  );
}
```

(`data-loader-square` scales a transparent→paper square; set its class to `bg-paper` — the opacity is driven by the scale-out reveal. Tune durations to match `_docs/reference/cominvi-shots/d00-loader.jpg`; total ≈ 2.6s.)

- [ ] **Step 7: Final root layout**

```tsx
// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontDisplay, fontMono } from "@/lib/fonts";
import { getSite } from "@/content";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransition } from "@/components/motion/PageTransition";
import { Header } from "@/components/layout/Header";
import { Menu } from "@/components/layout/Menu";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { SkipLink } from "@/components/layout/SkipLink";

export const metadata: Metadata = {
  metadataBase: new URL("https://99x.io"),
  title: { default: "99x", template: "%s — 99x" },
};
export const viewport: Viewport = { themeColor: "#160f17" };

// Hides the loader before first paint on repeat visits in the same session, and for no-JS users.
const loaderGate = `try{if(sessionStorage.getItem('99x-loaded')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.loaded='1'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderGate }} />
        <style>{`html[data-loaded="1"] [data-loader]{display:none}`}</style>
        <noscript><style>{`[data-loader]{display:none}`}</style></noscript>
      </head>
      <body>
        <SmoothScroll>
          <PageTransition>
            <SkipLink />
            <Loader />
            <Header />
            <Menu site={site} />
            <div id="page" className="relative z-[1] origin-top overflow-clip bg-paper">
              <main id="main" tabIndex={-1} className="outline-none">{children}</main>
              <Footer site={site} />
            </div>
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Run tests**

Run: `pnpm test && pnpm typecheck && pnpm test:e2e --project=desktop tests/e2e/menu.spec.ts tests/e2e/loader.spec.ts`
Expected: PASS (menu navigation test is `fixme` until Task 17).

Visually compare menu open state with `_docs/reference/cominvi-shots/home-d-menu-open.png` and `home-d-menu-hover.png` at 1440×900, and header hide/show with `home-d-nav-scrollup.png`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(layout): page shell, header, push-down menu, footer, loader and page transitions

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Section shell, renderer and core sections

**Files:**
- Create: `src/components/sections/{SectionShell,SectionRenderer,Hero,StatsSection,CardGrid,StickySplit,NumberedList,DisplayLine,CaseCards,InsightCards,MediaStatement,VideoLightbox,Tabs,NextPage}.tsx`
- Test: `tests/unit/sections/SectionRenderer.test.tsx`, `tests/unit/sections/VideoLightbox.test.tsx`

**Interfaces:**
- Consumes: schema types (Task 3), UI primitives (Task 6), motion primitives (Task 5), `TransitionLink` (Task 7).
- Produces:
  - `SectionShell({ theme, head?, id?, className?, children, bottom?: "lg" | "md" | "none" })` — `<section data-theme>` with bg/text colours, `pt-8` and bottom padding `pb-64` (lg) / `pb-48` (md); renders head as floated `SectionTag` + `ScrubText` statement over 8 columns.
  - `SectionRenderer({ sections: Section[]; site: Site })` — maps `type` → component; unknown types are impossible (schema), but the `switch` must be exhaustive (`const _: never = s`).
  - `Hero({ hero: Hero })`, `NextPage({ next: Page["next"] })`.
  - Section components take `{ section: <TheirType> }` (plus `site` where noted in later tasks).

- [ ] **Step 1: Write failing tests**

```tsx
// tests/unit/sections/SectionRenderer.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getSite } from "@/content";
import type { Section } from "@/content/schema";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/" }));
// jsdom has no layout; skip GSAP/SplitText work in this structural test.
vi.mock("@/lib/motion", () => ({ prefersReducedMotion: () => true, useReducedMotion: () => true }));

const pic = { src: "/images/home/hero.jpg", alt: "Team at work", width: 1600, height: 1000 };

describe("SectionRenderer", () => {
  it("renders sections in order with their themes", () => {
    const sections: Section[] = [
      { type: "stats", theme: "paper", head: { index: "S.01", label: "About us", statement: "Two decades of building." },
        items: [{ value: "20+", label: "Years", icon: "calendar" }, { value: "600+", label: "People", icon: "people" }] },
      { type: "cardGrid", theme: "tint", head: { index: "S.02", label: "What we do", statement: "Four ways we help." },
        cards: [{ title: "Product engineering", description: "Long-term co-creation.", icon: "layers" }, { title: "Web solutions", description: "Built and run end to end.", icon: "browser" }] },
      { type: "stickySplit", theme: "paper", head: { index: "S.03", label: "AI" }, image: pic, mediaSide: "left", heading: "Smarter teams", body: "Body." },
    ];
    const { container } = render(<SectionRenderer sections={sections} site={getSite()} />);
    const themes = Array.from(container.querySelectorAll("section")).map((s) => s.getAttribute("data-theme"));
    expect(themes).toEqual(["paper", "tint", "paper"]);
    expect(screen.getByText("Product engineering")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Smarter teams" })).toBeInTheDocument();
  });
});
```

```tsx
// tests/unit/sections/VideoLightbox.test.tsx
import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoLightbox } from "@/components/sections/VideoLightbox";

beforeAll(() => {
  // jsdom lacks dialog methods
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); this.dispatchEvent(new Event("close")); };
});

describe("VideoLightbox", () => {
  it("loads the iframe only after opening and removes it on close", async () => {
    const user = userEvent.setup();
    render(<VideoLightbox youtubeId="0O8WkFGaLw4" label="Watch: This is 99x" />);
    expect(document.querySelector("iframe")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Watch: This is 99x" }));
    const iframe = document.querySelector("iframe")!;
    expect(iframe.src).toContain("youtube-nocookie.com/embed/0O8WkFGaLw4");
    await user.click(screen.getByRole("button", { name: "Close video" }));
    expect(document.querySelector("iframe")).toBeNull();
  });
});
```

Run: `pnpm test tests/unit/sections` → FAIL.

- [ ] **Step 2: `SectionShell`**

```tsx
// src/components/sections/SectionShell.tsx
import type { SectionHead, Theme } from "@/content/schema";
import { SectionTag } from "@/components/ui/SectionTag";
import { ScrubText } from "@/components/motion/ScrubText";
import { cn } from "@/lib/cn";

const themeClass: Record<Theme, string> = {
  dark: "bg-ink text-paper",
  paper: "bg-paper text-ink",
  tint: "bg-tint text-ink",
};

type Props = {
  theme: Theme;
  head?: SectionHead;
  id?: string;
  className?: string;
  bottom?: "lg" | "md" | "none";
  children?: React.ReactNode;
};

export function SectionShell({ theme, head, id, className, bottom = "lg", children }: Props) {
  return (
    <section
      id={id}
      data-theme={theme}
      aria-label={head?.label}
      className={cn(
        "relative site-x pt-8",
        themeClass[theme],
        bottom === "lg" && "pb-40 lg:pb-64",
        bottom === "md" && "pb-32 lg:pb-48",
        className,
      )}
    >
      {head && (
        <div className="grid-12 mb-24 lg:mb-40">
          <div className="col-span-12 lg:col-span-8">
            <span className="float-left">
              <SectionTag index={head.index} label={head.label} tone={theme === "dark" ? "light" : "dark"} />
            </span>
            {head.statement && <ScrubText as="h2" className="text-statement" text={head.statement} />}
            {!head.statement && <h2 className="sr-only">{head.label}</h2>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
```

- [ ] **Step 3: `Hero` and `NextPage`**

```tsx
// src/components/sections/Hero.tsx
import Image from "next/image";
import type { Hero as HeroT } from "@/content/schema";
import { RevealLines } from "@/components/motion/RevealLines";
import { Parallax } from "@/components/motion/Parallax";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonSm } from "@/components/ui/ButtonSm";

export function Hero({ hero }: { hero: HeroT }) {
  return (
    <section data-theme="dark" className="relative flex h-svh min-h-[36em] flex-col justify-end overflow-hidden bg-ink text-paper site-x pb-8">
      <Parallax className="absolute inset-0" amount={8}>
        <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="100vw" className="object-cover" />
      </Parallax>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
      <div className="relative grid-12 items-end gap-y-10">
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-8">
          <Eyebrow className="text-paper/70">{hero.eyebrow}</Eyebrow>
          <RevealLines as="h1" lines={hero.lines} className="text-hero" waitForLoader />
        </div>
        <div className="col-span-12 flex flex-col items-start gap-8 lg:col-span-4 lg:items-end">
          {hero.metric && (
            <p className="flex flex-col gap-1 font-mono font-light uppercase lg:text-right">
              <span className="text-eyebrow-m text-paper/60">{hero.metric.label}</span>
              <span className="text-body-m">{hero.metric.value}</span>
            </p>
          )}
          {hero.cards && (
            <ul className="hidden gap-4 md:flex">
              {hero.cards.map((c) => (
                <li key={c.link.href} className="relative h-36 w-54 overflow-hidden rounded-[4px] border border-paper/20">
                  <Image src={c.image.src} alt="" fill sizes="216px" className="object-cover" />
                  <ButtonSm link={c.link} className="absolute bottom-2 left-2" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
```

```tsx
// src/components/sections/NextPage.tsx
import Image from "next/image";
import type { Page } from "@/content/schema";
import { Parallax } from "@/components/motion/Parallax";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { ButtonInner } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function NextPage({ next }: { next: Page["next"] }) {
  return (
    <section data-theme="dark" data-next-page aria-label={`Next: ${next.label}`} className="relative h-[150svh] bg-ink text-paper">
      <Parallax className="absolute inset-0" amount={10}>
        <Image src={next.image.src} alt="" fill sizes="100vw" className="object-cover" />
      </Parallax>
      <div aria-hidden="true" className="absolute inset-0 bg-ink/40" />
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center gap-6">
        <Eyebrow className="text-paper/70">{next.eyebrow}</Eyebrow>
        <TransitionLink href={next.href} variant="next" className="group/btn">
          <ButtonInner label={next.label} variant="next" size="xl" />
        </TransitionLink>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Content sections**

```tsx
// src/components/sections/StatsSection.tsx
import Image from "next/image";
import type { StatsSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Stat } from "@/components/ui/Stat";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/motion/FadeUp";

export function StatsSection({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div className="grid-12 gap-y-12">
        {s.image && (
          <div className="relative col-span-12 aspect-[4/5] overflow-hidden rounded-md md:col-span-6 lg:col-span-5">
            <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 992px) 35vw, 100vw" className="object-cover" />
          </div>
        )}
        <FadeUp className={s.image ? "col-span-12 grid grid-cols-2 content-start gap-x-4 gap-y-16 md:col-span-6 lg:col-span-6 lg:col-start-7" : "col-span-12 grid grid-cols-2 gap-x-4 gap-y-16 lg:grid-cols-4"}>
          {s.items.map((it) => <Stat key={it.label} {...it} />)}
        </FadeUp>
      </div>
      {(s.body || s.link) && (
        <div className="grid-12 mt-24">
          <div className="col-span-12 flex flex-col items-start gap-8 lg:col-span-4 lg:col-start-9">
            {s.body && <p className="text-body-m">{s.body}</p>}
            {s.link && <Button link={s.link} />}
          </div>
        </div>
      )}
    </SectionShell>
  );
}
```

```tsx
// src/components/sections/CardGrid.tsx
import Image from "next/image";
import type { CardGridSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { FadeUp } from "@/components/motion/FadeUp";

export function CardGrid({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <FadeUp className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {s.cards.map((c) => {
          const body = (
            <>
              <Icon name={c.icon} className="size-12" />
              <div className="flex flex-col gap-4">
                <h3 className="text-card">{c.title}</h3>
                <p className="text-body-s text-ink/70 lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-500 lg:ease-house lg:group-hover/card:max-h-40 lg:group-hover/card:opacity-100 lg:group-focus-within/card:max-h-40 lg:group-focus-within/card:opacity-100">
                  {c.description}
                </p>
              </div>
            </>
          );
          const cls = "group/card flex aspect-square flex-col justify-between rounded-md bg-paper p-8 text-ink transition-colors duration-500 ease-house hover:bg-accent focus-within:bg-accent";
          return (
            <div key={c.title} data-fade>
              {c.link ? <SmartLink link={{ ...c.link, label: c.title }} className={cls}>{body}</SmartLink> : <div className={cls}>{body}</div>}
            </div>
          );
        })}
        {s.photo && (
          <div data-fade className="relative aspect-square overflow-hidden rounded-md">
            <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(min-width: 992px) 33vw, 100vw" className="object-cover" />
          </div>
        )}
      </FadeUp>
      {s.link && <div className="mt-12 flex justify-end"><Button link={s.link} /></div>}
    </SectionShell>
  );
}
```

Note: cards with a `link` render the whole card as one link whose accessible name is the card title (`label: c.title`) — the description stays visible to screen readers (hidden only visually via max-height on desktop; it is still in the DOM).

```tsx
// src/components/sections/StickySplit.tsx
import Image from "next/image";
import type { StickySplitSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function StickySplit({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div className={cn("grid-12 gap-y-12 border-t border-ink/20 pt-8", s.theme === "dark" && "border-paper/20")}>
        <div className={cn("relative col-span-12 aspect-[4/5] overflow-hidden rounded-md lg:col-span-6", s.mediaSide === "right" && "lg:order-2 lg:col-start-7")}>
          <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 992px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className={cn("col-span-12 lg:col-span-4", s.mediaSide === "left" ? "lg:col-start-8" : "lg:col-start-2 lg:order-1")}>
          <div className="flex flex-col items-start gap-8 lg:sticky lg:top-[40svh]">
            <h3 className="text-h2">{s.heading}</h3>
            <p className="text-body-m opacity-70">{s.body}</p>
            {s.link && <Button link={s.link} variant={s.theme === "dark" ? "light" : "dark"} />}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
```

```tsx
// src/components/sections/NumberedList.tsx
"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import type { NumberedListSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Button } from "@/components/ui/Button";
import { TickRuler } from "@/components/ui/TickRuler";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

export function NumberedList({ section: s }: { section: T }) {
  const ref = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(() => {
    if (!ref.current || prefersReducedMotion()) return;
    ref.current.querySelectorAll("li").forEach((li) =>
      gsap.fromTo(li, { opacity: 0.2 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: li, start: "top 80%", end: "top 55%", scrub: true } }),
    );
    ScrollTrigger.create({ trigger: ref.current, start: "top 80%", end: "bottom 55%", onUpdate: (self) => setProgress(self.progress) });
  }, { scope: ref });

  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div className="grid-12 gap-y-12">
        {s.image && (
          <div className="col-span-12 lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md lg:sticky lg:top-24">
              <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 992px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
        )}
        <div className={s.image ? "col-span-12 lg:col-span-6 lg:col-start-7" : "col-span-12 lg:col-span-8 lg:col-start-5"}>
          <div className="mb-8 h-6 text-current"><TickRuler orientation="horizontal" count={48} progress={progress} /></div>
          <ol ref={ref} className="flex flex-col">
            {s.items.map((it, i) => (
              <li key={it.title} className="grid grid-cols-[calc(var(--u)*4)_1fr] gap-4 border-t border-current/20 py-8">
                <span className="font-mono text-eyebrow-m font-light">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-card">{it.title}</h3>
                  {it.description && <p className="text-body-s opacity-70">{it.description}</p>}
                </div>
              </li>
            ))}
          </ol>
          {s.link && <div className="mt-12"><Button link={s.link} variant={s.theme === "dark" ? "light" : "dark"} /></div>}
        </div>
      </div>
    </SectionShell>
  );
}
```

```tsx
// src/components/sections/DisplayLine.tsx
import type { DisplayLineSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { PillWipe } from "@/components/motion/PillWipe";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function DisplayLine({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div className="flex flex-col items-center gap-8 text-center">
        {s.fill === "pill" ? (
          <PillWipe text={s.text} />
        ) : (
          <p
            className="text-xxl bg-cover bg-center bg-clip-text text-transparent"
            style={{ backgroundImage: s.image ? `url(${s.image.src})` : undefined }}
          >
            {s.text}
          </p>
        )}
        {s.subline && <Eyebrow>{s.subline}</Eyebrow>}
        {s.body && <p className="mt-8 max-w-[42em] text-body-m">{s.body}</p>}
      </div>
    </SectionShell>
  );
}
```

(For `fill: "image"`, the image is decorative behind real text, so contrast relies on the photo: pick a dark, mid-contrast crop; if axe flags contrast, fall back to `text-ink` with the image as a narrow band under the line.)

```tsx
// src/components/sections/CaseCards.tsx
import Image from "next/image";
import type { CaseCardsSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { PillWipe } from "@/components/motion/PillWipe";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { FadeUp } from "@/components/motion/FadeUp";

export function CaseCards({ section: s }: { section: T }) {
  const cols = s.cards.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      {s.display && (
        <div className="mb-24 flex flex-col items-center gap-6 text-center">
          <PillWipe text={s.display.text} />
          <Eyebrow>{s.display.subline}</Eyebrow>
        </div>
      )}
      <FadeUp className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${cols}`}>
        {s.cards.map((c) => (
          <SmartLink key={c.link.href} link={{ ...c.link, label: c.title }} className="group/case flex flex-col gap-4">
            <div data-fade className="relative aspect-[179/220] overflow-hidden rounded-md bg-ink">
              <Image src={c.image.src} alt={c.image.alt} fill sizes="(min-width: 992px) 30vw, 100vw" className="object-cover transition-transform duration-700 ease-house group-hover/case:scale-105" />
              <Eyebrow size="s" className="absolute top-4 left-4 rounded-xs bg-paper px-2 py-1 text-ink">{c.tag}</Eyebrow>
            </div>
            <h3 className="text-body-m">{c.title}</h3>
          </SmartLink>
        ))}
      </FadeUp>
      {s.link && <div className="mt-16 flex justify-center"><Button link={s.link} /></div>}
    </SectionShell>
  );
}
```

```tsx
// src/components/sections/InsightCards.tsx
import Image from "next/image";
import type { InsightCardsSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { FadeUp } from "@/components/motion/FadeUp";

export function InsightCards({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <FadeUp className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {s.cards.map((c) => (
          <SmartLink key={c.link.href} link={{ ...c.link, label: c.title }} className="group/ins flex flex-col justify-between gap-8 rounded-md bg-tint p-6 md:aspect-[2/1] md:flex-row">
            <div data-fade className="flex flex-col justify-between gap-6">
              <Eyebrow size="s">{c.kind}</Eyebrow>
              <h3 className="text-body-m">{c.title}</h3>
            </div>
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-sm md:w-[40%]">
              <Image src={c.image.src} alt={c.image.alt} fill sizes="(min-width: 768px) 15vw, 100vw" className="object-cover transition-transform duration-700 ease-house group-hover/ins:scale-105" />
            </div>
          </SmartLink>
        ))}
      </FadeUp>
      {s.link && <div className="mt-12 flex justify-end"><Button link={s.link} /></div>}
    </SectionShell>
  );
}
```

```tsx
// src/components/sections/VideoLightbox.tsx
"use client";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function VideoLightbox({ youtubeId, label }: { youtubeId: string; label: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); dialog.current?.showModal(); }}
        className="group/play flex items-center gap-3 rounded-md bg-ink p-1 pr-4 text-paper"
      >
        <span className="grid size-8 place-items-center rounded-sm bg-accent text-ink transition-transform duration-500 ease-house group-hover/play:scale-110">
          <Icon name="play" className="size-4 fill-current" />
        </span>
        <span className="font-mono text-button font-light uppercase">{label}</span>
      </button>
      <dialog
        ref={dialog}
        aria-label={label}
        onClose={() => setOpen(false)}
        className="m-auto w-[min(92vw,calc(var(--u)*72))] bg-transparent p-0 backdrop:bg-ink/90"
      >
        <button type="button" onClick={() => dialog.current?.close()} className="absolute -top-14 right-0 grid size-12 place-items-center rounded-full bg-accent text-ink">
          <Icon name="close" />
          <span className="sr-only">Close video</span>
        </button>
        {open && (
          <iframe
            className="aspect-video w-full rounded-md"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={label}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </dialog>
    </>
  );
}
```

Note: the close button uses `sr-only` text "Close video"; its accessible name is exactly that (the icon is `aria-hidden`).

```tsx
// src/components/sections/MediaStatement.tsx
import Image from "next/image";
import type { MediaStatementSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { VideoLightbox } from "./VideoLightbox";
import { FadeUp } from "@/components/motion/FadeUp";

export function MediaStatement({ section: s }: { section: T }) {
  const [a, b] = s.images;
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <FadeUp className="grid-12 gap-y-12">
        <div data-fade className="relative col-span-12 aspect-[4/3] overflow-hidden rounded-md md:col-span-7">
          <Image src={a.src} alt={a.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
        </div>
        <div className="col-span-12 flex flex-col justify-end gap-8 md:col-span-4 md:col-start-9">
          <div data-fade className="relative aspect-[3/4] overflow-hidden rounded-md">
            <Image src={b.src} alt={b.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </div>
          <p className="text-body-m">{s.body}</p>
          {s.video && <VideoLightbox youtubeId={s.video.youtubeId} label={s.video.label} />}
        </div>
      </FadeUp>
    </SectionShell>
  );
}
```

```tsx
// src/components/sections/Tabs.tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import type { TabsSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Toggle } from "@/components/ui/Toggle";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Tabs({ section: s }: { section: T }) {
  const [i, setI] = useState(0);
  const prefix = s.id ?? "tabs";
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div className="grid-12 gap-y-8">
        <div className="col-span-12 flex flex-col gap-6 rounded-md bg-paper p-8 text-ink lg:col-span-5">
          <Toggle items={s.items.map((_, n) => String(n + 1).padStart(2, "0"))} value={i} onChange={setI} label={s.head.label} idPrefix={prefix} />
          {s.items.map((it, n) => (
            <div key={it.label} role="tabpanel" id={`${prefix}-panel-${n}`} aria-labelledby={`${prefix}-tab-${n}`} hidden={n !== i} className="flex flex-col gap-6">
              <Eyebrow>{it.label}</Eyebrow>
              <h3 className="text-h2">{it.heading}</h3>
              <p className="text-body-m text-ink/70">{it.body}</p>
            </div>
          ))}
        </div>
        <div className="relative col-span-12 aspect-[4/3] overflow-hidden rounded-md lg:col-span-7">
          {s.items.map((it, n) => (
            <Image key={it.image.src} src={it.image.src} alt={n === i ? it.image.alt : ""} fill sizes="(min-width: 992px) 58vw, 100vw"
              className="object-cover transition-opacity duration-700 ease-house" style={{ opacity: n === i ? 1 : 0 }} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 5: `SectionRenderer`** (sections from Tasks 9, 11, 12 are imported here as they land — create the file now with all imports; until those tasks are done, temporarily map their types to `null` and leave the `never` check in place)

```tsx
// src/components/sections/SectionRenderer.tsx
import type { Section, Site } from "@/content/schema";
import { StatsSection } from "./StatsSection";
import { CardGrid } from "./CardGrid";
import { StickySplit } from "./StickySplit";
import { NumberedList } from "./NumberedList";
import { DisplayLine } from "./DisplayLine";
import { CaseCards } from "./CaseCards";
import { InsightCards } from "./InsightCards";
import { MediaStatement } from "./MediaStatement";
import { Tabs } from "./Tabs";
import { ProofToggle } from "./ProofToggle";             // Task 9
import { NamesCylinder } from "./NamesCylinder";         // Task 9
import { Timeline } from "./Timeline";                   // Task 9
import { OfficeRows } from "./OfficeRows";               // Task 11
import { PeopleGrid } from "./PeopleGrid";               // Task 11
import { ContactBlock } from "./ContactBlock";           // Task 11
import { ContactMain } from "./ContactMain";             // Task 11
import { DivisionContacts } from "./DivisionContacts";   // Task 11
import { LogoStorySection } from "./LogoStorySection";   // Task 12

function render(s: Section, site: Site) {
  switch (s.type) {
    case "stats": return <StatsSection section={s} />;
    case "cardGrid": return <CardGrid section={s} />;
    case "stickySplit": return <StickySplit section={s} />;
    case "numberedList": return <NumberedList section={s} />;
    case "displayLine": return <DisplayLine section={s} />;
    case "caseCards": return <CaseCards section={s} />;
    case "insightCards": return <InsightCards section={s} />;
    case "mediaStatement": return <MediaStatement section={s} />;
    case "tabs": return <Tabs section={s} />;
    case "proofToggle": return <ProofToggle section={s} />;
    case "namesCylinder": return <NamesCylinder section={s} />;
    case "timeline": return <Timeline section={s} />;
    case "officeRows": return <OfficeRows section={s} offices={site.offices} />;
    case "peopleGrid": return <PeopleGrid section={s} />;
    case "contactBlock": return <ContactBlock section={s} />;
    case "contactMain": return <ContactMain section={s} offices={site.offices} />;
    case "divisionContacts": return <DivisionContacts section={s} />;
    case "logoStory": return <LogoStorySection section={s} offices={site.offices} />;
    default: {
      const exhaustive: never = s;
      return exhaustive;
    }
  }
}

export function SectionRenderer({ sections, site }: { sections: Section[]; site: Site }) {
  return <>{sections.map((s, i) => <div key={`${s.type}-${i}`} className="contents">{render(s, site)}</div>)}</>;
}
```

To keep this task green before Tasks 9/11/12 exist, create each of those 9 files now as a stub that returns `null` with the correct props signature, e.g.:

```tsx
// src/components/sections/ProofToggle.tsx (stub — replaced in Task 9)
import type { ProofToggleSection } from "@/content/schema";
export function ProofToggle(_: { section: ProofToggleSection }) { return null; }
```

Stubs needed: `ProofToggle`, `NamesCylinder`, `Timeline` (`{ section }`), `OfficeRows`, `ContactMain`, `LogoStorySection` (`{ section; offices: Office[] }`), `PeopleGrid`, `ContactBlock`, `DivisionContacts` (`{ section }`).

- [ ] **Step 6: Run tests**

Run: `pnpm test tests/unit/sections && pnpm typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(sections): section shell, renderer, hero, next-page and core content sections

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Pinned and interactive sections — proof toggle, names cylinder, timeline

**Files:**
- Replace stubs: `src/components/sections/{ProofToggle,NamesCylinder,Timeline}.tsx`
- Create: `src/lib/cylinder.ts`
- Test: `tests/unit/lib/cylinder.test.ts`, `tests/unit/sections/ProofToggle.test.tsx`

**Interfaces:**
- `src/lib/cylinder.ts`: `cylinderItem(i: number, focus: number, step = 18): { angle: number; opacity: number; visible: boolean }` — `angle = (i - focus) * step` degrees; `opacity = max(0.08, cos(angle))` for |angle| ≤ 90, else 0; `visible = |angle| <= 90`.
- `timelineIndex(progress: number, count: number): number` — clamps to `[0, count-1]`, `Math.min(count - 1, Math.floor(progress * count))`.

- [ ] **Step 1: Write failing tests**

```ts
// tests/unit/lib/cylinder.test.ts
import { describe, it, expect } from "vitest";
import { cylinderItem, timelineIndex } from "@/lib/cylinder";

describe("cylinderItem", () => {
  it("focused item faces the viewer at full opacity", () => {
    expect(cylinderItem(3, 3)).toEqual({ angle: 0, opacity: 1, visible: true });
  });
  it("items beyond 90° are hidden", () => {
    const r = cylinderItem(0, 10, 18);
    expect(r.visible).toBe(false);
    expect(r.opacity).toBe(0);
  });
  it("opacity never drops below 0.08 while visible", () => {
    const r = cylinderItem(0, 5, 18); // 90°
    expect(r.visible).toBe(true);
    expect(r.opacity).toBeCloseTo(0.08);
  });
});

describe("timelineIndex", () => {
  it("maps progress to index and clamps", () => {
    expect(timelineIndex(0, 7)).toBe(0);
    expect(timelineIndex(0.5, 7)).toBe(3);
    expect(timelineIndex(1, 7)).toBe(6);
    expect(timelineIndex(1.2, 7)).toBe(6);
    expect(timelineIndex(-1, 7)).toBe(0);
  });
});
```

```tsx
// tests/unit/sections/ProofToggle.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProofToggle } from "@/components/sections/ProofToggle";

const section = {
  type: "proofToggle" as const, theme: "paper" as const,
  head: { index: "S.06", label: "Why 99x" }, subline: "Why work with us",
  items: [{ value: "90%", text: "of clients say we met or exceeded expectations" }, { value: "100+", text: "companies transformed" }],
};

describe("ProofToggle", () => {
  it("shows one proof point at a time and switches via tabs", async () => {
    const user = userEvent.setup();
    render(<ProofToggle section={section} />);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("90%");
    await user.click(screen.getByRole("tab", { name: "02" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("100+");
  });
});
```

Run: `pnpm test tests/unit/lib/cylinder.test.ts tests/unit/sections/ProofToggle.test.tsx` → FAIL.

- [ ] **Step 2: Implement `src/lib/cylinder.ts`**

```ts
export function cylinderItem(i: number, focus: number, step = 18) {
  const angle = (i - focus) * step;
  const visible = Math.abs(angle) <= 90;
  const opacity = visible ? Math.max(0.08, Math.cos((angle * Math.PI) / 180)) : 0;
  return { angle: Object.is(angle, -0) ? 0 : angle, opacity: angle === 0 ? 1 : opacity, visible };
}

export function timelineIndex(progress: number, count: number) {
  return Math.max(0, Math.min(count - 1, Math.floor(progress * count)));
}
```

- [ ] **Step 3: Implement `ProofToggle`**

```tsx
// src/components/sections/ProofToggle.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import type { ProofToggleSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Toggle } from "@/components/ui/Toggle";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";

export function ProofToggle({ section: s }: { section: T }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const prefix = s.id ?? "proof";

  useEffect(() => {
    if (reduced || paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % s.items.length), 6000);
    return () => clearInterval(t);
  }, [reduced, paused, s.items.length]);

  useGSAP(() => {
    if (reduced || !panel.current) return;
    gsap.fromTo(panel.current.querySelectorAll("[data-line-inner]"), { yPercent: 100 }, { yPercent: 0, duration: 0.6, stagger: 0.05 });
  }, { dependencies: [i], scope: panel });

  const item = s.items[i];
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div
        className="flex flex-col items-center gap-12 text-center"
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}
      >
        <Eyebrow>{s.subline}</Eyebrow>
        <Toggle items={s.items.map((_, n) => String(n + 1).padStart(2, "0"))} value={i} onChange={setI} label={s.subline} idPrefix={prefix} tone="ink" />
        <div ref={panel} role="tabpanel" id={`${prefix}-panel-${i}`} aria-labelledby={`${prefix}-tab-${i}`} aria-live="polite" className="flex min-h-[2.2em] max-w-[57em] flex-col items-center gap-4 text-statement">
          <span className="mask-line"><span data-line-inner className="block text-xxl">{item.value}</span></span>
          <span className="mask-line"><span data-line-inner className="block">{item.text}</span></span>
        </div>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 4: Implement `NamesCylinder`**

```tsx
// src/components/sections/NamesCylinder.tsx
"use client";
import { useRef } from "react";
import type { NamesCylinderSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { TickRuler } from "@/components/ui/TickRuler";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { cylinderItem } from "@/lib/cylinder";

export function NamesCylinder({ section: s }: { section: T }) {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reduced || !stage.current) return;
    const items = Array.from(stage.current.querySelectorAll<HTMLElement>("[data-name]"));
    const apply = (focus: number) =>
      items.forEach((el, i) => {
        const { angle, opacity, visible } = cylinderItem(i, focus);
        gsap.set(el, { rotateX: -angle, z: "calc(var(--u) * 14)", opacity, visibility: visible ? "visible" : "hidden",
          transformOrigin: "50% 50% calc(var(--u) * -14)" });
      });
    apply(0);
    ScrollTrigger.create({
      trigger: stage.current,
      start: "top top",
      end: `+=${s.names.length * 15}%`,
      pin: true,
      scrub: true,
      onUpdate: (self) => apply(self.progress * (s.names.length - 1)),
    });
  }, { dependencies: [reduced], scope: stage });

  if (reduced) {
    return (
      <SectionShell theme={s.theme} head={s.head} id={s.id}>
        <ul className="columns-2 gap-4 text-h2 md:columns-3">
          {s.names.map((n) => <li key={n} className="break-inside-avoid py-1">{n}</li>)}
        </ul>
      </SectionShell>
    );
  }

  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id} bottom="md">
      <div ref={stage} className="relative h-svh">
        <div className="absolute inset-y-[15%] left-0 text-ink"><TickRuler count={40} /></div>
        <div className="absolute inset-y-[15%] right-0 flex text-ink [&>div]:items-end"><TickRuler count={40} /></div>
        <ul className="absolute inset-0 grid place-items-center [perspective:calc(var(--u)*60)] [transform-style:preserve-3d]">
          {s.names.map((n) => (
            <li key={n} data-name className="absolute text-center text-[calc(var(--u)*5)] leading-none tracking-[-0.025em] will-change-transform max-md:text-[calc(var(--u)*3)]">
              {n}
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
```

All names stay in the DOM in order, so screen readers read the full list regardless of the visual rotation.

- [ ] **Step 5: Implement `Timeline`**

```tsx
// src/components/sections/Timeline.tsx
"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import type { TimelineSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { timelineIndex } from "@/lib/cylinder";

export function Timeline({ section: s }: { section: T }) {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    if (reduced || !stage.current) return;
    ScrollTrigger.create({
      trigger: stage.current,
      start: "top top",
      end: `+=${s.items.length * 100}%`,
      pin: true,
      onUpdate: (self) => setActive(timelineIndex(self.progress, s.items.length)),
    });
  }, { dependencies: [reduced], scope: stage });

  useGSAP(() => {
    if (!stage.current) return;
    stage.current.querySelectorAll<HTMLElement>("[data-digit-col]").forEach((col) =>
      gsap.to(col, { yPercent: -100 * active, duration: reduced ? 0 : 0.8 }),
    );
  }, { dependencies: [active, reduced], scope: stage });

  if (reduced) {
    return (
      <SectionShell theme="dark" head={s.head} id={s.id}>
        <ol className="flex flex-col">
          {s.items.map((it) => (
            <li key={it.year + it.title} className="grid grid-cols-[calc(var(--u)*6)_1fr] gap-4 border-t border-paper/20 py-6">
              <span className="font-mono text-eyebrow-m font-light">{it.year}</span>
              <span className="text-body-m">{it.title}</span>
            </li>
          ))}
        </ol>
      </SectionShell>
    );
  }

  return (
    <SectionShell theme="dark" head={s.head} id={s.id} bottom="none">
      <div ref={stage} className="relative -mx-[var(--site-margin)] h-svh overflow-hidden">
        {s.items.map((it, i) => (
          <Image key={it.image.src} src={it.image.src} alt={i === active ? it.image.alt : ""} fill sizes="100vw"
            className="object-cover transition-opacity duration-700 ease-house" style={{ opacity: i === active ? 0.55 : 0 }} />
        ))}
        <div aria-hidden="true" className="absolute inset-0 grid grid-cols-4 items-center site-x text-[calc(var(--u)*14)] leading-none max-md:text-[calc(var(--u)*6)]">
          {[0, 1, 2, 3].map((pos) => (
            <div key={pos} className="h-[1em] overflow-hidden text-center">
              <div data-digit-col>
                {s.items.map((it) => <div key={it.year + pos + it.title} className="h-[1em]">{it.year[pos]}</div>)}
              </div>
            </div>
          ))}
        </div>
        <ol className="absolute inset-x-0 bottom-16 flex flex-col items-center text-center site-x">
          {s.items.map((it, i) => (
            <li key={it.year + it.title} className={i === active ? "block" : "sr-only"}>
              <span className="sr-only">{it.year}: </span>
              <span className="text-body-m">{it.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 6: Run tests and visual check**

Run: `pnpm test && pnpm typecheck`
Expected: PASS.

Add a temporary demo of each section to `/dev/kitchen-sink` (cylinder with 12 names, timeline with 3 items using any images from `public/images/about`), run `pnpm dev`, and compare with `_docs/reference/cominvi-shots/home-d-19.png`…`home-d-21.png` (cylinder) and the About timeline shots `about-d-05.png`…`about-d-08.png`. Resize the window from 1440 → 800 → 1440 while a pin is active: the pin must recover without overlap (Review Focus #3). If it doesn't, wrap the ScrollTrigger creation in `gsap.matchMedia()` contexts keyed on `(min-width: 992px)` / `(max-width: 991px)`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(sections): proof toggle, scroll-driven names cylinder and pinned timeline

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Contact backend — validation, rate limit, provider, route handler

**Files:**
- Create: `src/lib/contact/{schema,provider,rate-limit}.ts`, `src/app/api/contact/route.ts`
- Test: `tests/unit/contact/schema.test.ts`, `tests/unit/contact/rate-limit.test.ts`, `tests/unit/contact/route.test.ts`

**Interfaces:**
- `ContactSchema` (zod) fields: `name` (1–120), `email` (email, ≤200), `company` (≤120, optional), `phone` (≤40, optional), `message` (10–5000), `consent` (must be `true`; accepts `"on"`/`"true"`/`true`), `source` (≤40, default `"contact"`), `website` (honeypot, optional). `type ContactInput`.
- `parseContact(data: unknown): { ok: true; value: ContactInput } | { ok: false; errors: Record<string, string> }` — user-facing messages: name "Please tell us your name.", email "Enter a valid email address.", message "Tell us a bit more (at least 10 characters).", message too long "Keep it under 5,000 characters.", consent "Please accept the privacy policy.".
- `ContactProvider { send(msg: ContactInput & { receivedAt: string }): Promise<void> }`; `getProvider(): ContactProvider` (env `CONTACT_PROVIDER`, default `"log"`); `LogProvider`.
- `createRateLimiter({ limit, windowMs }): { hit(key: string, now?: number): boolean }` → `true` if allowed.
- `POST /api/contact` accepts `application/json` or `application/x-www-form-urlencoded`/`multipart/form-data`. Responses: JSON `{ ok: true }` 200; `{ ok: false, errors }` 400; `{ ok: false, error: "rate_limited" }` 429; `{ ok: false, error: "server" }` 502 if provider throws. For non-JS form posts (`Accept` lacks `application/json`), respond `303` redirect to `/contact?sent=1` (or `?error=1`).

- [ ] **Step 1: Write failing tests**

```ts
// tests/unit/contact/schema.test.ts
import { describe, it, expect } from "vitest";
import { parseContact } from "@/lib/contact/schema";

const valid = { name: "Ada", email: "ada@example.com", message: "We need a team of five engineers.", consent: "on" };

describe("parseContact", () => {
  it("accepts a valid submission", () => {
    const r = parseContact(valid);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.source).toBe("contact");
  });
  it("returns field errors with friendly messages", () => {
    const r = parseContact({ name: "", email: "nope", message: "short", consent: undefined });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.name).toBe("Please tell us your name.");
      expect(r.errors.email).toBe("Enter a valid email address.");
      expect(r.errors.message).toBe("Tell us a bit more (at least 10 characters).");
      expect(r.errors.consent).toBe("Please accept the privacy policy.");
    }
  });
  it("rejects messages over 5000 chars", () => {
    const r = parseContact({ ...valid, message: "x".repeat(5001) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.message).toBe("Keep it under 5,000 characters.");
  });
  it("rejects non-object input", () => {
    expect(parseContact(null).ok).toBe(false);
    expect(parseContact("hello").ok).toBe(false);
  });
});
```

```ts
// tests/unit/contact/rate-limit.test.ts
import { describe, it, expect } from "vitest";
import { createRateLimiter } from "@/lib/contact/rate-limit";

describe("rate limiter", () => {
  it("allows up to the limit within the window, then blocks, then resets", () => {
    const rl = createRateLimiter({ limit: 3, windowMs: 60_000 });
    expect(rl.hit("ip", 0)).toBe(true);
    expect(rl.hit("ip", 1)).toBe(true);
    expect(rl.hit("ip", 2)).toBe(true);
    expect(rl.hit("ip", 3)).toBe(false);
    expect(rl.hit("other", 3)).toBe(true);
    expect(rl.hit("ip", 60_001)).toBe(true);
  });
});
```

```ts
// tests/unit/contact/route.test.ts
// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const send = vi.fn();
vi.mock("@/lib/contact/provider", () => ({ getProvider: () => ({ send }) }));

const json = (body: unknown, ip = "1.1.1.1") =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const valid = { name: "Ada", email: "ada@example.com", message: "We need a team of five engineers.", consent: true };

describe("POST /api/contact", () => {
  beforeEach(() => { send.mockReset(); vi.resetModules(); });

  it("sends a valid message", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(json(valid));
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
  });

  it("returns 400 with field errors", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(json({ ...valid, email: "bad" }));
    expect(res.status).toBe(400);
    expect((await res.json()).errors.email).toBeDefined();
    expect(send).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without sending", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(json({ ...valid, website: "spam.example" }));
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed JSON", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(json("{not json"));
    expect(res.status).toBe(400);
  });

  it("rate limits after 5 requests per IP", async () => {
    const { POST } = await import("@/app/api/contact/route");
    for (let i = 0; i < 5; i++) expect((await POST(json(valid, "9.9.9.9"))).status).toBe(200);
    expect((await POST(json(valid, "9.9.9.9"))).status).toBe(429);
  });

  it("returns 502 when the provider fails", async () => {
    send.mockRejectedValueOnce(new Error("down"));
    const { POST } = await import("@/app/api/contact/route");
    expect((await POST(json(valid, "2.2.2.2"))).status).toBe(502);
  });

  it("redirects native form posts", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const body = new URLSearchParams({ name: "Ada", email: "ada@example.com", message: "We need a team of five engineers.", consent: "on" });
    const res = await POST(new Request("http://localhost/api/contact", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": "3.3.3.3" }, body,
    }));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toContain("/contact?sent=1");
  });
});
```

Run: `pnpm test tests/unit/contact` → FAIL.

- [ ] **Step 2: Implement `schema.ts`, `rate-limit.ts`, `provider.ts`**

```ts
// src/lib/contact/schema.ts
import { z } from "zod";

const truthy = z.union([z.literal(true), z.literal("true"), z.literal("on")]);

export const ContactSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name.").max(120, "That name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(200, "That email is too long."),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a bit more (at least 10 characters).")
    .max(5000, "Keep it under 5,000 characters."),
  consent: truthy,
  source: z.string().trim().max(40).default("contact"),
  website: z.string().optional(),
});
export type ContactInput = z.infer<typeof ContactSchema>;

const MESSAGES: Record<string, string> = { consent: "Please accept the privacy policy." };

export function parseContact(data: unknown): { ok: true; value: ContactInput } | { ok: false; errors: Record<string, string> } {
  if (typeof data !== "object" || data === null) return { ok: false, errors: { form: "Invalid submission." } };
  const r = ContactSchema.safeParse(data);
  if (r.success) return { ok: true, value: r.data };
  const errors: Record<string, string> = {};
  for (const issue of r.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = MESSAGES[key] ?? (issue.message.startsWith("Invalid") || issue.message.startsWith("Required") ? fallback(key) : issue.message);
  }
  return { ok: false, errors };
}

function fallback(key: string) {
  return ({ name: "Please tell us your name.", email: "Enter a valid email address.", message: "Tell us a bit more (at least 10 characters)." } as Record<string, string>)[key] ?? "Please check this field.";
}
```

```ts
// src/lib/contact/rate-limit.ts
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();
  return {
    hit(key: string, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) { hits.set(key, recent); return false; }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 5000) hits.clear(); // bound memory on long-lived instances
      return true;
    },
  };
}
```

```ts
// src/lib/contact/provider.ts
import type { ContactInput } from "./schema";

export type ContactMessage = ContactInput & { receivedAt: string };
export interface ContactProvider { send(msg: ContactMessage): Promise<void> }

class LogProvider implements ContactProvider {
  async send(msg: ContactMessage) {
    // Phase 1: no delivery target yet. Logs server-side only (Vercel function logs).
    console.info("[contact]", JSON.stringify({ ...msg, message: `${msg.message.slice(0, 200)}…` }));
  }
}

export function getProvider(): ContactProvider {
  switch (process.env.CONTACT_PROVIDER ?? "log") {
    case "log":
    default:
      return new LogProvider();
  }
}
```

- [ ] **Step 3: Implement the route**

```ts
// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { parseContact } from "@/lib/contact/schema";
import { getProvider } from "@/lib/contact/provider";
import { createRateLimiter } from "@/lib/contact/rate-limit";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

async function readBody(req: Request): Promise<unknown> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return req.json();
  const form = await req.formData();
  return Object.fromEntries(Array.from(form.entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""]));
}

export async function POST(req: Request) {
  const wantsJson = (req.headers.get("accept") ?? "").includes("application/json");
  const back = (q: string) => NextResponse.redirect(new URL(`/contact?${q}`, req.url), 303);
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";

  if (!limiter.hit(ip)) return wantsJson ? NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 }) : back("error=rate");

  let data: unknown;
  try { data = await readBody(req); } catch { return wantsJson ? NextResponse.json({ ok: false, errors: { form: "Invalid submission." } }, { status: 400 }) : back("error=1"); }

  const parsed = parseContact(data);
  if (!parsed.ok) return wantsJson ? NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 }) : back("error=1");

  if (parsed.value.website) return wantsJson ? NextResponse.json({ ok: true }) : back("sent=1"); // honeypot

  try {
    const { website: _hp, ...msg } = parsed.value;
    await getProvider().send({ ...msg, receivedAt: new Date().toISOString() });
  } catch (err) {
    console.error("[contact] provider failed", err);
    return wantsJson ? NextResponse.json({ ok: false, error: "server" }, { status: 502 }) : back("error=1");
  }
  return wantsJson ? NextResponse.json({ ok: true }) : back("sent=1");
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm test tests/unit/contact && pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(contact): validated contact route with honeypot, rate limit and pluggable provider

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Contact UI and people/office sections

**Files:**
- Create: `src/components/forms/ContactForm.tsx`
- Replace stubs: `src/components/sections/{ContactBlock,ContactMain,DivisionContacts,OfficeRows,PeopleGrid}.tsx`
- Create: `src/components/sections/WorldDotMap.tsx`, `src/lib/geo.ts`
- Test: `tests/unit/forms/ContactForm.test.tsx`, `tests/unit/lib/geo.test.ts`

**Interfaces:**
- `ContactForm({ source: string; compact?: boolean })` — posts to `/api/contact`; states `idle | submitting | success | error`.
- `src/lib/geo.ts`: `project(lat: number, lng: number, width: number, height: number): { x: number; y: number }` — equirectangular: `x = (lng + 180) / 360 * width`, `y = (90 - lat) / 180 * height`.
- `WorldDotMap({ offices: Office[]; active?: string })`.
- `OfficeRows({ section; offices })`, `ContactMain({ section; offices })`.

- [ ] **Step 1: Write failing tests**

```ts
// tests/unit/lib/geo.test.ts
import { describe, it, expect } from "vitest";
import { project } from "@/lib/geo";

describe("project", () => {
  it("maps lat/lng to an equirectangular canvas", () => {
    expect(project(0, 0, 360, 180)).toEqual({ x: 180, y: 90 });
    expect(project(90, -180, 360, 180)).toEqual({ x: 0, y: 0 });
    expect(project(-90, 180, 360, 180)).toEqual({ x: 360, y: 180 });
  });
});
```

```tsx
// tests/unit/forms/ContactForm.test.tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/forms/ContactForm";

afterEach(() => vi.restoreAllMocks());

async function fill(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Name/), "Ada");
  await user.type(screen.getByLabelText(/^Email/), "ada@example.com");
  await user.type(screen.getByLabelText(/^Message/), "We need a team of five engineers.");
  await user.click(screen.getByRole("checkbox"));
}

describe("ContactForm", () => {
  it("is a native form that posts to the API without JS", () => {
    const { container } = render(<ContactForm source="contact" />);
    const form = container.querySelector("form")!;
    expect(form).toHaveAttribute("action", "/api/contact");
    expect(form).toHaveAttribute("method", "post");
    expect(container.querySelector('input[name="website"]')).toHaveAttribute("tabindex", "-1");
  });

  it("shows server field errors and marks fields invalid", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ ok: false, errors: { email: "Enter a valid email address." } }), { status: 400 }));
    const user = userEvent.setup();
    render(<ContactForm source="contact" />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute("aria-invalid", "true");
  });

  it("replaces the form with a confirmation on success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const user = userEvent.setup();
    render(<ContactForm source="contact" />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByRole("status")).toHaveTextContent(/thanks/i);
  });

  it("shows a mailto fallback when the network fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    const user = userEvent.setup();
    render(<ContactForm source="contact" />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/hello.norway@99x.io/);
  });
});
```

Run: `pnpm test tests/unit/forms tests/unit/lib/geo.test.ts` → FAIL.

- [ ] **Step 2: Implement `geo.ts` and `ContactForm`**

```ts
// src/lib/geo.ts
export function project(lat: number, lng: number, width: number, height: number) {
  return { x: ((lng + 180) / 360) * width, y: ((90 - lat) / 180) * height };
}
```

```tsx
// src/components/forms/ContactForm.tsx
"use client";
import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { ButtonAction } from "@/components/ui/Button";

type State = { status: "idle" | "submitting" | "success" | "error"; errors: Record<string, string> };
const FALLBACK = "hello.norway@99x.io";

export function ContactForm({ source, compact = false }: { source: string; compact?: boolean }) {
  const [state, setState] = useState<State>({ status: "idle", errors: {} });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "submitting", errors: {} });
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ ...data, consent: data.consent === "on" }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Record<string, string> };
      if (res.ok && body.ok) return setState({ status: "success", errors: {} });
      if (res.status === 400 && body.errors) return setState({ status: "idle", errors: body.errors });
      setState({ status: "error", errors: {} });
    } catch {
      setState({ status: "error", errors: {} });
    }
  }

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col gap-4 border-t border-ink pt-8">
        <p className="text-h2">Thanks — we've got your message.</p>
        <p className="text-body-m text-ink/70">The right team will get back to you within two working days.</p>
      </div>
    );
  }

  const e = state.errors;
  return (
    <form action="/api/contact" method="post" onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <input type="hidden" name="source" value={source} />
      {/* Honeypot: hidden from people, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <Field name="name" label="Name" required autoComplete="name" error={e.name} maxLength={120} />
      <Field name="email" type="email" label="Email" required autoComplete="email" error={e.email} maxLength={200} />
      {!compact && <Field name="company" label="Company" autoComplete="organization" maxLength={120} />}
      <Field name="phone" type="tel" label="Phone" hint="Optional" autoComplete="tel" maxLength={40} />
      <Field name="message" type="textarea" label="Message" hint="What are you building, and how can we help?" required error={e.message} maxLength={5000} />
      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 text-body-s">
          <input type="checkbox" name="consent" required aria-invalid={e.consent ? true : undefined} aria-describedby={e.consent ? "f-consent-err" : undefined} className="mt-0.5 size-5 accent-[var(--color-accent-deep)]" />
          <span>I have read and accept the <a href="https://99x.io/compliance/privacy-policy" rel="noopener" className="underline underline-offset-2">privacy policy</a>.</span>
        </label>
        {e.consent && <p id="f-consent-err" className="font-mono text-eyebrow-m font-light uppercase text-logo-red">{e.consent}</p>}
      </div>
      {state.status === "error" && (
        <p role="alert" className="text-body-s text-logo-red">
          Something went wrong on our side. Please try again, or email us at <a className="underline" href={`mailto:${FALLBACK}`}>{FALLBACK}</a>.
        </p>
      )}
      <div aria-live="polite" className="sr-only">{Object.keys(e).length ? `${Object.keys(e).length} fields need attention.` : ""}</div>
      <ButtonAction type="submit" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Sending…" : "Send"}
      </ButtonAction>
    </form>
  );
}
```

Note: `Field`'s label for Name renders "Name *" visually with the asterisk `aria-hidden`, so `getByLabelText(/^Name/)` matches.

- [ ] **Step 3: `WorldDotMap`**

```tsx
// src/components/sections/WorldDotMap.tsx
import type { Office } from "@/content/schema";
import { project } from "@/lib/geo";

// Coarse land mask: rows of [startLng, endLng] spans per 6° latitude band (north → south), enough for a dot-matrix silhouette.
const LAND: Record<number, [number, number][]> = {
  72: [[-60, -20], [20, 140]], 66: [[-165, -60], [-50, -20], [10, 180]], 60: [[-165, -60], [-45, -40], [5, 180]],
  54: [[-130, -60], [-10, 160]], 48: [[-125, -55], [-5, 145]], 42: [[-125, -70], [-9, 140]], 36: [[-122, -76], [-8, 140]],
  30: [[-115, -80], [-10, 120]], 24: [[-110, -80], [-16, 120]], 18: [[-105, -88], [-17, 110]], 12: [[-90, -60], [-17, 50], [75, 110]],
  6: [[-80, -50], [-10, 45], [95, 120]], 0: [[-80, -48], [8, 42], [100, 140]], [-6]: [[-80, -35], [12, 40], [105, 150]],
  [-12]: [[-77, -38], [13, 40], [125, 145]], [-18]: [[-72, -39], [12, 50], [120, 148]], [-24]: [[-70, -42], [14, 35], [114, 152]],
  [-30]: [[-72, -50], [17, 31], [115, 153]], [-36]: [[-73, -57], [140, 150], [172, 178]], [-42]: [[-74, -63], [145, 148], [170, 175]],
  [-48]: [[-75, -66]],
} as Record<number, [number, number][]>;

const W = 360, H = 170, STEP = 3;

export function WorldDotMap({ offices, active }: { offices: Office[]; active?: string }) {
  const dots: { x: number; y: number }[] = [];
  for (const [latStr, spans] of Object.entries(LAND)) {
    const lat = Number(latStr);
    for (const [a, b] of spans) for (let lng = a; lng <= b; lng += STEP) for (let dLat = 0; dLat < 6; dLat += STEP) {
      const p = project(lat - dLat, lng, W, H * (180 / 170));
      dots.push(p);
    }
  }
  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-ink" role="img" aria-label={`Map of 99x offices: ${offices.map((o) => `${o.city}, ${o.country}`).join("; ")}`}>
        {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={0.7} className="fill-current opacity-20" />)}
        {offices.map((o) => {
          const p = project(o.lat, o.lng, W, H * (180 / 170));
          const on = active === o.id;
          return (
            <g key={o.id}>
              <circle cx={p.x} cy={p.y} r={on ? 5 : 3.5} className="fill-accent/40" />
              <circle cx={p.x} cy={p.y} r={1.8} className="fill-accent-deep" />
              <text x={p.x + 5} y={p.y + 1.5} className="fill-current font-mono text-[5px] uppercase">{o.city}</text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
```

(Visually check the silhouette at `/contact` in Task 17; adjust spans if a continent reads wrong. It is decorative-plus-labelled; the offices also appear as text rows.)

- [ ] **Step 4: People, offices and contact sections**

```tsx
// src/components/sections/PeopleGrid.tsx
import Image from "next/image";
import type { PeopleGridSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeUp } from "@/components/motion/FadeUp";

export function PeopleGrid({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <FadeUp className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {s.people.map((p) => (
          <figure key={p.name} data-fade className="flex flex-col gap-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-tint">
              {p.photo && <Image src={p.photo.src} alt={p.photo.alt} fill sizes="(min-width: 992px) 25vw, 50vw" className="object-cover grayscale transition duration-700 ease-house hover:grayscale-0" />}
            </div>
            <figcaption className="flex flex-col gap-2">
              <span className="text-body-m">{p.name}</span>
              <Eyebrow size="s" className="opacity-60">{p.role}</Eyebrow>
            </figcaption>
          </figure>
        ))}
      </FadeUp>
    </SectionShell>
  );
}
```

```tsx
// src/components/sections/OfficeRows.tsx
import type { Office, OfficeRowsSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function OfficeRows({ section: s, offices }: { section: T; offices: Office[] }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      {s.body && <p className="mb-16 max-w-[42em] text-body-m">{s.body}</p>}
      <ol className="flex flex-col">
        {offices.map((o, i) => (
          <li key={o.id} className="grid grid-cols-12 items-baseline gap-4 border-t border-current/20 py-6 last:border-b">
            <Eyebrow as="span" className="col-span-2 md:col-span-1">{String(i + 1).padStart(2, "0")}</Eyebrow>
            <span className="col-span-10 text-h2 md:col-span-4">{o.city}</span>
            <Eyebrow as="span" className="col-span-10 col-start-3 opacity-60 md:col-span-2 md:col-start-auto">{o.country}</Eyebrow>
            <address className="col-span-10 col-start-3 not-italic text-body-s opacity-70 md:col-span-3 md:col-start-auto">{o.address}</address>
            <a href={`mailto:${o.email}`} className="col-span-10 col-start-3 text-body-s underline-offset-4 hover:underline md:col-span-2 md:col-start-auto md:text-right">{o.email}</a>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
```

```tsx
// src/components/sections/ContactBlock.tsx
import Image from "next/image";
import type { ContactBlockSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { ContactForm } from "@/components/forms/ContactForm";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function ContactBlock({ section: s }: { section: T }) {
  const p = s.person;
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <div className="grid-12 gap-y-12">
        <div className="col-span-12 flex flex-col gap-6 md:col-span-5 lg:col-span-4">
          {p.photo && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-md">
              <Image src={p.photo.src} alt={p.photo.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <p className="text-h2">{p.name}</p>
            <Eyebrow className="opacity-60">{p.role}</Eyebrow>
            {p.email && <a href={`mailto:${p.email}`} className="text-body-m underline-offset-4 hover:underline">{p.email}</a>}
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <ContactForm source={s.source} compact />
        </div>
      </div>
    </SectionShell>
  );
}
```

```tsx
// src/components/sections/ContactMain.tsx
import type { ContactMainSection as T, Office } from "@/content/schema";
import { ContactForm } from "@/components/forms/ContactForm";
import { WorldDotMap } from "./WorldDotMap";
import { RevealLines } from "@/components/motion/RevealLines";
import { cn } from "@/lib/cn";

export function ContactMain({ section: s, offices }: { section: T; offices: Office[] }) {
  return (
    <section data-theme={s.theme} id={s.id} className={cn("site-x pt-32 pb-40 lg:pb-64", s.theme === "tint" ? "bg-tint" : "bg-paper")}>
      <div className="grid-12 gap-y-16">
        <div className="col-span-12 lg:col-span-6">
          <div className="lg:sticky lg:top-32"><WorldDotMap offices={offices} /></div>
        </div>
        <div className="col-span-12 flex flex-col gap-12 lg:col-span-5 lg:col-start-8 lg:max-w-[28em]">
          <RevealLines as="h1" lines={[s.heading]} className="text-statement" waitForLoader />
          <p className="text-body-m text-ink/70">{s.intro}</p>
          <ContactForm source={s.source} />
        </div>
      </div>
    </section>
  );
}
```

The `?sent=1` / `?error=1` query from no-JS posts: in `ContactMain`, read nothing server-side (the page is static). Instead add to `ContactForm` a `useEffect` that reads `new URLSearchParams(location.search)` once: `sent=1` → `success`, `error` → `error`. Add this test to `ContactForm.test.tsx`:

```tsx
it("shows success after a no-JS redirect with ?sent=1", () => {
  window.history.replaceState({}, "", "/contact?sent=1");
  render(<ContactForm source="contact" />);
  expect(screen.getByRole("status")).toHaveTextContent(/thanks/i);
  window.history.replaceState({}, "", "/");
});
```

and the implementation inside `ContactForm` (in an effect, so server and client render the same initial HTML):

```tsx
useEffect(() => {
  const q = new URLSearchParams(window.location.search);
  if (q.get("sent") === "1") setState({ status: "success", errors: {} });
  else if (q.get("error")) setState({ status: "error", errors: {} });
}, []);
```

(import `useEffect` alongside `useState`; the test passes because RTL's `render` flushes effects.)

(For no-JS visitors the static page shows the form again; the redirect is still useful because the message *was* sent — acceptable for phase 1.)

```tsx
// src/components/sections/DivisionContacts.tsx
import Image from "next/image";
import type { DivisionContactsSection as T } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/motion/FadeUp";

export function DivisionContacts({ section: s }: { section: T }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id}>
      <FadeUp className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {s.divisions.map((d) => (
          <a key={d.email} data-fade href={`mailto:${d.email}`} className="group/div flex aspect-square flex-col justify-between rounded-md bg-paper p-8 text-ink transition-colors duration-500 ease-house hover:bg-accent focus-visible:bg-accent">
            <Eyebrow>{d.label}</Eyebrow>
            <div className="flex flex-col gap-4">
              <p className="text-card">{d.heading}</p>
              <span className="text-body-s underline-offset-4 group-hover/div:underline">{d.email}</span>
            </div>
          </a>
        ))}
      </FadeUp>
      <ul className="mt-32 grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-2 lg:grid-cols-5">
        {s.people.map((p) => (
          <li key={p.name} className="flex flex-col gap-3">
            {p.photo && <div className="relative aspect-square w-24 overflow-hidden rounded-md"><Image src={p.photo.src} alt={p.photo.alt} fill sizes="96px" className="object-cover" /></div>}
            <span className="text-body-m">{p.name}</span>
            <Eyebrow size="s" className="opacity-60">{p.role}</Eyebrow>
            {p.email && <a href={`mailto:${p.email}`} className="text-body-s underline-offset-4 hover:underline">{p.email}</a>}
            {p.phone && <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="text-body-s underline-offset-4 hover:underline">{p.phone}</a>}
          </li>
        ))}
      </ul>
      <div className="mt-32 grid-12 border-t border-current/20 pt-8">
        <p className="col-span-12 text-h2 md:col-span-5">{s.internships.heading}</p>
        <div className="col-span-12 mt-6 flex flex-col items-start gap-6 md:col-span-4 md:col-start-9 md:mt-0">
          <p className="text-body-m opacity-70">{s.internships.body}</p>
          <Button link={{ label: "Email us", href: `mailto:${s.internships.email}` }} />
        </div>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 5: Run tests**

Run: `pnpm test && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(contact): contact form, contact/people/office sections and dot-matrix map

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: 3D logo story

**Files:**
- Create: `src/components/three/{logoGeometry.ts,storyMath.ts,LogoScene.tsx,LogoStory.tsx,StaticLogoFallback.tsx}`
- Replace stub: `src/components/sections/LogoStorySection.tsx`
- Test: `tests/unit/three/logoGeometry.test.ts`, `tests/unit/three/storyMath.test.ts`

**Interfaces:**
- `logoGeometry.ts`:
  - `PIECE_GROUPS: readonly (readonly string[])[]` = `[["Vector_2","Vector_4"], ["Vector_3","Vector_6"], ["Vector"], ["Vector_8"], ["Vector_9"]]` — first "9", second "9", the long x-stroke, the upper-right x-stroke, the lower-left x-stroke. `Vector_5` / `Vector_7` are duplicate paths in the source SVG and are ignored.
  - `PIECE_COLORS = ["#A2B372", "#C49FD5", "#CCB189", "#B44B4B", "#7A6977"]` (per piece, taken from its first path).
  - `buildPieces(svgText: string): { id: number; color: string; geometry: THREE.BufferGeometry; center: THREE.Vector3 }[]` — length 5; geometry extruded, merged per piece, Y flipped, centred on the whole logo's centre (37, 19), scaled to logo width 1 unit = 1/74.
- `storyMath.ts`:
  - `STEP_START = 0.1`, `STEP_END = 0.9`.
  - `storyStep(progress: number, count: number): { active: number; local: number; phase: "intro" | "steps" | "outro" }` — `active` in `[0, count-1]` (`-1` during intro/outro).
  - `pieceTarget(i: number, progress: number, count: number): { pos: [number, number, number]; rot: [number, number, number]; dim: number }` — `[0,0,0]`/`[0,0,0]`/`0` at `progress ≤ 0` and `≥ 1`; during steps the active piece moves to `[0, 0, 0.6]` facing forward with `rot[1] = local * Math.PI * 2 * 0.25`, others pushed outward along their own direction from logo centre by `0.45` and `dim = 0.6`.
- `LogoStory({ offices: Office[] })` — client component; pinned stage with list/canvas/data.
- `LogoStorySection({ section; offices })` — server wrapper with `SectionShell`.

- [ ] **Step 1: Write failing tests**

```ts
// tests/unit/three/logoGeometry.test.ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { buildPieces, PIECE_COLORS } from "@/components/three/logoGeometry";

const svg = readFileSync(path.join(process.cwd(), "public/brand/99x-logo.svg"), "utf8");

describe("buildPieces", () => {
  const pieces = buildPieces(svg);
  it("builds exactly 5 pieces in brand colours", () => {
    expect(pieces).toHaveLength(5);
    expect(pieces.map((p) => p.color.toUpperCase())).toEqual(PIECE_COLORS);
  });
  it("every piece has non-empty geometry", () => {
    for (const p of pieces) expect(p.geometry.getAttribute("position").count).toBeGreaterThan(0);
  });
  it("the logo is centred around the origin", () => {
    const xs = pieces.map((p) => p.center.x);
    expect(Math.min(...xs)).toBeLessThan(0);
    expect(Math.max(...xs)).toBeGreaterThan(0);
  });
});
```

```ts
// tests/unit/three/storyMath.test.ts
import { describe, it, expect } from "vitest";
import { storyStep, pieceTarget } from "@/components/three/storyMath";

describe("storyStep", () => {
  it("has intro, 5 steps and outro", () => {
    expect(storyStep(0.05, 5).phase).toBe("intro");
    expect(storyStep(0.11, 5)).toMatchObject({ phase: "steps", active: 0 });
    expect(storyStep(0.5, 5)).toMatchObject({ phase: "steps", active: 2 });
    expect(storyStep(0.89, 5)).toMatchObject({ phase: "steps", active: 4 });
    expect(storyStep(0.95, 5).phase).toBe("outro");
  });
});

describe("pieceTarget", () => {
  it("is assembled at the start and the end", () => {
    for (const p of [0, 1]) for (let i = 0; i < 5; i++) {
      expect(pieceTarget(i, p, 5)).toEqual({ pos: [0, 0, 0], rot: [0, 0, 0], dim: 0 });
    }
  });
  it("brings the active piece forward and dims the others", () => {
    const mid = 0.1 + (0.8 / 5) * 2.5; // middle of step 2
    const active = pieceTarget(2, mid, 5);
    const other = pieceTarget(0, mid, 5);
    expect(active.pos[2]).toBeCloseTo(0.6);
    expect(active.dim).toBe(0);
    expect(other.dim).toBeCloseTo(0.6);
  });
});
```

Run: `pnpm test tests/unit/three` → FAIL.

- [ ] **Step 2: Implement `storyMath.ts`**

```ts
// src/components/three/storyMath.ts
export const STEP_START = 0.1;
export const STEP_END = 0.9;

// Unit directions from logo centre for each piece (first 9 left, second 9 centre-up, x strokes right).
const OUTWARD: [number, number][] = [[-1, 0.3], [-0.2, 1], [1, -0.2], [0.8, 0.8], [0.4, -1]];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function storyStep(progress: number, count: number) {
  if (progress < STEP_START) return { active: -1, local: 0, phase: "intro" as const };
  if (progress >= STEP_END) return { active: -1, local: 0, phase: "outro" as const };
  const t = (progress - STEP_START) / (STEP_END - STEP_START);
  const f = t * count;
  const active = Math.min(count - 1, Math.floor(f));
  return { active, local: f - active, phase: "steps" as const };
}

export function pieceTarget(i: number, progress: number, count: number) {
  if (progress <= 0 || progress >= 1) return { pos: [0, 0, 0] as [number, number, number], rot: [0, 0, 0] as [number, number, number], dim: 0 };
  // Explode amount ramps in during intro and out during outro.
  const explode =
    progress < STEP_START ? ease(progress / STEP_START) : progress >= STEP_END ? 1 - ease((progress - STEP_END) / (1 - STEP_END)) : 1;
  const { active, local, phase } = storyStep(progress, count);
  const [dx, dy] = OUTWARD[i % OUTWARD.length];
  if (phase === "steps" && i === active) {
    // Ease forward during the first 20% of the step, hold, ease back during the last 20%.
    const focus = smoothstep(0, 0.2, local) * (1 - smoothstep(0.8, 1, local));
    return { pos: [0, 0, 0.6 * focus] as [number, number, number], rot: [0, local * Math.PI * 2 * 0.25, 0] as [number, number, number], dim: 0 };
  }
  return {
    pos: [dx * 0.45 * explode, dy * 0.45 * explode, -0.1 * explode] as [number, number, number],
    rot: [0.15 * explode * dy, 0.25 * explode * dx, 0] as [number, number, number],
    dim: phase === "steps" ? 0.6 : 0.6 * explode,
  };
}
```

- [ ] **Step 3: Implement `logoGeometry.ts`**

```ts
// src/components/three/logoGeometry.ts
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const PIECE_GROUPS = [["Vector_2", "Vector_4"], ["Vector_3", "Vector_6"], ["Vector"], ["Vector_8"], ["Vector_9"]] as const;
export const PIECE_COLORS = ["#A2B372", "#C49FD5", "#CCB189", "#B44B4B", "#7A6977"];

const LOGO_W = 74, LOGO_H = 38;

export function buildPieces(svgText: string) {
  const data = new SVGLoader().parse(svgText);
  const byId = new Map<string, (typeof data.paths)[number]>();
  for (const p of data.paths) {
    const id = (p.userData?.node as Element | undefined)?.getAttribute("id");
    if (id && !byId.has(id)) byId.set(id, p);
  }
  return PIECE_GROUPS.map((ids, idx) => {
    const geoms = ids.map((id) => {
      const path = byId.get(id);
      if (!path) throw new Error(`Logo path not found: ${id}`);
      const shapes = SVGLoader.createShapes(path);
      return new THREE.ExtrudeGeometry(shapes, { depth: 3, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.35, bevelSegments: 3, curveSegments: 24 });
    });
    const merged = mergeGeometries(geoms, false)!;
    // SVG y grows down; flip, centre on the logo, normalise to ~1 unit wide.
    merged.translate(-LOGO_W / 2, -LOGO_H / 2, -1.5);
    merged.scale(1 / LOGO_W, -1 / LOGO_W, 1 / LOGO_W);
    merged.computeVertexNormals();
    merged.computeBoundingBox();
    const center = new THREE.Vector3();
    merged.boundingBox!.getCenter(center);
    return { id: idx, color: PIECE_COLORS[idx], geometry: merged, center };
  });
}
```

Note: flipping Y with a negative scale inverts face winding — set `side: THREE.DoubleSide` on materials in `LogoScene`, or after scaling call `merged.index` reversal; DoubleSide is the simpler, correct choice here.

Run: `pnpm test tests/unit/three` → PASS (jsdom provides `DOMParser` for `SVGLoader`).

- [ ] **Step 4: Implement `LogoScene.tsx`**

```tsx
// src/components/three/LogoScene.tsx
"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildPieces } from "./logoGeometry";
import { pieceTarget } from "./storyMath";

type Props = { svgText: string; progress: React.RefObject<number>; pointer: boolean };

function Pieces({ svgText, progress, pointer }: Props) {
  const pieces = useMemo(() => buildPieces(svgText), [svgText]);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const group = useRef<THREE.Group>(null);
  const { invalidate } = useThree();

  useFrame((state, delta) => {
    const p = progress.current ?? 0;
    let moving = false;
    pieces.forEach((piece, i) => {
      const m = refs.current[i];
      if (!m) return;
      const t = pieceTarget(i, p, pieces.length);
      const k = 1 - Math.pow(0.0001, delta); // frame-rate independent damping
      const before = m.position.clone();
      m.position.lerp(new THREE.Vector3(...t.pos), k);
      m.rotation.x += (t.rot[0] - m.rotation.x) * k;
      m.rotation.y += (t.rot[1] - m.rotation.y) * k;
      const mat = m.material as THREE.MeshPhysicalMaterial;
      mat.opacity += (1 - t.dim - mat.opacity) * k;
      if (before.distanceToSquared(m.position) > 1e-8) moving = true;
    });
    if (pointer && group.current) {
      group.current.rotation.y += (state.pointer.x * 0.1 - group.current.rotation.y) * 0.08;
      group.current.rotation.x += (-state.pointer.y * 0.1 - group.current.rotation.x) * 0.08;
      moving = true;
    }
    if (moving) invalidate();
  });

  return (
    <group ref={group} scale={2.4}>
      {pieces.map((piece, i) => (
        <mesh key={piece.id} ref={(el) => { refs.current[i] = el; }} geometry={piece.geometry}>
          <meshPhysicalMaterial color={piece.color} roughness={0.45} clearcoat={0.3} metalness={0.05} side={THREE.DoubleSide} transparent opacity={1} />
        </mesh>
      ))}
    </group>
  );
}

function Invalidator({ progress }: { progress: React.RefObject<number> }) {
  const { invalidate } = useThree();
  useEffect(() => {
    let last = -1, raf = 0;
    const loop = () => { if (progress.current !== last) { last = progress.current ?? 0; invalidate(); } raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [invalidate, progress]);
  return null;
}

export default function LogoScene(props: Props) {
  const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  return (
    <Canvas frameloop="demand" dpr={[1, mobile ? 1.5 : 1.75]} camera={{ position: [0, 0, 3.2], fov: 35 }} gl={{ antialias: true, alpha: true }} aria-hidden="true">
      <Environment resolution={256}>
        <Lightformer intensity={2} position={[0, 2, 3]} scale={[6, 2, 1]} />
        <Lightformer intensity={1} position={[-3, 0, 1]} scale={[2, 4, 1]} />
        <Lightformer intensity={0.6} position={[3, -1, 2]} scale={[2, 2, 1]} color="#c49fd5" />
      </Environment>
      <ambientLight intensity={0.4} />
      <Pieces {...props} />
      <Invalidator progress={props.progress} />
    </Canvas>
  );
}
```

No remote HDR: `Environment` with only `Lightformer` children builds the environment locally.

- [ ] **Step 5: Implement `StaticLogoFallback.tsx` (no raster needed)**

```tsx
// src/components/three/StaticLogoFallback.tsx
// Exploded 2D logo built from the same SVG paths — used for reduced motion / no WebGL / before the 3D chunk loads.
const PARTS: { d: string; fill: string; dx: number; dy: number }[] = [
  { fill: "#A2B372", dx: -10, dy: 2, d: "M10.551 22.0507C16.2876 22.0507 21.0509 17.0197 21.0509 10.9718C21.0509 4.92394 16.2876 0 10.551 0C4.71212 0 0 4.92394 0 10.9718C0 17.0732 4.71212 22.0507 10.551 22.0507ZM2.40728 10.9183C2.40728 15.6817 6.09502 19.6423 10.551 19.6423C15.0071 19.6423 18.6437 15.6817 18.6437 10.9183C18.6437 6.26197 14.9559 2.40845 10.551 2.40845C5.99259 2.40845 2.40728 6.15493 2.40728 10.9183Z M9.6796 37.9999L19.5648 23.8703L17.5673 22.2646L7.63086 36.2872L9.6796 37.9999Z" },
  { fill: "#C49FD5", dx: -2, dy: -8, d: "M36.7093 22.0507C42.4458 22.0507 47.2091 17.0197 47.2091 10.9718C47.2091 4.92394 42.4458 0 36.7093 0C30.8703 0 26.1582 4.92394 26.1582 10.9718C26.1582 17.0732 30.8703 22.0507 36.7093 22.0507ZM28.5655 10.9183C28.5655 15.6817 32.2532 19.6423 36.7093 19.6423C41.1653 19.6423 44.8019 15.6817 44.8019 10.9183C44.8019 6.26197 41.1141 2.40845 36.7093 2.40845C32.1508 2.40845 28.5655 6.15493 28.5655 10.9183Z M35.8378 37.9999L45.723 23.8703L43.7255 22.2646L33.7891 36.2872L35.8378 37.9999Z" },
  { fill: "#CCB189", dx: 8, dy: 3, d: "M71.4494 37.9998L73.242 36.5012L54.1886 11.2393L52.3447 12.7378L71.4494 37.9998Z" },
  { fill: "#B44B4B", dx: 10, dy: -8, d: "M72.5263 12.7378L65.3557 22.3181L63.6143 20.659L70.6824 11.2393L72.5263 12.7378Z" },
  { fill: "#7A6977", dx: 4, dy: 9, d: "M53.4216 38.0003L61.3604 27.5636L59.5678 25.958L51.6289 36.5017L53.4216 38.0003Z" },
];

export function StaticLogoFallback({ active = -1 }: { active?: number }) {
  return (
    <svg viewBox="-16 -14 106 66" className="h-full w-full" aria-hidden="true">
      {PARTS.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill} fillRule="evenodd" transform={`translate(${p.dx} ${p.dy})`} opacity={active === -1 || active === i ? 1 : 0.35} style={{ transition: "opacity .6s" }} />
      ))}
    </svg>
  );
}
```

- [ ] **Step 6: Implement `LogoStory.tsx` and `LogoStorySection.tsx`**

```tsx
// src/components/three/LogoStory.tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Office } from "@/content/schema";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TickRuler } from "@/components/ui/TickRuler";
import { StaticLogoFallback } from "./StaticLogoFallback";
import { storyStep } from "./storyMath";
import { cn } from "@/lib/cn";

const LogoScene = dynamic(() => import("./LogoScene"), { ssr: false });

const hasWebGL = () => {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
};
const fmt = (n: number, pos: string, neg: string) => `${Math.abs(n).toFixed(2)}°${n >= 0 ? pos : neg}`;

export function LogoStory({ offices }: { offices: Office[] }) {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(-1);
  const [p, setP] = useState(0);
  const [load3d, setLoad3d] = useState(false);
  const [svg, setSvg] = useState<string | null>(null);

  // Load the 3D chunk ~1.5 screens before the section.
  useEffect(() => {
    if (reduced || !stage.current || !hasWebGL()) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLoad3d(true); io.disconnect(); } }, { rootMargin: "150% 0px" });
    io.observe(stage.current);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!load3d) return;
    fetch("/brand/99x-logo.svg").then((r) => r.text()).then(setSvg).catch(() => setLoad3d(false));
  }, [load3d]);

  useGSAP(() => {
    if (reduced || !stage.current) return;
    ScrollTrigger.create({
      trigger: stage.current,
      start: "top top",
      end: "+=500%",
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
        setP(self.progress);
        setActive(storyStep(self.progress, offices.length).active);
      },
    });
  }, { dependencies: [reduced], scope: stage });

  const current = active >= 0 ? offices[active] : null;

  return (
    <div ref={stage} className={cn("relative grid-12 items-center", reduced ? "gap-y-12" : "h-svh")}>
      <ol className="col-span-12 flex flex-col gap-2 md:col-span-3">
        {offices.map((o, i) => (
          <li key={o.id} className={cn("text-h2 transition-opacity duration-500", reduced || active === i ? "opacity-100" : "opacity-15")} aria-current={active === i ? "true" : undefined}>
            {o.city}
          </li>
        ))}
      </ol>
      <div className="relative col-span-12 aspect-square md:col-span-6">
        <div className="absolute inset-[6%] rounded-full text-ink"><Dial progress={p} /></div>
        <div className="absolute inset-[14%]">
          {svg && !reduced ? <LogoScene svgText={svg} progress={progress} pointer={!window.matchMedia("(pointer: coarse)").matches} /> : <StaticLogoFallback active={active} />}
        </div>
      </div>
      <div className="col-span-12 flex flex-col gap-3 md:col-span-3 md:items-end md:text-right" aria-live="polite">
        {current ? (
          <>
            <Eyebrow>{`${current.city} [${current.countryCode}]`}</Eyebrow>
            <Eyebrow className="opacity-60">{`${fmt(current.lat, "N", "S")} ${fmt(current.lng, "E", "W")}`}</Eyebrow>
            <a href={`mailto:${current.email}`} className="text-body-s underline-offset-4 hover:underline">{current.email}</a>
          </>
        ) : (
          <Eyebrow className="opacity-60">{reduced ? "Five offices, one team" : "Scroll to explore"}</Eyebrow>
        )}
      </div>
    </div>
  );
}

function Dial({ progress }: { progress: number }) {
  const ticks = 120;
  const on = Math.round(progress * ticks);
  return (
    <svg viewBox="-50 -50 100 100" className="h-full w-full" aria-hidden="true">
      {Array.from({ length: ticks }, (_, i) => {
        const a = (i / ticks) * Math.PI * 2 - Math.PI / 2;
        const long = i % 10 === 0;
        const r1 = 48, r2 = long ? 44 : 46;
        return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke="currentColor" strokeWidth={0.3} opacity={i < on ? 0.75 : 0.2} />;
      })}
    </svg>
  );
}
```

```tsx
// src/components/sections/LogoStorySection.tsx
import type { LogoStorySection as T, Office } from "@/content/schema";
import { SectionShell } from "./SectionShell";
import { LogoStory } from "@/components/three/LogoStory";

export function LogoStorySection({ section: s, offices }: { section: T; offices: Office[] }) {
  return (
    <SectionShell theme={s.theme} head={s.head} id={s.id} bottom="md">
      <LogoStory offices={offices} />
    </SectionShell>
  );
}
```

Remove the unused `TickRuler` import in `LogoStory.tsx` if lint flags it.

- [ ] **Step 7: Run tests and visual check**

Run: `pnpm test && pnpm typecheck && pnpm lint`
Expected: PASS.

Add the section to the kitchen sink (`<LogoStorySection section={{ type: "logoStory", theme: "paper", head: { index: "S.03", label: "Locations", statement: "One company, five countries." } }} offices={getSite().offices} />`) and check in the browser pane at 1440×900 and 375×812:
- pieces assemble/explode/reassemble smoothly as you scroll; active office text and dial stay in sync;
- network tab: `three` chunk requested only when approaching the section;
- with DevTools "Emulate prefers-reduced-motion: reduce" → static exploded SVG + full list, no pin.
Compare framing with `_docs/reference/cominvi-shots/home-d-06.png`…`home-d-09.png` (minerals dial). If any grouping looks wrong (a piece visually belongs with another), adjust `PIECE_GROUPS` and `PARTS` together and record the final grouping for DESIGN.md.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(3d): scroll-driven exploded 99x logo story with static fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Page view, content contract tests and the Home page

**Files:**
- Create: `src/components/sections/PageView.tsx`, `src/lib/seo.ts`, `src/content/en/pages/home.ts`, `tests/unit/content/pages.test.ts`
- Modify: `src/content/index.ts` (register pages statically), `src/app/page.tsx` (final)

**Interfaces:**
- `PageView({ page: Page; site: Site })` = `Hero?` + `SectionRenderer` + `NextPage`.
- `buildMetadata(page: Page): Metadata` (Next `Metadata`) — `title: page.meta.title` (layout template adds "— 99x"; for Home use `title: { absolute: page.meta.title }`), description, `alternates.canonical: page.path`, `openGraph { title, description, url, siteName: "99x", type: "website", locale: "en", images: [{ url, width, height, alt }] }`, `twitter.card = "summary_large_image"`.
- `organizationJsonLd(site: Site): object` (used in Task 18).
- `src/content/index.ts` final shape: `const pageRegistry: Record<Locale, Partial<Record<PageSlug, Page>>> = { en: { home: PageSchema.parse(home), ... } }` (replace `registerPages`; remove that function).

- [ ] **Step 1: Write the failing content contract test**

```ts
// tests/unit/content/pages.test.ts
import { describe, it, expect } from "vitest";
import { getAllPages, getPage } from "@/content";
import { BUILT_ROUTES } from "@/content/routes";
import type { Page, Section } from "@/content/schema";

const pages = getAllPages();
const byPath = new Map(pages.map((p) => [p.path, p]));

function links(page: Page) {
  const out: { label: string; href: string; external?: boolean }[] = [];
  const visit = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(visit);
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (typeof o.href === "string" && typeof o.label === "string") out.push(o as never);
      Object.values(o).forEach(visit);
    }
  };
  visit(page.hero);
  visit(page.sections);
  return out;
}
const sectionIds = (p: Page) => new Set(p.sections.map((s: Section) => s.id).filter(Boolean));

describe.each(pages.map((p) => [p.slug, p] as const))("page %s", (_slug, page) => {
  it("internal links resolve to built routes and existing anchors", () => {
    for (const l of links(page)) {
      if (l.external || l.href.startsWith("mailto:") || l.href.startsWith("tel:")) continue;
      const [path, hash] = l.href.split("#");
      const targetPath = path || page.path;
      expect(BUILT_ROUTES as readonly string[], `${l.label} -> ${l.href}`).toContain(targetPath);
      if (hash) {
        const target = byPath.get(targetPath);
        if (target) expect(sectionIds(target).has(hash), `missing #${hash} on ${targetPath}`).toBe(true);
      }
    }
  });

  it("section indices run S.01, S.02, … in order", () => {
    const idx = page.sections.flatMap((s) => ("head" in s && s.head ? [s.head.index] : []));
    idx.forEach((v, i) => expect(v).toBe(`S.${String(i + 1).padStart(2, "0")}`));
  });

  it("next page points at a built route and reuses its hero image", () => {
    expect(BUILT_ROUTES as readonly string[]).toContain(page.next.href);
    const target = byPath.get(page.next.href);
    if (target?.hero) expect(page.next.image.src).toBe(target.hero.image.src);
  });
});

describe("home", () => {
  it("is registered at /", () => expect(getPage("home").path).toBe("/"));
});
```

Run: `pnpm test tests/unit/content/pages.test.ts` → FAIL (`Page not registered: en/home`).

- [ ] **Step 2: Write `src/content/en/pages/home.ts`**

```ts
import type { Page } from "../../schema";
import { img } from "../../img";

const X = (p: string) => `https://99x.io${p}`;

export const home: Page = {
  slug: "home",
  path: "/",
  meta: {
    title: "99x — Digital products, engineering teams and AI",
    description: "99x builds digital products, scales engineering teams and puts AI to work for companies in the Nordics, Europe and the US.",
    ogImage: img("home/hero.jpg", "99x team members collaborating in the Oslo office"),
  },
  hero: {
    eyebrow: "Product engineering · Tech talent · AI",
    lines: ["We build digital products,", "scale teams and put AI to work."],
    image: img("home/hero.jpg", "99x team members collaborating in the Oslo office"),
    metric: { label: "Since 2000", value: "600+ people" },
    cards: [
      { image: img("home/services-tile.jpg", "Engineers reviewing a product roadmap"), link: { label: "Our services", href: "/services" } },
      { image: img("home/ai.jpg", "A team working together at laptops"), link: { label: "AI at 99x", href: X("/ai-99x"), external: true } },
    ],
  },
  sections: [
    {
      type: "stats",
      theme: "paper",
      head: { index: "S.01", label: "About us", statement: "For more than two decades, companies across the Nordics and beyond have trusted 99x to shape their products and scale their teams." },
      image: img("home/about-portrait.jpg", "A 99x engineer at work"),
      items: [
        { value: "20+", label: "Years building software", icon: "calendar" },
        { value: "600+", label: "Engineers, designers & advisors", icon: "people" },
        { value: "5", label: "Countries, one company", icon: "globe" },
        { value: "100+", label: "Companies transformed", icon: "chart" },
      ],
      body: "Rooted in Norwegian values — trust, openness and quality — we combine product strategy, design and engineering with the capacity to scale fast when a project demands it.",
      link: { label: "About us", href: "/about-us" },
    },
    {
      type: "cardGrid",
      theme: "tint",
      head: { index: "S.02", label: "What we do", statement: "Four ways we help you build, scale and modernise — with AI where it makes the product better." },
      cards: [
        { title: "Product engineering", description: "Long-term product co-creation with facilitated teams that own outcomes, not just tickets.", icon: "layers", link: { label: "Product engineering", href: "/services#product-engineering" } },
        { title: "Web solutions", description: "Websites, e-commerce and integrations — designed, built, hosted and run end to end.", icon: "browser", link: { label: "Web solutions", href: "/services#web-solutions" } },
        { title: "Tech talent Europe", description: "Senior engineers from our European hubs, embedded in your team and your working hours.", icon: "users", link: { label: "Tech talent Europe", href: "/services#nearshore-europe" } },
        { title: "Tech talent USA & Canada", description: "AI-enabled nearshore engineers from Brazil, working in your timezone.", icon: "globe", link: { label: "Tech talent USA", href: "/services/nearshore-tech-talent-usa" } },
        { title: "AI at 99x", description: "Generative AI, agentic workflows and MCP, applied across the product lifecycle.", icon: "spark", link: { label: "AI at 99x", href: X("/ai-99x"), external: true } },
      ],
      photo: img("home/services-tile.jpg", "Engineers reviewing a product roadmap"),
      link: { label: "All services", href: "/services" },
    },
    {
      type: "logoStory",
      theme: "paper",
      head: { index: "S.03", label: "Locations", statement: "One company, five countries. Each office brings its own strengths to the same team." },
    },
    {
      type: "stickySplit",
      theme: "paper",
      head: { index: "S.04", label: "AI" },
      image: img("home/ai.jpg", "A team working together at laptops"),
      mediaSide: "left",
      heading: "Smarter teams, smarter products with AI",
      body: "We build generative AI, agentic workflows and MCP into every stage of the product lifecycle — from digital products and web platforms to e-commerce and engineering productivity. The result: smarter software, faster delivery and higher quality.",
      link: { label: "AI at 99x", href: X("/ai-99x"), external: true },
    },
    {
      type: "caseCards",
      theme: "tint",
      head: { index: "S.05", label: "Case studies", statement: "Solutions that work, and last." },
      display: { text: "100+ companies transformed", subline: "Global and Scandinavian companies" },
      cards: [
        { title: "A flourishing e-commerce solution for Interflora", tag: "Web solutions", image: img("home/case-interflora.jpg", "Interflora's online shop on a laptop"), link: { label: "Interflora", href: X("/case-studies/web-solutions/a-flourishing-e-commerce-solution-for-interflora"), external: true } },
        { title: "Boligmappa: the service booklet for 1.2 million Norwegian households", tag: "Product engineering", image: img("home/case-boligmappa.jpg", "A Norwegian family home"), link: { label: "Boligmappa", href: X("/case-studies/product-engineering/boligmappa"), external: true } },
        { title: "BagID: modern air travel with smarter baggage handling", tag: "Product engineering", image: img("home/case-bagid.jpg", "Luggage lined up at an airport"), link: { label: "BagID", href: X("/case-studies/product-engineering/bagid"), external: true } },
      ],
      link: { label: "All case studies", href: X("/case-studies"), external: true },
    },
    {
      type: "proofToggle",
      theme: "paper",
      head: { index: "S.06", label: "Why 99x" },
      subline: "Why work with us",
      items: [
        { value: "90%", text: "of our clients say we met or exceeded their expectations." },
        { value: "Top 1%", text: "of engineering talent, selected across three continents." },
        { value: "100+", text: "global and Scandinavian companies transformed." },
      ],
    },
    {
      type: "insightCards",
      theme: "paper",
      head: { index: "S.07", label: "Insights" },
      cards: [
        { kind: "Blog", title: "What is data science and why is it critical for business growth?", image: img("home/insight-data-science.jpg", "Data visualisation on a screen"), link: { label: "Read", href: X("/Insights/blog/what-is-data-science-and-why-is-it-critical-for-business-growth"), external: true } },
        { kind: "Webinar", title: "Adapting MCP for business applications", image: img("home/insight-mcp.jpg", "Webinar speakers discussing MCP"), link: { label: "Watch", href: X("/events/2025/adapting-mcp-for-business-applications"), external: true } },
        { kind: "News", title: "99x reports breakthrough market traction for its agentic AI platform", image: img("home/insight-agentic.jpg", "99x team at a product launch"), link: { label: "Read", href: "https://www.ft.lk/it-telecom-tech/99x-reports-breakthrough-market-traction-for-new-Agentic-AI-platform/50-779890", external: true } },
      ],
      link: { label: "All insights", href: X("/Insights"), external: true },
    },
    {
      type: "namesCylinder",
      theme: "paper",
      head: { index: "S.08", label: "Trusted by", statement: "Companies that build with us." },
      names: [
        "Adra", "Compello", "SuperOffice", "BUS", "Solwr", "Boligmappa", "Kahoot!", "Interflora", "Bygg 1", "Helsebiblioteket",
        "OBOS", "Patentstyret", "Q-Meieriene", "Gilde", "Glava", "NORCE", "Kavli", "Elite", "Reitan", "Eplehuset", "Urmaker Bjerke",
        "Britannia", "Göteborgsvarvet", "IFPA", "Maurten", "Skiguard", "Wingårdhs", "Techstep", "DNK", "Wilhelmsen", "Peppes Pizza", "Nettalliansen",
      ],
    },
  ],
  next: { label: "About us", eyebrow: "Next", href: "/about-us", image: img("about/hero.jpg", "The 99x team gathered together") },
};
```

Note: the spec listed Insights inside S.06; they are their own S.07 section here so each section keeps one job (`proofToggle` vs `insightCards`). Trusted by becomes S.08.

- [ ] **Step 3: Register and render**

Update `src/content/index.ts`:

```ts
import { SiteSchema, PageSchema, type Page, type Site } from "./schema";
import { site as siteEn } from "./en/site";
import { home } from "./en/pages/home";

export type Locale = "en";
export type PageSlug = Page["slug"];

const sites: Record<Locale, Site> = { en: SiteSchema.parse(siteEn) };
const pageRegistry: Record<Locale, Partial<Record<PageSlug, Page>>> = {
  en: { home: PageSchema.parse(home) },
};

export function getSite(locale: Locale = "en"): Site { return sites[locale]; }
export function getPage(slug: PageSlug, locale: Locale = "en"): Page {
  const page = pageRegistry[locale][slug];
  if (!page) throw new Error(`Page not registered: ${locale}/${slug}`);
  return page;
}
export function getAllPages(locale: Locale = "en"): Page[] {
  return Object.values(pageRegistry[locale]).filter((p): p is Page => Boolean(p));
}
```

`about/hero.jpg` is referenced before the About page exists — fine: it's in the image manifest from Task 4. The next-page contract test skips the hero-match check until `/about-us` is registered.

```tsx
// src/components/sections/PageView.tsx
import type { Page, Site } from "@/content/schema";
import { Hero } from "./Hero";
import { SectionRenderer } from "./SectionRenderer";
import { NextPage } from "./NextPage";

export function PageView({ page, site }: { page: Page; site: Site }) {
  return (
    <>
      {page.hero && <Hero hero={page.hero} />}
      <SectionRenderer sections={page.sections} site={site} />
      <NextPage next={page.next} />
    </>
  );
}
```

```ts
// src/lib/seo.ts
import type { Metadata } from "next";
import type { Page, Site } from "@/content/schema";

export function buildMetadata(page: Page): Metadata {
  const { title, description, ogImage } = page.meta;
  return {
    title: page.slug === "home" ? { absolute: title } : title,
    description,
    alternates: { canonical: page.path },
    openGraph: {
      title, description, url: page.path, siteName: "99x", type: "website", locale: "en",
      images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.src] },
  };
}

export function organizationJsonLd(site: Site) {
  const hq = site.offices[0];
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "99x",
    url: site.url,
    logo: `${site.url}/brand/99x-logo.svg`,
    sameAs: site.socials.map((s) => s.href),
    email: site.footer.contact.email,
    telephone: site.footer.contact.phone,
    address: { "@type": "PostalAddress", streetAddress: "Dronning Eufemias gate 16", postalCode: "0191", addressLocality: hq.city, addressCountry: hq.countryCode },
  };
}
```

```tsx
// src/app/page.tsx
import { getPage, getSite } from "@/content";
import { PageView } from "@/components/sections/PageView";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(getPage("home"));

export default function HomePage() {
  return <PageView page={getPage("home")} site={getSite()} />;
}
```

Delete the kitchen-sink demos of LogoStory/cylinder/timeline added in Tasks 9/12 if they reference data that no longer compiles; keep the primitives gallery.

- [ ] **Step 4: Run tests**

Run: `pnpm test && pnpm typecheck && pnpm build`
Expected: PASS; build statically generates `/`.

- [ ] **Step 5: Visual pass against cominvi**

`pnpm dev`, open `/` in the browser pane at 1440×900 and 375×812. Scroll the full page and compare section by section with `_docs/reference/cominvi-shots/home-d-00.png` … `home-d-24.png` and `home-m-*.png`. Check: hero lines reveal after loader; header recolours over each section and hides on scroll down; statements scrub; cards hover lavender; 3D story pins and syncs; cylinder rotates; next-page panel transitions into About (About is a 404 until Task 14 — expected). Fix spacing/scale deviations now.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(home): home page content, page view, metadata and content contract tests

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: About us page

**Files:**
- Create: `src/content/en/pages/about.ts`, `src/app/about-us/page.tsx`
- Modify: `src/content/index.ts` (register `about`)
- Test: covered by `tests/unit/content/pages.test.ts` (now iterates About too) + add `it("about is registered", …)`.

- [ ] **Step 1: Add the failing assertion** to `tests/unit/content/pages.test.ts`:

```ts
describe("about", () => {
  it("is registered at /about-us", () => expect(getPage("about").path).toBe("/about-us"));
});
```

Run: `pnpm test tests/unit/content/pages.test.ts` → FAIL.

- [ ] **Step 2: Write `src/content/en/pages/about.ts`**

```ts
import type { Page } from "../../schema";
import { img } from "../../img";

const X = (p: string) => `https://99x.io${p}`;
const person = (name: string, role: string, file: string, email?: string) => ({
  name, role, ...(email ? { email } : {}), photo: img(`people/${file}.jpg`, `Portrait of ${name}`),
});

export const about: Page = {
  slug: "about",
  path: "/about-us",
  meta: {
    title: "About us",
    description: "Advisors, builders and innovators: 600+ people across Norway, Sri Lanka, Portugal, Brazil and Malaysia, building digital products since 2000.",
    ogImage: img("about/hero.jpg", "The 99x team gathered together"),
  },
  hero: {
    eyebrow: "About us",
    lines: ["Advisors, builders,", "innovators."],
    image: img("about/hero.jpg", "The 99x team gathered together"),
    metric: { label: "Founded", value: "2000, Colombo" },
  },
  sections: [
    {
      type: "mediaStatement",
      theme: "paper",
      head: { index: "S.01", label: "This is 99x", statement: "We help businesses build digital solutions that work — for users, for the organisation and for the bottom line." },
      body: "Our clients range from ambitious startups to leading players in the private and public sector, healthcare, education, retail and culture. What they share: they want a long-term partner, not a vendor. Lately that means more AI — in testing, in data and in how we build teams.",
      images: [img("about/management.jpg", "99x group leadership in conversation"), img("about/office.jpg", "Engineers at work in a 99x office")],
      video: { youtubeId: "0O8WkFGaLw4", label: "Watch: This is 99x" },
    },
    {
      type: "displayLine",
      theme: "tint",
      head: { index: "S.02", label: "Our values" },
      text: "Norwegian values, global capacity",
      fill: "pill",
      subline: "Trust · Openness · Quality",
      body: "99x combines product strategy, design and engineering with 600+ experts across our hubs in Europe, Asia and South America — so we can scale quickly when a project demands it.",
    },
    {
      type: "timeline",
      theme: "dark",
      head: { index: "S.03", label: "Our journey" },
      items: [
        { year: "2000", title: "Eurocenter DDC is founded in Sri Lanka", image: img("about/t-2000.jpg", "Early days of Eurocenter in Colombo") },
        { year: "2006", title: "Seeds Consulting is founded in Norway", image: img("about/t-2006.jpg", "Seeds Consulting founders") },
        { year: "2012", title: "Eurocenter becomes 99x Technology", image: img("about/t-2012.jpg", "The 99x Technology office") },
        { year: "2021", title: "Seeds and 99x merge", image: img("about/t-2021.jpg", "The Seeds team joining 99x") },
        { year: "2023", title: "Cleverti and Nextly join, and 99x opens in Malaysia", image: img("about/t-2023.jpg", "The new 99x team in Kuala Lumpur") },
        { year: "2025", title: "Solvr, Gture and Republic join the group", image: img("about/t-2025.jpg", "Gture and 99x teams together") },
        { year: "2026", title: "Increo joins — 11 companies, 600+ people", image: img("about/t-2026.jpg", "Increo and 99x teams together") },
      ],
    },
    {
      type: "tabs",
      theme: "tint",
      id: "how-we-work",
      head: { index: "S.04", label: "How we work", statement: "A partner that stays for the long run." },
      items: [
        { label: "Trusted partner", heading: "Long-term, not transactional", body: "We work as an extension of your organisation: shared goals, shared accountability and teams that stay with your product as it grows.", image: img("about/tab-partner.jpg", "A client workshop with the 99x team") },
        { label: "Ways of working", heading: "Facilitated teams", body: "Cross-functional teams combine strategy, design and engineering, with the capacity, competence and compliance to deliver — and AI built into how we work.", image: img("about/tab-work.jpg", "A cross-functional team planning a sprint") },
        { label: "Culture", heading: "Scandinavian at heart", body: "Trust, openness and quality come first. Every office, from Oslo to Kuala Lumpur, lives by the same values every day.", image: img("about/tab-culture.jpg", "99x colleagues at a company gathering") },
      ],
    },
    {
      type: "officeRows",
      theme: "paper",
      id: "offices",
      head: { index: "S.05", label: "Global presence", statement: "Specialised units serving different markets under one global umbrella." },
      body: "Full-service web and e-commerce across the Nordics, product engineering for Scandinavia and beyond, and technology teams building for European and American companies.",
    },
    {
      type: "namesCylinder",
      theme: "paper",
      head: { index: "S.06", label: "The 99x group", statement: "A network of specialised tech companies, united by one culture." },
      names: ["99x Technology", "Seeds", "Cleverti", "LeanOn", "Clave Consulting", "Solvr", "Nextly", "Gture", "Republic", "Increo", "Digital Solutions"],
    },
    {
      type: "cardGrid",
      theme: "tint",
      head: { index: "S.07", label: "Our divisions" },
      cards: [
        { title: "Product engineering", description: "Long-term product co-creation for companies across Scandinavia and global markets.", icon: "layers", link: { label: "Product engineering", href: "/services#product-engineering" } },
        { title: "Tech talent Europe", description: "Engineering teams from our European hubs for companies across Europe.", icon: "users", link: { label: "Tech talent Europe", href: "/services#nearshore-europe" } },
        { title: "Tech talent Americas", description: "Nearshore engineers from Brazil for US and Canadian companies.", icon: "globe", link: { label: "Tech talent USA", href: "/services/nearshore-tech-talent-usa" } },
        { title: "Web solutions", description: "Full-service web and e-commerce for businesses in Norway.", icon: "browser", link: { label: "Web solutions", href: "/services#web-solutions" } },
      ],
    },
    {
      type: "peopleGrid",
      theme: "paper",
      head: { index: "S.08", label: "Leadership", statement: "The group leadership team guiding the 99x ecosystem." },
      people: [
        person("Odd Sverre Østlie", "Group CEO, 99x", "odd-sverre-ostlie"),
        person("Trygve Moe", "Group CFO, 99x", "trygve-moe"),
        person("Stein Eric Moe", "CEO, Gture", "stein-eric-moe"),
        person("Carlos Coutinho Silva", "EVP 99x Europe & CEO 99x Tech Portugal", "carlos-coutinho-silva"),
        person("Hasith Yaggahavita", "CEO, 99x Product Engineering", "hasith-yaggahavita"),
        person("Eiliv Mæhle Liljevik", "EVP 99x Nordics & CEO Digital Solutions", "eiliv-liljevik"),
        person("Thiers Santos", "EVP, 99x Americas", "thiers-santos", "ThiersS@99x.io"),
        person("Terje Aasgaard", "Managing Director, Clave Consulting", "terje-aasgaard"),
      ],
    },
  ],
  next: { label: "Our services", eyebrow: "Next", href: "/services", image: img("services/hero.jpg", "Engineers collaborating at a desk") },
};
```

`X` is unused in this file — delete the `const X` line if lint flags it. "Digital Solutions" and "LeanOn" are listed in open-questions #6 for confirmation.

- [ ] **Step 3: Register and route**

In `src/content/index.ts` add `import { about } from "./en/pages/about";` and `about: PageSchema.parse(about),` to the `en` registry.

```tsx
// src/app/about-us/page.tsx
import { getPage, getSite } from "@/content";
import { PageView } from "@/components/sections/PageView";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(getPage("about"));

export default function AboutPage() {
  return <PageView page={getPage("about")} site={getSite()} />;
}
```

- [ ] **Step 4: Test, build, visual pass**

Run: `pnpm test && pnpm typecheck && pnpm build` → PASS.
Compare `/about-us` with `_docs/reference/cominvi-shots/about-d-*.png` at desktop and mobile; check the Home → About next-page transition (hero image continuity).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(about): about us page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: Services page

**Files:**
- Create: `src/content/en/pages/services.ts`, `src/app/services/page.tsx`
- Modify: `src/content/index.ts`, `tests/unit/content/pages.test.ts`

- [ ] **Step 1: Failing assertion**

```ts
describe("services", () => {
  it("has anchors for every division", () => {
    const ids = getPage("services").sections.map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["nearshore-usa", "nearshore-europe", "product-engineering", "web-solutions"]));
  });
});
```

Run → FAIL.

- [ ] **Step 2: Write `src/content/en/pages/services.ts`**

```ts
import type { Page } from "../../schema";
import { img } from "../../img";

const X = (p: string) => `https://99x.io${p}`;

export const services: Page = {
  slug: "services",
  path: "/services",
  meta: {
    title: "Services",
    description: "Product engineering, web solutions and nearshore tech talent for Europe and the US — four ways 99x helps you build, scale and modernise.",
    ogImage: img("services/hero.jpg", "Engineers collaborating at a desk"),
  },
  hero: {
    eyebrow: "Services",
    lines: ["Stay ahead in a", "fast-moving tech landscape."],
    image: img("services/hero.jpg", "Engineers collaborating at a desk"),
    cards: [
      { image: img("nearshore-usa/hero.jpg", "Nearshore engineers in Brazil"), link: { label: "Tech talent USA", href: "/services/nearshore-tech-talent-usa" } },
      { image: img("services/product-engineering.jpg", "A product team in a planning session"), link: { label: "Product engineering", href: "#product-engineering" } },
    ],
  },
  sections: [
    {
      type: "cardGrid",
      theme: "tint",
      head: { index: "S.01", label: "What we do", statement: "Four lines of business, one standard of quality." },
      cards: [
        { title: "Tech talent USA & Canada", description: "AI-enabled nearshore engineers from Brazil, in your timezone.", icon: "globe", link: { label: "Tech talent USA", href: "#nearshore-usa" } },
        { title: "Tech talent Europe", description: "Senior engineers from our European hubs, embedded in your team.", icon: "users", link: { label: "Tech talent Europe", href: "#nearshore-europe" } },
        { title: "Product engineering", description: "Facilitated teams that co-create products with market fit.", icon: "layers", link: { label: "Product engineering", href: "#product-engineering" } },
        { title: "Web solutions", description: "Web and e-commerce, built, hosted and run end to end.", icon: "browser", link: { label: "Web solutions", href: "#web-solutions" } },
      ],
    },
    {
      type: "numberedList",
      theme: "paper",
      id: "nearshore-usa",
      head: { index: "S.02", label: "Tech talent USA", statement: "Scale your US engineering team with senior nearshore engineers — in your timezone, at your pace." },
      image: img("nearshore-usa/hero.jpg", "Nearshore engineers in Brazil"),
      items: [
        { title: "Staff augmentation", description: "Vetted engineers who feel in-house and ship from week one." },
        { title: "Web applications", description: "Secure, scalable web apps on React, Vue, Node.js and Django." },
        { title: "Mobile apps", description: "From MVP to enterprise apps on iOS, Android and cross-platform." },
        { title: "AI & data", description: "Machine learning, LLMs, computer vision and analytics that scale." },
      ],
      link: { label: "Tech talent USA", href: "/services/nearshore-tech-talent-usa" },
    },
    {
      type: "numberedList",
      theme: "tint",
      id: "nearshore-europe",
      head: { index: "S.03", label: "Tech talent Europe", statement: "Engineering capacity from our European hubs, close to your culture and your working day." },
      image: img("about/office.jpg", "Engineers at work in a 99x office"),
      items: [
        { title: "Software development", description: "Dedicated developers and full teams across modern stacks." },
        { title: "QA & testing", description: "Manual and automated testing that keeps releases safe." },
        { title: "Cloud engineering", description: "Cloud platforms, DevOps and infrastructure that scale." },
        { title: "Data science & AI", description: "From data foundations to production AI features." },
      ],
      link: { label: "Tech talent Europe", href: X("/services/tech-experts-Europe"), external: true },
    },
    {
      type: "numberedList",
      theme: "paper",
      id: "product-engineering",
      head: { index: "S.04", label: "Product engineering", statement: "We co-create products that reach market fit and drive adoption — with facilitated teams built for the long term." },
      image: img("services/product-engineering.jpg", "A product team in a planning session"),
      items: [
        { title: "Full lifecycle engineering" },
        { title: "Artificial intelligence" },
        { title: "Quality engineering & test automation" },
        { title: "Cloud consulting" },
        { title: "Product discovery" },
        { title: "Due diligence assessments" },
        { title: "Optimaxer AI Web" },
      ],
      link: { label: "Product engineering", href: X("/services/product-engineering"), external: true },
    },
    {
      type: "numberedList",
      theme: "tint",
      id: "web-solutions",
      head: { index: "S.05", label: "Web solutions", statement: "Custom websites and business-critical platforms, with end-to-end responsibility from build to hosting and support." },
      image: img("services/web-solutions.jpg", "Colleagues reviewing a website design"),
      items: [
        { title: "E-commerce", description: "Online stores and platforms that grow with your business." },
        { title: "Websites & platforms", description: "Design, development and integrations tailored to what fits." },
        { title: "Lifecycle management", description: "Hosting, maintenance and support after launch." },
      ],
      link: { label: "Web solutions", href: X("/services/web-solutions"), external: true },
    },
  ],
  next: { label: "Tech talent USA", eyebrow: "Next", href: "/services/nearshore-tech-talent-usa", image: img("nearshore-usa/hero.jpg", "Nearshore engineers in Brazil") },
};
```

- [ ] **Step 3: Register + route** (`src/app/services/page.tsx`, same pattern as About with `getPage("services")`, component name `ServicesPage`).

- [ ] **Step 4: Test, build, visual pass** — `pnpm test && pnpm typecheck && pnpm build`; compare with `_docs/reference/cominvi-shots/services-d-*.png`. Verify anchor cards scroll smoothly to each division (Lenis handles `#` links; if not, intercept `a[href^="#"]` clicks in `SmoothScroll` and call `lenis.scrollTo(hash, { offset: -80 })`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(services): services overview page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 16: Nearshore Tech Talent USA page

**Files:**
- Create: `src/content/en/pages/nearshore-usa.ts`, `src/app/services/nearshore-tech-talent-usa/page.tsx`
- Modify: `src/content/index.ts`, `tests/unit/content/pages.test.ts`

- [ ] **Step 1: Failing assertion**

```ts
describe("nearshore-usa", () => {
  it("has the contact block anchored at #talk", () => {
    const s = getPage("nearshore-usa").sections.find((x) => x.type === "contactBlock");
    expect(s?.id).toBe("talk");
  });
});
```

- [ ] **Step 2: Write `src/content/en/pages/nearshore-usa.ts`**

```ts
import type { Page } from "../../schema";
import { img } from "../../img";

const X = (p: string) => `https://99x.io${p}`;

export const nearshoreUsa: Page = {
  slug: "nearshore-usa",
  path: "/services/nearshore-tech-talent-usa",
  meta: {
    title: "Nearshore tech talent for US companies",
    description: "Scale your engineering team with AI-enabled senior nearshore engineers from Brazil, working in your timezone. 4.9/5 on Clutch from 50+ reviews.",
    ogImage: img("nearshore-usa/hero.jpg", "Nearshore engineers in Brazil"),
  },
  hero: {
    eyebrow: "Nearshore tech talent — USA & Canada",
    lines: ["Scale your engineering team", "with AI-enabled nearshore engineers."],
    image: img("nearshore-usa/hero.jpg", "Nearshore engineers in Brazil"),
    metric: { label: "Clutch rating", value: "4.9 / 5" },
    cards: [
      { image: img("nearshore-usa/partners.jpg", "An engineer working at a large screen"), link: { label: "Engagement models", href: "#engagement" } },
      { image: img("people/thiers-santos.jpg", "Portrait of Thiers Santos"), link: { label: "Talk to us", href: "#talk" } },
    ],
  },
  sections: [
    {
      type: "stats",
      theme: "paper",
      head: { index: "S.01", label: "Engineering partners", statement: "A curated Brazilian engineering partner that works as an extension of your team — in your timezone, so you spend less time managing and more time shipping." },
      image: img("nearshore-usa/partners.jpg", "An engineer working at a large screen"),
      items: [
        { value: "60+", label: "Senior engineers, designers & product leaders", icon: "people" },
        { value: "15+", label: "Years working with US companies", icon: "calendar" },
        { value: "4.9/5", label: "On Clutch, from 50+ reviews", icon: "star" },
        { value: "93", label: "eNPS — a team that wants to be here", icon: "heart" },
      ],
      body: "Our roster isn't broad, it's handpicked: every engineer is vetted for technical mastery, communication and an ownership mindset.",
    },
    {
      type: "cardGrid",
      theme: "tint",
      id: "engagement",
      head: { index: "S.02", label: "Engagement models", statement: "Flexible engagement models, shaped around what you need to ship." },
      cards: [
        { title: "IT staff augmentation", description: "Extend your team with vetted engineers who feel in-house, communicate in real time and ship with quality and speed.", icon: "users" },
        { title: "Web application development", description: "Secure, scalable, user-friendly web apps built on React, Vue, Node.js and Django.", icon: "code" },
        { title: "Custom mobile apps", description: "From MVPs to enterprise-grade apps for iOS, Android and cross-platform.", icon: "mobile" },
        { title: "AI & data solutions", description: "Machine learning, LLMs, generative AI, computer vision and analytics that learn, adapt and scale.", icon: "database" },
      ],
    },
    {
      type: "stickySplit",
      theme: "paper",
      head: { index: "S.03", label: "AI @ 99x Americas" },
      image: img("nearshore-usa/ai.jpg", "A team working together around a laptop"),
      mediaSide: "right",
      heading: "Future-proof engineering with AI",
      body: "We're a software company first. AI is a powerful enabler — misapplied, it creates fragile systems and technical debt. We use it deliberately, inside a specs-first, modular architecture with human review, to get the speed without losing control.",
      link: { label: "AI at 99x", href: X("/ai-99x"), external: true },
    },
    {
      type: "numberedList",
      theme: "tint",
      head: { index: "S.04", label: "Why choose us", statement: "More than a tech vendor: experts who think strategically, challenge assumptions and help you ship better products, faster." },
      items: [
        { title: "Selective, senior talent", description: "Every expert is vetted for technical mastery, communication and an ownership mindset." },
        { title: "Seamless team integration", description: "Culturally aligned teams in your timezone." },
        { title: "Proven nearshore expertise", description: "15+ years delivering high-quality software for clients worldwide." },
        { title: "A flexible approach to AI", description: "AI to accelerate development without compromising quality — or none at all, if you prefer." },
      ],
    },
    {
      type: "caseCards",
      theme: "paper",
      head: { index: "S.05", label: "Customer stories", statement: "Products we've helped US and global companies build." },
      cards: [
        { title: "Giving a crowdfunding platform a competitive edge", tag: "Tech talent", image: img("nearshore-usa/case-crowdfunding.jpg", "Crowdfunding platform on a phone"), link: { label: "Crowdfunding", href: X("/case-studies/tech-experts/giving-a-crowdfunding-platform-a-competitive-edge"), external: true } },
        { title: "An operational intelligence platform for commercial real estate", tag: "Tech talent", image: img("nearshore-usa/case-cre.jpg", "Office buildings in a city centre"), link: { label: "CRE platform", href: X("/case-studies/tech-experts/operational-intelligence-platform-for-cre"), external: true } },
        { title: "Crafting a seamless printing experience", tag: "Tech talent", image: img("nearshore-usa/case-printly.jpg", "A printing app interface"), link: { label: "Printly", href: X("/case-studies/tech-experts/crafting-a-seamless-printing-experience"), external: true } },
        { title: "A user-friendly QR code management platform", tag: "Tech talent", image: img("nearshore-usa/case-qr.jpg", "A phone showing a QR code"), link: { label: "QR platform", href: X("/case-studies/tech-experts/user-friendly-qr-code-management-platform"), external: true } },
      ],
    },
    {
      type: "contactBlock",
      theme: "tint",
      id: "talk",
      head: { index: "S.06", label: "Talk to us", statement: "Ready to discuss your needs? Talk to Thiers." },
      person: { name: "Thiers Santos", role: "EVP, 99x Americas", email: "ThiersS@99x.io", photo: img("people/thiers-santos.jpg", "Portrait of Thiers Santos") },
      source: "nearshore-usa",
    },
  ],
  next: { label: "Contact us", eyebrow: "Next", href: "/contact", image: img("home/hero.jpg", "99x team members collaborating in the Oslo office") },
};
```

- [ ] **Step 3: Register + route** (`src/app/services/nearshore-tech-talent-usa/page.tsx`, `getPage("nearshore-usa")`, component `NearshoreUsaPage`).

- [ ] **Step 4: Test, build, visual pass** — `pnpm test && pnpm typecheck && pnpm build`; check `#engagement` / `#talk` hero cards, and submit the compact form in dev (server log shows `[contact]` with `source: "nearshore-usa"`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(nearshore-usa): nearshore tech talent USA page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 17: Contact page and redirect

**Files:**
- Create: `src/content/en/pages/contact.ts`, `src/app/contact/page.tsx`
- Modify: `src/content/index.ts`, `next.config.ts` (redirect), `tests/unit/content/pages.test.ts`, `tests/e2e/menu.spec.ts` (remove `fixme`)
- Test: `tests/e2e/contact.spec.ts`

- [ ] **Step 1: Failing tests**

```ts
// append to tests/unit/content/pages.test.ts
describe("registry", () => {
  it("registers all five pages", () => {
    expect(getAllPages().map((p) => p.slug).sort()).toEqual(["about", "contact", "home", "nearshore-usa", "services"]);
  });
});
```

```ts
// tests/e2e/contact.spec.ts
import { test, expect } from "@playwright/test";

test("old contact URL redirects permanently", async ({ request }) => {
  const res = await request.get("/about-us/contact-us", { maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers()["location"]).toContain("/contact");
});

test("form shows validation errors, then sends", async ({ page }) => {
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
```

(`permanent: true` redirects in Next return 308 — that's the permanent-redirect status; spec's "301" intent is satisfied.)

- [ ] **Step 2: Write `src/content/en/pages/contact.ts`**

```ts
import type { Page } from "../../schema";
import { img } from "../../img";

const person = (name: string, role: string, file: string, email: string, phone?: string) => ({
  name, role, email, ...(phone ? { phone } : {}), photo: img(`people/${file}.jpg`, `Portrait of ${name}`),
});

export const contact: Page = {
  slug: "contact",
  path: "/contact",
  meta: {
    title: "Contact",
    description: "Working on a new product, growing your team or curious about AI? Talk to 99x — offices in Oslo, Colombo, Algés, Vitória and Kuala Lumpur.",
    ogImage: img("home/hero.jpg", "99x team members collaborating in the Oslo office"),
  },
  sections: [
    {
      type: "contactMain",
      theme: "paper",
      heading: "Let's talk.",
      intro: "Working on a new product, growing your team or just curious about collaborating? Tell us a little about it and the right team will get back to you.",
      source: "contact",
    },
    {
      type: "divisionContacts",
      theme: "tint",
      head: { index: "S.01", label: "Direct lines", statement: "Prefer email? Reach the team that fits your question." },
      divisions: [
        { label: "Product engineering", heading: "Let's talk about your product.", email: "productengineering@99x.io" },
        { label: "Tech talent Europe", heading: "Let's discuss your tech needs in Europe.", email: "techexperts.europe@99x.io" },
        { label: "Tech talent Americas", heading: "Let's talk about your US team.", email: "techexperts.americas@99x.io" },
        { label: "Web solutions", heading: "Let's talk about your project.", email: "websolutions@99x.io" },
      ],
      people: [
        person("Guilherme Ramos Pereira", "Head of Strategic Development, 99x Europe", "guilherme-ramos-pereira", "guilherme.pereira@99x.io", "+351 919 557 786"),
        person("Steinar Magnussen", "Sales Director, 99x Norway", "steinar-magnussen", "steinar@99x.io", "+47 957 31 083"),
        person("Thiers Santos", "EVP, 99x Americas", "thiers-santos", "ThiersS@99x.io"),
        person("Chrishan de Mel", "Chief Marketing & Corporate Affairs Officer", "chrishan-de-mel", "ChrishanD@99x.io"),
        person("Dag Honningsvåg", "Chairman of the Board", "dag-honningsvag", "dag@99x.io", "+47 907 44 810"),
      ],
      internships: { heading: "Internships at 99x", body: "Interested in joining 99x as an intern? Send us an email — we'd love to hear from you.", email: "careers@99x.io" },
    },
    {
      type: "officeRows",
      theme: "paper",
      head: { index: "S.02", label: "Offices", statement: "Five offices, one team." },
    },
  ],
  next: { label: "Back to home", eyebrow: "Start over", href: "/", image: img("home/hero.jpg", "99x team members collaborating in the Oslo office") },
};
```

- [ ] **Step 3: Register, route and redirect**

Register `contact` in `src/content/index.ts`. Route `src/app/contact/page.tsx` with `getPage("contact")`, component `ContactPage`.

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [{ source: "/about-us/contact-us", destination: "/contact", permanent: true }];
  },
};
export default nextConfig;
```

Remove `test.fixme` from the second test in `tests/e2e/menu.spec.ts`.

- [ ] **Step 4: Run tests**

Run: `pnpm test && pnpm typecheck && pnpm test:e2e --project=desktop tests/e2e/contact.spec.ts tests/e2e/menu.spec.ts`
Expected: PASS.

Visual pass: compare `/contact` with `_docs/reference/cominvi-shots/contact-d-*.png`; check the dot map reads as a world map.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(contact): contact page, division contacts and legacy URL redirect

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 18: SEO — sitemap, robots, JSON-LD, 404

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/not-found.tsx`
- Modify: `src/app/layout.tsx` (JSON-LD)
- Test: `tests/unit/seo.test.ts`, `tests/e2e/seo.spec.ts`

- [ ] **Step 1: Failing tests**

```ts
// tests/unit/seo.test.ts
import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { buildMetadata } from "@/lib/seo";
import { getAllPages } from "@/content";

describe("seo", () => {
  it("sitemap lists the 5 built routes as absolute URLs", () => {
    const urls = sitemap().map((e) => e.url).sort();
    expect(urls).toEqual([
      "https://99x.io/", "https://99x.io/about-us", "https://99x.io/contact",
      "https://99x.io/services", "https://99x.io/services/nearshore-tech-talent-usa",
    ]);
  });
  it("robots disallows everything on preview deployments", () => {
    process.env.VERCEL_ENV = "preview";
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
    process.env.VERCEL_ENV = "production";
    expect(robots().rules).toEqual({ userAgent: "*", allow: "/" });
  });
  it("every page has canonical + og image", () => {
    for (const p of getAllPages()) {
      const m = buildMetadata(p);
      expect(m.alternates?.canonical).toBe(p.path);
      expect(m.openGraph?.images).toBeTruthy();
    }
  });
});
```

```ts
// tests/e2e/seo.spec.ts
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
  await expect(page.getByRole("link", { name: /home/i })).toBeVisible();
});
```

Run → FAIL.

- [ ] **Step 2: Implement**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllPages, getSite } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSite().url;
  return getAllPages().map((p) => ({ url: `${base}${p.path}`, changeFrequency: "monthly", priority: p.path === "/" ? 1 : 0.8 }));
}
```

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProd = (process.env.VERCEL_ENV ?? "production") === "production";
  return {
    rules: isProd ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: "https://99x.io/sitemap.xml",
  };
}
```

```tsx
// src/app/not-found.tsx
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <section data-theme="dark" className="flex min-h-svh flex-col items-start justify-end gap-8 bg-ink text-paper site-x pb-16">
      <Eyebrow className="text-paper/60">404</Eyebrow>
      <h1 className="text-hero">This page doesn't exist — yet.</h1>
      <p className="max-w-[35em] text-body-m text-paper/70">We're rebuilding 99x.io page by page. What you're looking for may still live on the current site.</p>
      <div className="flex gap-4">
        <Button link={{ label: "Back to home", href: "/" }} variant="light" />
        <Button link={{ label: "Current 99x.io", href: "https://99x.io", external: true }} variant="light" />
      </div>
    </section>
  );
}
```

In `src/app/layout.tsx`, inside `<body>` before `<SmoothScroll>`:

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(site)) }} />
```

(import `organizationJsonLd` from `@/lib/seo`.)

Note the 404's "Current 99x.io" link points at the old site deliberately; once the new site replaces 99x.io this link is removed (add to open-questions "Launch checklist").

- [ ] **Step 3: Run tests**

Run: `pnpm test && pnpm test:e2e --project=desktop tests/e2e/seo.spec.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(seo): sitemap, robots, organization JSON-LD and 404 page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 19: End-to-end hardening — navigation, no-JS, resize, accessibility, performance

**Files:**
- Create: `tests/e2e/navigation.spec.ts`, `tests/e2e/no-js.spec.ts`, `tests/e2e/resize.spec.ts`, `tests/e2e/a11y.spec.ts`, `tests/e2e/visual.spec.ts`, `tests/e2e/reduced-motion.spec.ts`

- [ ] **Step 1: Write the specs**

```ts
// tests/e2e/navigation.spec.ts  (Review Focus #1)
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
```

```ts
// tests/e2e/no-js.spec.ts  (Review Focus #2)
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
  await page.goto("/contact");
  await page.getByLabel(/^Name/).fill("Ada");
  await page.getByLabel(/^Email/).fill("ada@example.com");
  await page.getByLabel(/^Message/).fill("Native form submission without JavaScript.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /send/i }).click();
  await expect(page).toHaveURL(/\/contact\?sent=1/);
});
```

```ts
// tests/e2e/resize.spec.ts  (Review Focus #3)
import { test, expect } from "@playwright/test";

test("resizing through breakpoints mid-page leaves no overlapping sections", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator("[aria-label='Locations']").scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 1500);
  for (const w of [800, 375, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(400);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator("footer")).toBeInViewport();
  // sections stack in document order without overlap
  const tops = await page.locator("main section").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().top + window.scrollY));
  for (let i = 1; i < tops.length; i++) expect(tops[i]).toBeGreaterThanOrEqual(tops[i - 1]);
});
```

```ts
// tests/e2e/a11y.spec.ts  (Review Focus #5)
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const path of ["/", "/about-us", "/services", "/services/nearshore-tech-talent-usa", "/contact"]) {
  test(`${path} has no serious axe violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(3000); // let loader finish
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious.map((v) => [v.id, v.nodes.map((n) => n.target)]), null, 2)).toEqual([]);
  });
}

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
```

```ts
// tests/e2e/reduced-motion.spec.ts
import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });

test("reduced motion: no loader, static 3D fallback, static lists", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-loader]")).toBeHidden();
  await expect(page.locator("section[aria-label='Locations'] canvas")).toHaveCount(0);
  await expect(page.locator("section[aria-label='Locations'] svg path").first()).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});
```

```ts
// tests/e2e/visual.spec.ts — screenshots for human review (not pixel-asserted)
import { test } from "@playwright/test";

for (const path of ["/", "/about-us", "/services", "/services/nearshore-tech-talent-usa", "/contact"]) {
  test(`capture ${path}`, async ({ page }, info) => {
    await page.goto(path);
    await page.waitForTimeout(3500);
    const name = path === "/" ? "home" : path.slice(1).replace(/\//g, "_");
    await page.screenshot({ path: `test-results/visual/${info.project.name}-${name}.png`, fullPage: false });
  });
}
```

Add `data-pinned` to the root element of every component that creates a `pin: true` ScrollTrigger (`NamesCylinder` stage, `Timeline` stage, `LogoStory` stage).

- [ ] **Step 2: Run the full suite and fix what fails**

Run: `pnpm test && pnpm test:e2e`
Expected: PASS on `desktop`, `mobile` and `reduced-motion` projects. Fix any failure at its root (do not loosen assertions). Typical fixes: contrast on `fill: image` display line (switch to `pill`), missing `aria-label` on icon-only links, pin spacers left after navigation (ensure `useGSAP` scopes kill triggers on unmount).

- [ ] **Step 3: Performance check**

```bash
pnpm build && pnpm start -p 3100 &
npx --yes lighthouse@12 http://localhost:3100/ --preset=perf --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility,seo,best-practices --output=json --output-path=./test-results/lh-home.json --chrome-flags="--headless=new"
npx --yes lighthouse@12 http://localhost:3100/about-us --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility,seo --output=json --output-path=./test-results/lh-about.json --chrome-flags="--headless=new"
kill %1
node -e "for (const f of ['home','about']) { const r=require('./test-results/lh-'+f+'.json'); console.log(f, Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)])), 'LCP', r.audits['largest-contentful-paint'].displayValue, 'CLS', r.audits['cumulative-layout-shift'].displayValue) }"
```

Expected: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, LCP < 2.5s, CLS < 0.05. If performance misses: confirm `three` is not in the initial JS (`pnpm build` output / `.next/static/chunks`), hero image has `priority` and correct `sizes`, and the loader doesn't delay LCP (hero image must be painted under the loader).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "test(e2e): navigation, no-JS, resize, accessibility and reduced-motion coverage

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 20: Finish — design review, DESIGN.md, CLAUDE.md, docs update

**Files:**
- Create: `_docs/DESIGN.md` (+ sidecar the documenter produces), `CLAUDE.md`
- Modify: `_docs/content/open-questions.md`, `_docs/specs/2026-10-10-99x-website-phase1-design.md` (record deviations)

- [ ] **Step 1: Run the design detector**

```bash
/Users/flavio/.claude/skills/impeccable/scripts/impeccable detect --json src/app src/components
```

Fix every finding that is a real defect; note intentional ones (e.g. Inter Tight as display face — brief-pinned Helvetica stand-in) in DESIGN.md.

- [ ] **Step 2: Finish review**

Dispatch the `impeccable-finish-reviewer` agent with: the spec path, `_docs/reference/cominvi-design-analysis.md`, `_docs/reference/cominvi-shots/`, and `test-results/visual/*.png`. Apply its material fixes in one batch, re-run `pnpm test && pnpm test:e2e`, confirm once. Do not loop further.

- [ ] **Step 3: DESIGN.md**

Dispatch the `impeccable-documenter` agent to write `_docs/DESIGN.md` from the shipped code (tokens, type scale, components, motion grammar, the final 3D piece grouping, accepted deviations). It must live in `_docs/` (user rule).

- [ ] **Step 4: Write `CLAUDE.md`**

```markdown
# 99x website

Next.js 16 (App Router) + Tailwind v4 + GSAP/ScrollTrigger + Lenis + React Three Fiber. Visual system recreates cominvi.com.mx with 99x content.

## Rules
- All docs and .md files live in `_docs/` (except this file / AGENTS.md).
- Spec: `_docs/specs/2026-10-10-99x-website-phase1-design.md`. Design system: `_docs/DESIGN.md`. Product: `_docs/PRODUCT.md`.
- Content lives in `src/content/en/**` and is validated by `src/content/schema.ts`. Components never import content; pages pass it in.
- Size with the fluid unit (`--u`; Tailwind spacing/type tokens). No raw px except 1px hairlines.
- Register GSAP plugins only in `src/lib/gsap.ts`; use `useGSAP` for every animation; respect `useReducedMotion`.
- Images: add to `scripts/image-manifest.mjs`, run `pnpm images`, reference via `img(path, alt)` with real alt text.
- Unbuilt pages link to https://99x.io (external flag).

## Commands
- `pnpm dev` · `pnpm build` · `pnpm test` · `pnpm test:e2e` · `pnpm typecheck` · `pnpm lint` · `pnpm images`
- Dev component gallery: `/dev/kitchen-sink` (404 in production).
```

- [ ] **Step 5: Update docs**

- `_docs/content/open-questions.md`: add every image swap from Task 4, every new claim phrased in rewritten copy (e.g. "within two working days" in the contact success message, "Top 1% … across three continents"), the group-company list, and a "Launch checklist" (remove 404 link to old site, DNS/Vercel domain, CONTACT_PROVIDER wiring, analytics + consent).
- Spec: add a "Deviations" section: Insights moved to its own Home section (S.07, Trusted by → S.08); 3D fallback is an inline exploded SVG instead of a pre-rendered raster; permanent redirect returns 308.

- [ ] **Step 6: Final verification**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e && pnpm build`
Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "docs: DESIGN.md, CLAUDE.md, open questions and spec deviations

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
