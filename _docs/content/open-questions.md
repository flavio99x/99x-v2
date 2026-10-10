# Open content questions

Facts the current 99x.io contradicts or leaves unclear. None block the build: placeholders use the current-site value and are marked † in the spec until confirmed.

## Facts

| # | Question | Current site says | Used for now |
|---|---|---|---|
| 1 | Years in business | "20+ years" (home) vs "15+ years" (Nearshore USA — likely the Brazilian partner's US track record) | 20+ (company), 15+ (USA page, scoped to US work) |
| 2 | Global reach | "5 continents" (home) vs "top 1% across 3 continents" (home) | "5 countries" |
| 3 | Current offices | Map: Oslo, Colombo, Algés, Vitória, Kuala Lumpur. Text: Norway, Sweden, Sri Lanka, Portugal, Brazil | The 5 map offices |
| 4 | Office emails | hello.<country>@99x.io per office | As listed on About map |
| 5 | People count | 600+ employees (home) vs 11 companies, 600+ people (2026 timeline) | 600+ |
| 6 | Group companies list | Not extracted (`/about-us/other-99x-group-companies`) | To extract |
| 7 | Timeline | 17 milestones 2000–2026 | Curate 7–8; need approval of the selection |
| 8 | Leadership | 8 group leaders on About | As listed |
| 9 | Contact people | 5 contacts with emails/phones | As listed (confirm still current) |
| 10 | Nearshore USA contact | "Talk to Thiers Santos" | As listed |

## Curation choices

- Which 3 case studies feature on Home (S.05)?
- Which 4 case studies feature on Nearshore USA (currently 4 tech-experts stories)?
- Which 3 insights feature on Home (current ones include an external ft.lk news item and fliphtml5 flipbooks)?
- The 32 client names for "Trusted by": confirm all are still approved for public use.

## Assets

- Hero media for Home: is there 99x team/office video footage, or do we use a photo?
- Photos with filename alt text / low quality (e.g. "ChatGPT Image Jun 25…", "IMG_0654", "image (3)") need replacement or confirmation.
- Image review (Task 4): no swaps were needed; all 45 downloaded images fit their roles. Weak or caveated: `about/t-2021.jpg` is a logo lockup (99x + Seeds), not a photo; `home/insight-mcp.jpg` is a webinar poster with baked-in text; `home/case-boligmappa.jpg` and `nearshore-usa/case-cre.jpg` are generic stock; `services/product-engineering.jpg` is an event stage photo (source filename IMG_0654); `nearshore-usa/hero.jpg` shows horizontal banding (likely a screen photo); `people/thiers-santos.jpg` has a small watermark bottom right; `people/steinar-magnussen.jpg` and `people/guilherme-ramos-pereira.jpg` have busy backgrounds unlike the plain studio portraits. Request replacements from 99x if wanted.
- Brief said 46 images; the manifest contains 45 entries (all fetched).
- Fonts: if 99x wants the exact cominvi look, license Helvetica Now Display (Monotype) + PP Supply Mono (Pangram Pangram). Until then: Inter Tight + Geist Mono.

## Copy

All copy is being rewritten. New wording that implies a new factual claim will be listed here for approval before launch.

## New claims for approval (added in rewritten copy)

- Contact form success: "The right team will get back to you within two working days." (new response-time promise)
- Home talent stat: "Top 1% of engineering talent, selected across three continents." (see item 2 above: continents vs countries)
- Home S.04 AI: "We integrate AI into every stage of the product lifecycle."
- Nearshore USA S.03: "A software company first — we use AI deliberately, not by default."
- About S.07: "Product engineering, tech talent and web solutions — each built for the market it serves."

## Group companies

The list is still to be confirmed with 99x, including whether "LeanOn" and "Digital Solutions" are current group companies and how they should be named on the site.

## Image notes

- `about/management.jpg` and `about/tab-culture.jpg` are each reused twice on About.
- `nearshore-usa/hero.jpg` shows banding.
- The webinar thumbnail is letterboxed (source aspect differs).
- A header wordmark asset is needed (currently the logo pill uses the existing mark).

## Launch checklist

- Remove the "Current 99x.io" link on the 404 page.
- Vercel project, domain and DNS.
- Wire `CONTACT_PROVIDER` (Resend or HubSpot).
- The contact rate limiter keys on `x-forwarded-for`: deploy only behind Vercel's proxy.
- Analytics and consent banner.
- Font licences (Helvetica Now Display + PP Supply Mono) if the exact cominvi look is wanted.
- Field-data check of mobile LCP on `/about-us`.
