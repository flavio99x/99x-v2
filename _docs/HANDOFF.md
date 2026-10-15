# Handoff: 99x website, after phase 1

Read this first when starting a new Claude session on this repo. It covers where the project stands, how it fits together, what was learned the hard way, and what is left to do.

Last updated: 2026-10-12.

---

## 1. Current state

- **Branch:** `main` is production. Phase 1 was merged from `feat/phase1-website` in PR flavio99x/99x-v2#1. Work on feature branches and open PRs into `main`.
- **Hosting:** Vercel project `99x-v2` in the team *Flávio's projects* (Hobby plan; move to a 99x Pro team before the real launch, since Hobby is non-commercial). It is Git-connected: every push to `main` deploys https://99x-v2.vercel.app, and other branches get preview URLs. The framework is pinned in `vercel.json`.
- **k8s (GitLab, seeds cluster):** prepared but not yet live. `.gitlab-ci.yml` follows the other seeds projects (`seeds/ci-templates` `general/helm.yml`): on `main` it builds the `Dockerfile` (Next standalone, port 3000) into the GitLab registry, syncs `RESEND_API_KEY`/`CONTACT_TO`/`CONTACT_FROM` from GitLab CI/CD variables into the Secret `website-99x-v2-env`, and deploys with the `simple-container-app` Helm chart using `environments/main.yaml` → https://website-99x-v2.k8s.seeds.no (noindex at the ingress). Release/namespace is `website-99x-v2` (a k8s Service name can't start with a digit). One-time setup: push the repo to git.seeds.no, then create the pull secret `website-99x-v2-registry` through `seeds/docker-registry-secret-creator` (PROJECT_NAME and NAMESPACE both `website-99x-v2`).
- **Production env vars:** `RESEND_API_KEY` (sensitive) and `CONTACT_TO` (flavio.troszczanczuk@99x.io). `CONTACT_FROM` is unset, so Resend's test sender `onboarding@resend.dev` is used, which only delivers to the Resend account owner. Verify the 99x.io domain in Resend, then set `CONTACT_FROM` and `CONTACT_TO` to the real inbox. `SITE_INDEXABLE` is unset, so the site is noindex everywhere; set it to `true` only at launch on 99x.io. See `.env.example`.
- **Remote:** `origin` is https://github.com/flavio99x/99x-v2 (public; default branch `main`). `gh` is installed and logged in as flavio99x, so PRs are possible. The repo-local `http.postBuffer` is raised because the first HTTPS push of the ~34 MB history was dropped by the server.
- **Built:** 5 pages, all statically generated:
  - `/`
  - `/about-us`
  - `/services`
  - `/services/nearshore-tech-talent-usa`
  - `/contact`, plus the no-JS result pages `/contact/sent` and `/contact/error`
- **Last verified:**
  - Typecheck passes.
  - Lint has 0 errors and 3 known warnings (see §7).
  - 97/97 unit tests pass.
  - 132/132 e2e tests pass across the desktop, mobile and reduced-motion projects.
  - The build passes.
- **Lighthouse (mobile, `--preset=perf`):** Home scores 95–97 with LCP 1.5s. About scores 98 with LCP 1.5s.
- **Process so far:** brainstorming, then a spec, then a plan, then subagent-driven execution with a review after every task. After that came an impeccable finish review, which led to 8 design fixes, and a final whole-branch review, which led to 12 fixes. Every review is now clean.

## 2. Read in this order

1. `CLAUDE.md` and `AGENTS.md`, at the repo root. These hold the house rules. Next 16 differs from your training data, so check `node_modules/next/dist/docs/` before writing Next code.
2. `_docs/specs/2026-10-10-99x-website-phase1-design.md`. This is the authority. Section 17 lists every way the build deliberately differs from the spec.
3. `_docs/DESIGN.md` and its machine-readable sidecar `_docs/design.json`. Together they describe the design system as built.
4. `_docs/PRODUCT.md`. Product truth: audience, brand commitments, and which facts are confirmed.
5. `_docs/content/open-questions.md`. This lists:
   - facts awaiting confirmation by 99x
   - new copy claims awaiting approval
   - weak images
   - the launch checklist
6. `_docs/reference/cominvi-design-analysis.md` and the screenshots in `_docs/reference/cominvi-shots/`. These are the visual target, since the user pinned the cominvi look.
7. `_docs/content/source/*.md` and `_docs/content/sitemap-current.md`. These hold the extracted content of the current 99x.io site and its full URL inventory, 322 URLs in all.
8. `_docs/plans/2026-10-10-99x-website-phase1-plan.md`. The historical phase 1 plan. It's useful for the reasoning behind decisions, but the code now differs from it in places, so trust the code and spec §17 over it.

## 3. User preferences (binding)

- Docs and `.md` files go in `_docs/`. The only exceptions are `CLAUDE.md` and `AGENTS.md` at the root.
- The visual world is **cominvi.com.mx**: its fonts, colours, structure and motion, filled with 99x content. The single accent is 99x lavender `#C49FD5` / plum `#4A3255`. The logo colours appear only in the logo and the 3D scene.
- Copy may be rewritten freely, but never invent clients, numbers, awards or testimonials. Any new claim goes into `open-questions.md` for approval.
- Content lives in typed TypeScript files. A headless CMS comes later, so components never import content directly.
- English only for now, but the structure must stay ready for a `/no` locale.
- Hosting is Vercel. The contact form goes through a route handler with a pluggable provider; production emails submissions through Resend (`ResendProvider`).
- Unbuilt pages link out to the matching page on `https://99x.io`.
- The user likes the `/superpowers:*` workflow (brainstorm, spec, plan, execute) and `/impeccable` for design work.

## 4. Architecture map

```
src/app/                    routes (page.tsx per route), layout.tsx, globals.css (tokens), api/contact, sitemap/robots, not-found, dev/kitchen-sink
src/content/schema.ts       zod schemas: Page, Hero, 18 section types (discriminated on `type`), Site, Office, Person, Img, Link
src/content/en/site.ts      nav, footer, offices, socials, legal
src/content/en/pages/*.ts   one file per page: meta, hero, sections[], next
src/content/index.ts        static registry; getSite / getPage / getAllPages
src/content/img.ts          img(path, alt) → reads dims from images.json (generated)
src/components/sections/    SectionRenderer (exhaustive switch) → one component per section type; PageView = Hero + sections + NextPage
src/components/ui/          Button/ButtonSm/SectionTag/Eyebrow/Stat/Icon/TickRuler/Toggle/Field/SmartLink
src/components/layout/      Header (Osmo-style bar: menu left, logo centre, contact CTA right; always visible; unfolds into the Menu panel, CSS-driven via [data-nav] in globals.css), Menu (panel contents), Footer, ui-store
src/components/motion/      SmoothScroll (Lenis), PageTransition + TransitionLink, RevealLines, ScrubText, FadeUp, Parallax, PillWipe
src/components/three/       LogoStory (pinned section), LogoScene (R3F, lazy), logoGeometry, storyMath, StaticLogoFallback, lowPower
src/components/forms/       ContactForm, FormResult
src/lib/                    gsap.ts (ONLY place plugins register; house ease), near.ts (whenNear), motion.ts, seo.ts, contact/*, cylinder.ts, geo.ts, fonts.ts
scripts/                    fetch-images.mjs + image-manifest.mjs (pnpm images)
tests/unit/**               vitest (jsdom; route tests use node env pragma)
tests/e2e/**                playwright: desktop / mobile / reduced-motion projects, port 3100
```

**How a page renders:** `app/<route>/page.tsx` calls `getPage(slug)`, then `PageView` renders the `Hero`, then each section through `SectionRenderer`, then the `NextPage` panel. Each page's `next` image equals the next page's hero image, so the transition reads as one continuous image. A contract test enforces this.

**Content contract tests** (`tests/unit/content/pages.test.ts`):
- Every internal link and `#anchor` must resolve to a real route or section.
- Each `next` link must point to a built route and reuse that page's hero image.
- Alt text that looks like a filename is rejected by the schema.

## 5. How to…

- **Add a page.**
  1. Create `src/content/en/pages/<slug>.ts`.
  2. Add the slug to the `PageSchema.slug` enum, register it in `src/content/index.ts`, and add the route to `BUILT_ROUTES` in `src/content/routes.ts`.
  3. Create `src/app/<route>/page.tsx`, copying the pattern from `about-us/page.tsx`.
  4. Switch any nav or footer links in `site.ts` from `external` to internal.
  5. Update the `next` chain.
  6. Add the page to the e2e route lists: seo, no-js, a11y and visual.
- **Add a section type.**
  1. Add the schema and type in `schema.ts` and add it to the `SectionSchema` union.
  2. Add a component in `sections/`.
  3. Add a case to `SectionRenderer`. The `never` check fails typecheck until you do.
  4. Wrap the component in `SectionShell` so it gets `data-theme`, the tag and statement, and the spacing.
- **Add images.**
  1. Add an entry to `scripts/image-manifest.mjs`. Each entry pairs a substring of a source URL in `_docs/content/source/*.md` with an output path.
  2. Run `pnpm images`.
  3. Use `img("folder/name.jpg", "real alt text")` in content.
- **Swap in licensed fonts.** Edit only `src/lib/fonts.ts`: replace the `next/font/google` calls with `next/font/local`, keeping the variables `--font-inter-tight` and `--font-geist-mono`. The licensed faces are Helvetica Now Display 500/700 and PP Supply Mono 300.
- **Contact delivery.** `src/lib/contact/provider.ts`: Resend is used whenever `RESEND_API_KEY` is set (or `CONTACT_PROVIDER=resend`); otherwise `LogProvider`, which writes personal data to the logs, is used. Playwright forces `CONTACT_PROVIDER=log`, so e2e runs never send email. The notification email (subject, HTML and plain text) is built in `src/lib/contact/email.ts`. For a CRM, add another provider there.
- **Check components visually.** Use `/dev/kitchen-sink` (dev only) and `pnpm dev`.
- **Capture screenshots for review.** Full-page screenshots break on transform-pinned sections. Capture viewport by viewport instead: scroll one viewport, wait about 900ms, screenshot. Put captures in `.impeccable/review/`, which is gitignored.

## 6. Gotchas learned the hard way

- **Never kill a process with `pkill`, or by any PID listed on a port.** The Claude desktop app's network helper shows up as connected to dev ports, and one session killed it. Stop only processes that are actually *listening* on the port: `kill $(lsof -ti:<port> -sTCP:LISTEN)`.
- **Stale builds.** Incremental `pnpm build` and the dev server have both served stale CSS. Run `rm -rf .next` before e2e runs and before any performance measurement. Make sure nothing is already running on port 3100, because Playwright will reuse an existing server.
- **GSAP and CSS values.** GSAP silently drops `calc()` and `var()` values for transforms such as `z` and `transformOrigin`. Convert `--u` to pixels instead; `NamesCylinder` measures a probe element and re-reads it on refresh.
- **Pinning and React.** ScrollTrigger pins use `pinType: "transform"`, set as the default in `lib/gsap.ts`. The old menu's page-shell transform that required it is gone, but every pinned section was verified on transform pins, so re-test them all before switching. Always pin an inner element inside a wrapper element that React owns. If React has to remove a node that GSAP wrapped in `.pin-spacer`, it throws a `removeChild` error, for example when reduced motion is toggled.
- **`whenNear` and `useGSAP`.** Setup for below-the-fold motion is deferred until about one screen away. This keeps first-load hydration light, and Home's performance score rose from 84 to 95 because of it. Hero reveals and pinned sections are not deferred. Use the same pattern for new motion.
- **axe checks `aria-hidden` text for contrast too.** Faded decorative text still has to reach 3:1 (large text) unless it is truly invisible. That is why the cylinder's neighbouring names sit at 0.55 opacity and LogoStory's inactive offices at 0.5.
- **React Compiler is on and the `react-hooks` lint rules are strict.** Intentional `setState` calls in effects get a narrowly scoped `eslint-disable` with a reason. `cacheComponents` is off on purpose (Ruling 3).
- **Rate limit in e2e.** The contact limiter allows 5 valid posts per IP in 10 minutes. E2e tests that submit the form set their own `x-forwarded-for` so the three Playwright projects don't share one quota.
- **The browser pane must be visible for motion checks.** A hidden pane pauses `requestAnimationFrame`, so animations only advance when a screenshot is taken.
- **`next/image` with `fill`** needs a sized parent. `Parallax` uses `className ?? "relative"` so callers can pass `absolute inset-0`; `cn` has no tailwind-merge, so conflicting classes don't override each other.
- **Lighthouse on localhost** gives noisy LCP readings under the default throttling. Use `--preset=perf` on a clean build and check real-user data after deploy.

## 7. Known issues and backlog

None of these block merging. They were triaged in the final review and deferred.

**Polish and correctness:**
- One `@next/next/no-img-element` lint warning, for the SVG logo in `Footer` (Header has a scoped disable). Switch it to `next/image` or add a scoped disable.
- Back/forward navigation always scrolls to the top; there is no scroll restoration. `TransitionLink` drops the query and hash when given a `UrlObject` href.
- On arrival, the hash-link scroll offset is measured from the nav bar (`[data-nav-bar]`), which never hides.
- `whenNear` can cause a one-frame flash on `FadeUp` and `NumberedList` blocks that are already in view right after a "next" transition.
- `DisplayLine` with `fill: "image"` and no `image` renders invisible text. The schema needs a refine to prevent that.
- `NumberedList` updates state on every scroll frame. Drive the ruler through a ref instead.
- `Tabs` falls back to the id `"tabs"`, which can duplicate. Use `useId()`.
- `Toggle` uses `key={item}`. Its `aria-controls` points at panels that aren't rendered.
- The `Timeline` screen-reader-only `h2` repeats the visible tag.
- The video lightbox's close button can sit off-screen on short landscape viewports.
- After a successful submit, the contact form doesn't move focus to the confirmation. `/contact/error` shows one generic message for every failure.
- The UI strings "Offices" (LogoStory) and "Next page" (NextPage) are hard-coded. Move them into content before the CMS work.
- The JSON-LD is not escaped for `<`, and the organisation address is hard-coded in `src/lib/seo.ts`. Both must be fixed before CMS content feeds them.
- The motion primitives read the reduced-motion setting once, when they mount. The pinned sections react live.
- On mobile, a faded logo piece can overlap "Kuala Lumpur" in the LogoStory list.
- There's no automated test for `NamesCylinder`, for `Timeline`, or for switching reduced motion back off while the page is open.
- Tooling noise:
  - Vitest warnings about an ESM config in a CJS package, and a redundant `vite-tsconfig-paths`.
  - jsdom is created per test file.
  - `@types/node` is at `^20`.
  - `apple-icon.png` is 192px instead of 180px.

**Design follow-ups** (needs user or design sign-off):
- Contrast-driven values: cylinder neighbours at 0.55, LogoStory inactive offices at 0.5, and NumberedList revealing once instead of scrubbing.
- The Hero gradient is darkened for legibility.
- Weak or reused photos are listed in `open-questions.md`.
- Per-page 1200×630 Open Graph images; the hero photos are reused for now.
- The spec targets 44px toggle tabs; they are about 33px at 375px wide (WCAG AA is met).

**Launch checklist:** in `open-questions.md`, covering:
- domain and DNS
- the contact provider is connected (Resend), but still uses the test sender and a personal inbox; switch to a verified 99x.io sender and the team inbox
- the `x-forwarded-for` and proxy caveat
- analytics and a consent banner
- font licences
- removing the 404 page's link to the old site
- checking external URLs
- real-user LCP data on `/about-us`

## 8. Decisions already made (don't relitigate without the user)

1. The Eyebrow component passes through HTML and `data-*` attributes.
2. Work happens on a feature branch rather than a separate worktree.
3. `cacheComponents` and `partialPrefetching` are off; `reactCompiler` stays on.
4. pnpm is allowed to build `sharp`.
5. A global reduced-motion CSS rule covers transitions too.
6. The video lightbox close button is fixed so it isn't clipped.
7. Name cylinder: screen readers get a full list of names.
8. Proof toggle: has a pause control, and its live region stays silent while it autoplays.
9. Logo sub-paths keep their original colours. The tails are bronze and brown.
10. The active logo piece swings at most about 35° and never goes edge-on.
11. All pinned sections use the wrapper pattern so React can unmount them safely.
12. About's LCP is judged with `--preset=perf`.
13. Insights is its own section on Home (7th), and Divisions is its own section on About (7th).
14. Heroes have no small mono label above the H1.
15. Section tags show only the section title in the black block; the S.01/S.02 numbering was removed (2026-10-11).
16. Header and menu follow osmo.supply (charcoal bar, logo centred, contact CTA always visible, unfolding panel), not cominvi (2026-10-11).

## 9. What to do next

Ask the user which of these they want; don't start on your own.

1. **Launch prep.** Phase 1 is merged and deployed to https://99x-v2.vercel.app (noindex). For the real launch:
   - move the project to a 99x Pro team;
   - add the 99x.io domain;
   - verify the Resend domain and switch `CONTACT_FROM`/`CONTACT_TO`;
   - set `SITE_INDEXABLE=true`.
2. **Content confirmations.** Work through `open-questions.md` with 99x: facts, new claims, group companies and photos.
3. **Adjustments and enhancements to the 5 pages.** These include visual tuning against cominvi with `/impeccable` (polish, critique, animate), the design follow-ups in §7, and items from the backlog.
4. **Phase 2 pages.** The full inventory is in `_docs/content/sitemap-current.md`. A suggested order:
   1. Remaining service pages: Tech Talent Europe, Product Engineering (with its 7 sub-services), Web Solutions, and AI (`/ai-99x`). They reuse existing section types.
   2. Case studies: an index plus a template for about 65 entries. This needs a new section type for the case detail and probably MDX or a CMS.
   3. Insights: blog, news, e-books, webinars and whitepapers, about 150 URLs in all. Pick the CMS before starting these.
   4. Careers, events and legal pages.
   5. Norwegian locale (`/no`), which means adding a `[locale]` segment and `content/no/`.
   6. Redirects from the old URLs: case-mixed paths like `/Insights` and `tech-experts-Europe`, and the bare folder pages.
5. **Platform.** CMS selection (Sanity, Payload or Storyblok) behind the existing content seam, a real contact provider, analytics with consent, and a distributed rate limiter such as Upstash.

**Suggested workflow for each new piece:** `/superpowers:brainstorming`, then a spec in `_docs/specs/`, then a plan in `_docs/plans/`, then subagent-driven execution. For visual work, use `/impeccable`, with cominvi pinned as the visual world. Keep running `pnpm typecheck && pnpm lint && pnpm test && rm -rf .next && pnpm test:e2e` until everything is green before calling anything done.
