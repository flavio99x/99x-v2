# 99x Website — Phase 1 Design Spec

- **Date:** 2026-10-10
- **Status:** Approved in brainstorming, pending written-spec review
- **Scope:** 5 pages — Home, About us, Services, Nearshore Tech Talent USA, Contact
- **Related:** [cominvi design analysis](../reference/cominvi-design-analysis.md) · [Content source (current 99x.io)](../content/source/) · [Current sitemap](../content/sitemap-current.md) · [Open content questions](../content/open-questions.md) · [Product context](../PRODUCT.md)

---

## 1. Intent

**Outcome.** Replace 99x.io (Enonic XP + react4xp; weak structure, design and content hygiene) with a new site. Phase 1 ships 5 pages; the remaining ~300 URLs follow in later phases.

**Audience & job.** Decision-makers at companies (Nordics, Europe, US) evaluating a partner for product engineering, nearshore tech talent, web solutions or AI. The site presents 99x as a **global brand** and generates **leads across all markets** (contact form + division emails).

**Success criteria.**
- The 5 pages are live on Vercel and visually match the cominvi.com.mx system (fonts, colours, structure, motion), populated with 99x content.
- A visitor can understand what 99x does, see proof, and contact the right team within one page.
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95. LCP < 2.5s, CLS < 0.05. WCAG 2.2 AA.
- Content lives in typed files, decoupled from components so a headless CMS can replace it without component changes.

**User decisions (binding).**
| Topic | Decision |
|---|---|
| Visual base | cominvi.com.mx: fonts, colours, structure, motion — "everything" — with 99x content |
| Colour | cominvi system (ink / white / pale tint / ONE accent); accent = 99x lavender/plum; logo colours only in logo/3D |
| Fonts | cominvi's fonts or similar → free stand-ins behind one token (licensed originals can be dropped in later) |
| 3D logo | One pinned scroll story (Home) |
| Copy | Rewrite freely; keep facts; no invented commercial claims (clients, numbers, awards, testimonials) |
| Content storage | Typed TypeScript files in repo |
| Languages | English now; routes/content i18n-ready for `/no` later |
| Hosting / form | Vercel; contact form → Next.js route handler with pluggable provider (wired later) |
| Unbuilt pages | Full future menu shown; unbuilt items link out to the matching 99x.io page |
| Architecture | Approach A: App Router, static RSC pages, client-only motion islands, R3F lazy-loaded |
| Docs | All docs/.md go in `_docs/` (except CLAUDE.md / AGENTS.md) |

**Anti-goals.** No Barba/SPA shell. No CMS in phase 1. No Lottie. No MapLibre. No carousel of all 61 case studies. No events block. No invented stats or testimonials.

---

## 2. Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, pnpm
- Tailwind CSS v4 (tokens via `@theme`)
- GSAP 3.13+ (ScrollTrigger, SplitText, CustomEase, Flip — all free since 3.13) + Lenis
- three + @react-three/fiber + @react-three/drei (Home 3D section only, dynamically imported)
- zod (content schema + form validation)
- Vitest + Testing Library; Playwright + @axe-core/playwright
- Deploy: Vercel

---

## 3. Information architecture & routes

| Page | Route | Notes |
|---|---|---|
| Home | `/` | |
| About us | `/about-us` | same as today |
| Services | `/services` | same as today |
| Nearshore Tech Talent USA | `/services/nearshore-tech-talent-usa` | same as today |
| Contact | `/contact` | 301 from `/about-us/contact-us` |

**Next-page chain** (full-screen panel at the end of each page): Home → About → Services → Nearshore USA → Contact → Home.

**Menu (full future IA).** Built routes link internally; everything else links to the 99x.io equivalent (opens same tab, plain link). Structure mirrors current nav, regrouped:
- What we do: Services overview, Nearshore Tech Talent USA, Nearshore Tech Talent Europe*, Product Engineering*, Web Solutions*, AI*
- Knowledge: Case studies*, Insights*, Events*
- Company: About us, Careers*, Contact
- Language: EN (active) / NO* (links to 99x.io/no until built)
- Social: LinkedIn, YouTube

`*` = external link to 99x.io in phase 1. A single `site.ts` map controls internal vs external per item, so flipping an item to internal later is a one-line change.

**i18n readiness.** Content is keyed by locale (`content/en/...`); a `getContent(locale)` accessor is used by pages. Phase 1 only registers `en` and serves it at the root (no `/en` prefix). Adding `/no` later = new content folder + `[locale]` segment, no component changes.

---

## 4. Project structure

```
src/
  app/
    layout.tsx               root layout: fonts, Header (renders Menu inside), Footer, SmoothScroll, PageTransition, Loader
    page.tsx                 Home
    about-us/page.tsx
    services/page.tsx
    services/nearshore-tech-talent-usa/page.tsx
    contact/page.tsx
    api/contact/route.ts     POST: zod validate → honeypot + rate limit → provider.send()
    sitemap.ts, robots.ts, opengraph-image assets, not-found.tsx
  content/
    schema.ts                zod schemas + inferred types for every section/page
    index.ts                 getContent(locale) / getPage(locale, slug)
    en/site.ts               nav, footer, offices, socials, legal, contacts
    en/pages/{home,about,services,nearshore-usa,contact}.ts
  components/
    ui/        Button, ButtonSm, SectionTag, Eyebrow, Stat, Card, Toggle, TickRuler, Field, Icon
    sections/  Hero, Statement, StatsGrid, CardGrid, StickySplit, NumberedList, DisplayLine,
               CaseCards, ProofToggle, NamesCylinder, Timeline, OfficeRows, PeopleGrid,
               ContactBlock, WorldDotMap, NextPage, LogoStory
    layout/    Header, Menu, Footer, PageTransition, Loader, SkipLink
    motion/    SmoothScroll, RevealLines, ScrubText, FadeUp, Parallax, PillWipe, useReducedMotion
    three/     LogoScene, LogoPieces, logoGeometry (SVG → ExtrudeGeometry), StaticLogoFallback
  lib/         gsap.ts (register plugins, eases), fonts.ts, contact/provider.ts, rate-limit.ts, utils
  styles/      globals.css (Tailwind v4 @theme tokens, fluid scale)
public/        logos (svg), images (optimised 99x photography), og images, fallback logo render
_docs/         spec, plans, content inventory, open questions, reference, PRODUCT.md, DESIGN.md
tests/         unit (vitest), e2e (playwright)
```

**Boundaries.**
- Pages = composition only: fetch page content, map to section components. No styling logic in pages.
- Sections receive typed props; they never import content. This is the CMS seam.
- Sections are Server Components. Interactivity/motion lives in small `"use client"` wrappers (`motion/*`, `Toggle`, `Menu`, `Header`, `PageTransition`, `LogoStory`, `ContactForm`).
- `lib/gsap.ts` is the only place GSAP plugins are registered.

---

## 5. Design system (cominvi system, 99x accent)

### 5.1 Colour tokens
| Token | Value | Role (cominvi origin) |
|---|---|---|
| `ink` | `#160F17` | text, dark sections, buttons, loader, menu layer (`#151515`) |
| `paper` | `#FFFFFF` | light sections, cards, footer |
| `tint` | `#EFE8F3` | alternate section bg, team/office cards (`#EBF0ED`) |
| `accent` | `#C49FD5` | hover fills (service cards, small buttons), menu-open icon, active language, map pins, next-page arrow tile (`#F47920`) |
| `accent-deep` | `#4A3255` | accent on white (links/social), gradient end for pill wipe (`#B55109` / orange) |
| `logo-*` | `#A2B372 #C49FD5 #CCB189 #BC8E58 #905B54 #B44B4B #7A6977` | logo + 3D scene only |

- Text hierarchy by opacity steps: `/15 /30 /50 /60` on ink or paper — not extra greys.
- Hairlines: 1px at ink/20, ink/30, ink/50; on dark: paper/20.
- Pill wipe gradient: `linear-gradient(90deg, ink, accent-deep)`.
- Lavender is a **fill** colour only; never body text on white (contrast). Ink on lavender ≈ 9:1.
- `color-scheme: light`. Dark/light comes from section alternation, not a theme toggle.

### 5.2 Typography
- **Display & body:** Inter Tight — weights 700 and 500 only (cominvi: Helvetica Now Display Bold/Medium). Chosen as the closest open-licence neo-grotesk to the pinned Helvetica Now; the brief pins this look.
- **Labels:** Geist Mono — weight 300, UPPERCASE (cominvi: PP Supply Mono Light).
- Loaded via `next/font` (self-hosted, `display: swap`), exposed as CSS vars `--font-display`, `--font-mono`. Swapping to licensed originals = edit `lib/fonts.ts` only.

| Role | Font/weight | Size / LH | Tracking |
|---|---|---|---|
| Hero H1 | display 700 | 3.5em / 1.1 | 0 |
| Display XXL | display 700 | 7em / 0.8 | -0.025em |
| Statement | display 700 | 3em / 1.0 | -0.01em |
| Next-page title | display 500 | 3.5em / 1.0 | 0 |
| H2 | display 700 | 2em / 1.0 | 0 |
| Card title | display 700 | 2em / 1.1 | -0.025em |
| Stat number | display 700 | 2.5em / 1.0 | -0.01em |
| Menu link | display 700 | 2em / 0.9 | -0.0075em |
| Body M | display 700 | 1.25em / 1.1 | 0 |
| Body S | display 700 | 1em / 1.2 | 0 |
| Footer link | display 500 | 1em / 1.4 | 0, opacity .6 |
| Eyebrow M | mono 300 | 0.75em / 1 | uppercase |
| Eyebrow S | mono 300 | 0.7em / 0.9 | uppercase |
| Button label | mono 300 | 0.813em / 0.8 | uppercase |
| Form label | display 700 | 1.5em | sub-hint 1em @ .5 |

Headings sentence case; only mono labels uppercase. Long-form paragraphs (rare) may use 500 for readability — decided at build, recorded in DESIGN.md.

### 5.3 Fluid scale, grid, spacing
- `body { font-size: var(--size-font) }`; everything else in `em`. 1em = 16px at 1440px viewport.
  - ≥992: design width 1440, viewport clamp 992–1920
  - 768–991: design width 834
  - 480–767: design width 550
  - <480: design width 390
- Full-bleed, no max container. Site margin 2em (1em ≤991).
- 12-col grid, 1em gutter. Common spans: 8+4; widths 28em, 35.25em (5 col), 42.375em (6 col), 57em (8 col).
- Section padding: 2em top / 16em bottom; 16em row gap inside sections (12em variant).
- Hero: `100svh`.
- Radii: 2px (small button), 4px / .25em (tags, hero mini cards), 8px / .5em (cards, images, buttons). No shadows. No gradients except pill wipe.

### 5.4 Components
- **Button** — ink bg, radius .5em, ~40px tall, mono label + 2em paper arrow square (4px inset). Hover: content slides +2.25em (0.5s, house ease), revealing an accent arrow square from the left. Variants: light (paper), xl, next (accent arrow tile).
- **ButtonSm** — paper pill, radius 2px, 1.75em tall, mono label + small ▸. Hover: bg → accent, content slides.
- **SectionTag** — stacked: outlined `S.0X` box over filled ink `SECTION NAME` box (radius .25em, 1px ink border, mono). Floats inline before a section's opening statement.
- **Eyebrow** — mono uppercase label, sizes M/S.
- **Stat** — 3em line icon, number, mono label, 1px top rule ink/20.
- **Card** — `service` (paper, square, radius .5em, padding 2em, icon top-left, title bottom-left; hover → accent fill + description reveal), `tint` (2:1), `dark` (ink, portrait 179/220; hover reveals description), `hero-mini` (216×144, radius 4px, paper/20 border, ButtonSm).
- **Toggle** — segmented `01/02/03`, ink bg, radius .5em, padding .25em, sliding paper indicator 2.125em. Variants: tint, paper. Keyboard: arrow keys, `role="tablist"`.
- **TickRuler / TickDial** — 1px ticks, widths .75/.875/1/1.25/1.5em, opacity .2→.75; fills with scroll progress.
- **Field** — bottom border only (1px ink), padding 1.5em 0, display 700 1em text; label 1.5em with .5 sub-hint; inline error in mono.
- **Icon** — inline SVG, 1.5px stroke, monoline.
- Links: no underline; hover via opacity/slide; visible `:focus-visible` ring (2px accent-deep offset 2px).

### 5.5 Header, menu, footer
> Header and menu superseded on 2026-10-11 by the Osmo-style nav bar; see §17.

- **Header**: fixed, 1.5em from top, 2em side insets. Left: logo pill (logo tile + wordmark box). Right: "Menu" label + 48px circle button (1px border, two bars). Hides on scroll down (logo slides left, menu slides right, 0.5s); returns on scroll up. Theme switches per section under it via `data-theme` on sections (`dark | paper | tint`).
- **Menu (desktop)**: page container translates down (~470px) and insets into a rounded card revealing the ink layer: three columns of 2em links + language + socials. Icon becomes accent circle with ×. Link hover slides in an arrow. Focus trap, Esc closes, `aria-expanded`, body scroll lock (Lenis stop).
- **Menu (mobile)**: full-screen ink layer, stacked links, same motion vocabulary.
- **Footer**: paper. Left: logo + socials. Columns with outlined mono tags (WHAT WE DO / KNOWLEDGE / COMPANY / CONTACT); links display 500 1em @ .6. Contact column: Oslo HQ address, hello.norway@99x.io, +47 24 07 70 11. 12em gap, hairline, centred copyright + legal (Transparency Act, Privacy policy, Cookie policy → 99x.io).

---

## 6. Page compositions

Every page: dark hero → numbered `S.0X` sections alternating paper/tint → NextPage panel → Footer. Copy below is direction; final copy lives in content files and is reviewed as part of implementation. Facts marked † are pending confirmation in [open-questions](../content/open-questions.md).

### 6.1 Home `/`
1. **Hero** (ink, 100svh) — full-bleed 99x team photo/video, parallax (120% scale). Two-line H1 bottom-left: *"We build digital products, scale engineering teams and put AI to work."* Mono metric right: `SINCE 2000 / 600+ PEOPLE`†. Bottom-right: 2 hero-mini cards → Services, AI at 99x (external).
2. **S.01 About** (paper) — SectionTag + scrub-text statement (8 col). Portrait photo (5 col, radius .5em) + 2×2 StatsGrid: 20+ years†, 600+ people†, 5 countries†, 100+ companies transformed. Paragraph + Button → About.
3. **S.02 What we do** (tint) — statement + CardGrid 3×2: Product Engineering, Web Solutions, Tech Talent Europe, Tech Talent USA, AI, + one photo tile. Hover accent + description. Button → Services.
4. **S.03 One company, five countries†** (paper) — **LogoStory** (§7.3). Pinned.
5. **S.04 AI** (paper, hairline separator) — statement + StickySplit: image/video left; *"Smarter teams, smarter products"* + Button (→ 99x.io/ai-99x) pinned right.
6. **S.05 Proof** (tint) — statement + DisplayLine XXL *"100+ companies transformed"* with PillWipe + mono subline. CaseCards: 3 dark cards (curated†) → 99x.io case pages. Button "All case studies".
7. **S.06 Why 99x** (paper) — mono subline + ProofToggle 01/02/03 cycling: 90% of clients say expectations met or exceeded; top 1% of talent; 100+ companies transformed — large centred text with char reveal. Then 3 tint cards: latest insights (→ 99x.io).
8. **S.07 Trusted by** (paper) — statement + **NamesCylinder** of 32 client names (from current "Trusted by" logos), pinned, scroll-rotated rotateX; centre item ink, others fade; tick rulers on both edges.
9. **NextPage** → About.

Dropped vs current: events block (stale), empty events component, 61-item carousel.

### 6.2 About us `/about-us`
1. **Hero** — group photo; H1 *"Advisors, builders, innovators."*
2. **S.01 This is 99x** — statement + offset images; play button opens the 99x YouTube film (`0O8WkFGaLw4`) in an accessible lightbox (youtube-nocookie, loaded on click).
3. **S.02 Norwegian values, global capacity** — DisplayLine XXL with photo-filled text (`background-clip: text`) + short paragraph.
4. **S.03 Our journey** — **Timeline**: pinned full-screen; 4 digit columns spell the year over full-bleed photos; centred caption. 7–8 milestones curated from the 17 (2000 Eurocenter Sri Lanka → 2026 Increo joins; list in content file, confirm†).
5. **S.04 How we work** — Toggle 01/02/03 (Trusted partner / Ways of working / Culture): paper text card beside photo collage.
6. **S.05 Global presence** — **OfficeRows**: hairline table rows — index, city, country, email (hello.<country>@99x.io)†.
7. **S.06 The 99x group** — NamesCylinder of group companies† + 4 division cards (Product Engineering, Tech Talent Europe, Tech Talent Americas, Web Solutions) with distinct copy.
8. **S.07 Leadership** — PeopleGrid: 8 portraits, name, role (mono).
9. **NextPage** → Services.

### 6.3 Services `/services`
1. **Hero** — *"Stay ahead in a fast-moving tech landscape."*
2. **S.01** — statement + 4 division service cards (anchor-link to blocks below).
3. **S.02–S.05** — one block per division (Nearshore USA, Nearshore Europe, Product Engineering, Web Solutions): StickySplit image + **NumberedList** of sub-services (lines fade .2→1 with scroll, horizontal tick progress), Button → division page (internal for USA, external otherwise). USA and Europe get distinct copy (currently duplicated).
   - Product Engineering subs: Full lifecycle engineering, Artificial intelligence, Quality engineering & test automation, Cloud consulting, Product discovery, Due diligence assessments, Optimaxer AI Web.
   - Europe subs: Software development, QA & testing, Cloud engineering, Data science & AI.
   - Web Solutions subs: E-commerce.
   - USA: Staff augmentation, Web apps, Mobile, AI & data.
4. **NextPage** → Nearshore Tech Talent USA.

### 6.4 Nearshore Tech Talent USA `/services/nearshore-tech-talent-usa`
1. **Hero** — *"Scale your engineering team with AI-enabled nearshore engineers."* Hero-mini cards: Engagement models (anchor), Talk to us (anchor).
2. **S.01 Engineering partners** — statement + StatsGrid: 60+ senior engineers, 15+ years with US companies, 4.9/5 Clutch (50+ reviews), eNPS 93.
3. **S.02 Engagement models** — 4 service cards (Staff augmentation, Web apps, Mobile, AI & data), hover reveal.
4. **S.03 Future-proof with AI** — StickySplit → 99x.io/ai-99x.
5. **S.04 Why choose us** — NumberedList rows with hairlines (4 items).
6. **S.05 Customer stories** — 4 dark CaseCards (tech-experts case studies → 99x.io).
7. **S.06 Talk to Thiers Santos** — ContactBlock: person card (photo, role, email) + shared ContactForm (`source: "nearshore-usa"`).
8. **NextPage** → Contact.

### 6.5 Contact `/contact`
- Two columns (desktop): left sticky **WorldDotMap** (static SVG dot-matrix, 5 office pins in accent, labels on hover/focus); right column 28em: *"Let's talk"*, ContactForm.
- Below: division emails (mono labels: PRODUCT ENGINEERING / TECH TALENT EUROPE / TECH TALENT AMERICAS / WEB SOLUTIONS); key people (5 contacts, name, role, email, phone where public); OfficeRows; careers & internships → careers@99x.io.
- Mobile: map collapses to a non-sticky band above the form.
- **NextPage** → Home.

---

## 7. Motion & 3D

### 7.1 Engine
- `lib/gsap.ts`: registers ScrollTrigger, SplitText, CustomEase, Flip; defines `house` ease = `CustomEase.create("house", "M0,0 C0.6,0 0,1 1,1")` (≈ `cubic-bezier(.6,0,0,1)`). Defaults: reveal 1.2s, hover 0.5s, card 0.8s `power2.out`.
- `SmoothScroll` (client, root layout): one Lenis instance on the window (`lerp: .125`, `smoothWheel: true`, `syncTouch` off by default), driven by `gsap.ticker`; `lenis.on('scroll', ScrollTrigger.update)`. Native scroll semantics preserved (no wrapper scroller).
- `useReducedMotion`: when `prefers-reduced-motion: reduce` → Lenis not created, no pins/scrubs, reveals become 0.2s opacity fades, LogoStory shows static fallback, NamesCylinder/Timeline render as static lists.
- All client motion uses `useGSAP` (scoped contexts, auto-revert on unmount/route change).

### 7.2 Effects inventory
| Effect | Component | Spec |
|---|---|---|
| Loader | `Loader` | Ink screen; logo tile appears centred, expands to full logo pill, paper square scales out; ~1.1s fade. First visit per session only (`sessionStorage`, try/catch); never on internal navigation; dispatches `loader:done` which gates hero reveal. |
| Hero line reveal | `RevealLines` | SplitText lines in overflow-hidden masks, yPercent 110→0, 1.2s house, stagger .03; eyebrows from 130%; hero-mini cards from 110/120% at +0.5s. |
| Statement scrub | `ScrubText` | Chars start opacity .2 → 1, scrubbed per line between `top 85%` and `top 50%`, stagger .02. Parent keeps `aria-label` with full string; split spans `aria-hidden`. |
| Card fade-up | `FadeUp` | autoAlpha 0→1, y 2em→0, 0.8s power2.out, once at `top 85%`, batched. |
| Pill wipe | `PillWipe` | Gradient pills behind XXL words, width 0→100%, 2s, stagger .025. |
| Parallax | `Parallax` | Media at 120% scale, yPercent ±10 scrubbed. |
| Header hide/theme | `Header` | Direction-based hide; theme from section `data-theme` under header via ScrollTrigger toggles. |
| Menu | `Menu` | Page container y + inset + radius (1.2s house); bars → ×. |
| Names cylinder | `NamesCylinder` | Pinned; items on a rotateX cylinder (perspective), scrubbed; centre item ink, others opacity by angle; edge tick rulers. |
| Timeline | `Timeline` | Pinned; per milestone, digit columns roll (yPercent), image crossfade, caption swap. |
| Sticky split / numbered list | `StickySplit`, `NumberedList` | CSS sticky + scrubbed line opacity .2→1 + tick progress. |
| Proof toggle | `ProofToggle` | yPercent 100→0, 0.6s, stagger .05; manual + auto-advance (paused on hover/focus, off under reduced motion). |
| Next page | `NextPage` + `PageTransition` | Full-viewport parallax image + sticky centred Button (accent arrow tile + next page name). Click → scroll panel to top (Lenis, ~1s house) → navigate → new page's hero starts already revealed in same image framing. |

### 7.3 LogoStory (3D)
- **Geometry**: `logoGeometry.ts` parses `public/brand/99x-logo.svg` with three's `SVGLoader`, extrudes each path (`ExtrudeGeometry`, small depth, light bevel), centres geometry. The logo has ~9 paths in 7 colours (two rings, the "9" tails, the "x" strokes); these are grouped into **5 pieces** (one per office) — exact grouping chosen at build by visual check and recorded in DESIGN.md.
- **Material/lighting**: `MeshPhysicalMaterial` per logo colour (satin: roughness ~.45, clearcoat ~.3), studio-style lighting (drei `Environment` with a small local HDR or `Lightformer`s — no remote fetch), transparent canvas over paper section.
- **Scroll mapping**: section pinned ~500svh, 5 steps + assemble/disassemble bookends. Step *n*: piece *n* moves to centre & rotates into view; other pieces drift outward and dim. Left: office list (active full opacity, others .15). Right: mono data `OSLO [NO] · 59.91°N 10.75°E` + office email. Centre: TickDial fills with progress. End: pieces reassemble → crossfade to 2D logo.
- **Pointer**: subtle tilt (±6°) toward pointer, desktop + fine pointer only.
- **Perf**: `next/dynamic` with `ssr: false`; import triggered by IntersectionObserver at ~150vh before the section; `frameloop="demand"`, invalidated only by scroll/pointer while in view; `dpr={[1, 1.75]}` (mobile max 1.5); renders nothing off-screen.
- **Fallback**: no WebGL / reduced motion / `navigator.hardwareConcurrency <= 4` with save-data → `StaticLogoFallback` (pre-rendered PNG/AVIF of the exploded logo) + static office list. Mobile gets simplified 3D (no pointer, lower dpr).

### 7.4 Page transitions
`PageTransition` (client, root layout) intercepts internal `<a>` clicks via a `TransitionLink` component (wraps `next/link`): play exit (default: 0.6s ink overlay fade-in; NextPage: scroll-and-reveal) → `router.push` → on pathname change: kill/refresh ScrollTriggers, `lenis.scrollTo(0, {immediate:true})` (unless hash), play enter. Browser back/forward: quick fade only. External links bypass entirely.

---

## 8. Content model

- `content/schema.ts` defines zod schemas per section type (`hero`, `statement`, `stats`, `cardGrid`, `stickySplit`, `numberedList`, `displayLine`, `caseCards`, `proofToggle`, `namesCylinder`, `timeline`, `officeRows`, `peopleGrid`, `contactBlock`, `nextPage`, `logoStory`) and a `Page` type = `{ slug, meta, theme, sections: Section[] }` (discriminated union on `type`).
- Pages render via a `SectionRenderer` that maps `type` → component. Section order lives in content, not in page files → CMS-ready.
- `site.ts`: nav (with `href` + `external` flag), footer columns, offices (city, country, code, lat/lng, email), socials, legal, division contacts, people.
- Links typed as `{ label, href, external? }`. A unit test asserts every internal href resolves to a built route.
- Images: `{ src, alt, width, height }`; alt text required by schema (fixes current filename-as-alt problem).
- Copy is rewritten per §1; any new factual claim is tagged in [open-questions](../content/open-questions.md) until confirmed.

---

## 9. Contact form

- Fields: name*, email*, company, phone, message*, consent* (privacy policy → 99x.io), hidden honeypot, hidden `source` (page id).
- Client: progressive enhancement — native `<form action="/api/contact" method="post">` works without JS; with JS, `fetch` + inline states: idle → submitting → success (replaces form with confirmation + division emails) / error (message + mailto fallback). Field-level errors announced via `aria-live`, `aria-invalid`, `aria-describedby`.
- Server (`app/api/contact/route.ts`): zod validation (same schema shared with client), honeypot → silent 200, rate limit (in-memory per IP for phase 1; upstash later), `provider.send(payload)`.
- `lib/contact/provider.ts`: interface `{ send(msg): Promise<void> }`. Phase 1 implementation = `LogProvider` (logs server-side, returns ok). Resend/HubSpot adapters added later, selected by env `CONTACT_PROVIDER`.
- No reCAPTCHA in phase 1 (honeypot + rate limit); revisit if spam appears.

---

## 10. SEO, metadata, redirects

- Per-page `generateMetadata` from content: title pattern `"<Page> — 99x"`, description, canonical, OG/Twitter (1200×630 per page in `public/og/`). `og:site_name = "99x"`.
- `sitemap.ts` lists the 5 routes; `robots.ts` allows all, points to sitemap. (Preview deployments: `noindex` via env.)
- JSON-LD `Organization` (name, url, logo, sameAs LinkedIn/YouTube, address Oslo) in root layout.
- `next.config` redirects: `/about-us/contact-us` → `/contact` (301). Further redirects added as the old IA is migrated.

---

## 11. Accessibility

WCAG 2.2 AA: landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, logical heading order, skip link, visible focus, 44px minimum targets, menu focus trap + Esc + `aria-expanded`, Toggle as tablist with arrow-key support, lightbox as modal dialog, split text accessible via parent `aria-label`, pinned sections keep DOM reading order, reduced-motion honoured globally, colour contrast verified (lavender never as text on white), form errors announced.

---

## 12. Performance

- Budget (mobile Lighthouse): Perf ≥ 90, LCP < 2.5s, CLS < 0.05, TBT < 200ms.
- All pages statically generated. Hero image `priority` with `next/image` AVIF/WebP and explicit sizes.
- JS: GSAP + Lenis shared chunk; three/R3F only on Home, lazily. No jQuery, Lottie, MapLibre.
- Fonts: 2 families, subset latin, `display: swap`, preloaded.
- Video (if used in hero): muted, `playsinline`, poster image is the LCP element, source loaded after `loader:done`.

---

## 13. Testing

- **Unit (Vitest)**: content parses against schema for every page; all internal links resolve; contact zod schema; route handler (valid → provider called; honeypot → 200 without send; invalid → 400 with field errors; rate limit → 429).
- **E2E (Playwright)**: each route renders `h1` and NextPage; menu open/close via mouse + keyboard (Esc, focus trap); contact form happy path + validation errors (provider mocked); reduced-motion project (`reducedMotion: 'reduce'`) shows static fallbacks; `/about-us/contact-us` redirects; axe scan per route (no serious/critical violations); screenshots at 1440×900 and 375×812.
- **Manual/visual**: side-by-side comparison against cominvi screenshots for each ported pattern (header, menu, button, section tag, statement reveal, cards, cylinder, next page).

---

## 14. Assets

- 99x logo SVGs (colour, hover, white) → `public/brand/`.
- Photography: download from current 99x.io pages, re-encode (AVIF/WebP via `next/image`), store under `public/images/<page>/`; every image gets a real alt text. A list of weak/placeholder images to replace goes in open-questions.
- 3D fallback render generated from the built scene at build time (one-off script) → `public/brand/logo-exploded.avif`.
- Icons: hand-authored 1.5px SVG set (stats, services).

---

## 15. Documentation deliverables (`_docs/`)

- `specs/2026-10-10-99x-website-phase1-design.md` — this file
- `plans/2026-10-10-99x-website-phase1-plan.md` — implementation plan (next step)
- `PRODUCT.md` — product context (impeccable)
- `DESIGN.md` — design system as built (written at finish from the shipped code)
- `content/sitemap-current.md` — current 99x.io sitemap (322 URLs) + missing pages
- `content/source/*.md` — extracted current content for the 5 pages + nav/footer/assets
- `content/open-questions.md` — facts and assets to confirm
- `reference/cominvi-design-analysis.md` — design reference breakdown

---

## 16. Out of scope (phase 1)

Remaining ~300 pages (case studies, insights, careers, events, other service pages, AI page, legal), Norwegian locale, CMS, email/CRM provider wiring, analytics/consent banner (add with first tracking tool), search, reCAPTCHA.

---

## 17. Deviations (as built)

- Insights own Home section (7th; Trusted by moves to 8th); About divisions own section (7th; Leadership moves to 8th).
- No mono kicker on heroes.
- The 3D fallback is an inline exploded SVG, not a pre-rendered raster.
- The permanent redirect returns 308.
- Names-cylinder neighbour opacity is .55 and LogoStory inactive is .5, for contrast.
- NumberedList reveals once.
- Below-the-fold motion setup is deferred via `whenNear` (`src/lib/near.ts`) for performance.
- `cacheComponents` is disabled.
- Logo pieces keep their original per-path colours.
- About LCP was measured with Lighthouse `--preset=perf`.
- OG images reuse each page's hero photo (no bespoke 1200×630 artwork yet).
- Toggle tabs are ~33px tall at 375px (WCAG 2.2 AA 24px target size met; the spec's 44px target is deferred).
- Contact posts without JavaScript redirect to static `/contact/sent` and `/contact/error` pages (noindex, not in the sitemap), so `/contact` stays static; with JS the form uses the JSON API and shows inline feedback.
- **Header and menu (2026-10-11, user request):** replaced by an Osmo-style (osmo.supply) nav bar. A charcoal (`#201d1d`) bar with the menu button left, the colour logo once in the centre and an always-visible "Contact us" CTA right; no hide on scroll, no section-theme recolouring. Opening widens the bar to full width and unfolds the menu panel beneath it (three link columns plus a lavender contact card); the page behind dims to 30% charcoal instead of the page-shell push-down. Timings and easing (`cubic-bezier(0.625,0.05,0,1)`, 0.6s/0.9s) copy Osmo's. The CTA uses Osmo's rotating-label hover.
- **Section index removed (2026-10-11, user request):** sections no longer carry S.01/S.02 numbering; the SectionTag is the label alone in a black block, and `head.index` is gone from the schema.
