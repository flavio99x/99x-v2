# cominvi.com.mx — design reference

Read-only analysis (2026-10-10) of the site used as the visual base. Values measured from CSS, inline styles, the custom JS bundle and computed styles at 1440px.

## Stack
Webflow + jQuery, plus a custom Vite bundle (`cominvi.pages.dev/main.js`): GSAP 3.13 (ScrollTrigger, CustomEase, Observer, Flip), Lenis, Barba.js, SplitText-style splitting, Lottie (service icons), MapLibre GL (maps), canvas image sequences. Osmo "Scaling System" fluid sizing: `body{font-size:var(--size-font)}`, 1em = 16px at 1440. Design widths 1440 / 834 / 550 / 390 (breakpoints 991 / 767 / 479). Credit: Holographik.

## Typography
- Helvetica Now Display — Bold 700, Medium 500 (no regular; body is bold).
- PP Supply Mono — Light 300, all uppercase labels/eyebrows/buttons.
- Sizes: hero 3.5em/1.1; XXL 7em/0.8 (-0.025em); statement 3em/1; next-page 3.5em/1 (500); H2 2em; card 2em/1.1; stat 2.5em/1 (`text-box: trim-both cap alphabetic`); menu 2em/0.9; body M 1.25em/1.1; body S 1em/1.2; footer 1em/1.4 (500, .6); eyebrow M .75em; eyebrow S .7em; button .813em; small button ≈10.8px; form label 1.5em.
- Sentence-case headings; hierarchy via opacity (.1/.15/.3/.5/.6).

## Colour
`#151515` primary/ink · `#FFFFFF` · `#EBF0ED` light-green alt bg · `#F47920` accent orange · `#E0E0E0` muted · `#D5DAD7` grey display · `#B55109` dark orange (social) · borders ink @ 50/30/20% · on dark white @ 20/10% · reveal gradient `#151515 → #F47920`.
Home alternation: dark hero → white → light-green → white → white → light-green → white → white → dark next-page → white footer.

## Layout
Full-bleed, no max-width; margin 2em (1em ≤991); 12-col, 1em gutter; widths 28 / 35.25 / 42.375 / 57em; section padding 2em top / 16em bottom, 16em row gap (some 12em); hero 100vh/svh.

## Structure
- **Header**: fixed, 1.5em top, 2em sides. Logo pill left; "Menu" + 48px circle right. Hide on scroll down / show on scroll up (slide off sides, 0.5s). Theme per section (hero/white/lightgreen/black/menu).
- **Menu**: page pushed down ~470px and inset with rounded corners revealing ink layer; 3 columns of 2em links, language (active orange), socials; icon → orange circle ×; link hover slides arrow in.
- **Home**: Hero (video bg 120%, 2-line H1 bottom-left, mono metric right, 2 mini cards) → S.01 About (tag + statement, portrait + 2×2 stats, paragraph + button) → S.02 Services (3×2 square cards, orange hover + description, photo tile) → S.03 Minerals (pinned ~270vh, tick dial + canvas sequence, list left, symbol right) → S.04 Safety (sticky split) → S.05 Technology (XXL "Over 360 machines" pill wipe, 3-col dark machine cards) → S.06 Team (01/02 toggle, quote char reveal, 3 light-green cards) → S.07 Partners (3D cylinder list, pinned, tick rulers) → Next page (full-bleed parallax, sticky button, Barba transition) → Footer.
- **About**: hero; statement + offset images; XXL photo-filled text; pinned full-screen timeline with year digit columns; Mission/Vision/Ethics toggle; values cylinder; expanding image; certifications rows; next page.
- **Services**: hero; services grid; minerals dial; dark map (MapLibre); process section (sticky wireframe renders + numbered steps, line opacity .2→1, tick progress); next page.
- **Contact**: sticky map left; right 28em column: "Central Office", mono labels TEL/MAIL/ADDRESS, "Drop us a line" form (bottom-border fields).
- **Footer**: logo + socials; columns with outlined mono tags (EXPLORE / LIBRARY / LEGAL / CONTACT); links 1em 500 @ .6; 12em gap; hairline; centred copyright.

## Components
- Button: ink, radius .5em, ~40px, mono label padding 1.5em, white 2em arrow square (4px inset); hover content slides +2.25em (0.5s) revealing orange arrow square. Variants white, xl/xxl, next.
- Small button: white, radius 2px, 1.75em tall; hover orange fill + slide.
- Section tag: outlined `S.0X` over filled black `NAME`, radius .25em, 1px border.
- Cards: service (white square r8 p2em), team (light-green 2:1), machine (ink, 179/220), hero mini (r4, white/20 border).
- Stat: 3em icon, 40px number, mono label, 1px top rule @20%.
- Toggle: ink bg r.5em p.25em, sliding white square 2.125em r.25em, mono 01/02.
- Tick rulers: 1px ticks widths .75/.875/1/1.25/1.5em, opacity .2→.75.
- Form fields: bottom border only, 1.5em 0 padding, bold 1em.
- Images r.5em cover; links never underlined.

## Motion
- House ease `CustomEase "M0,0 C0.6,0 0,1 1,1"` (≈ cubic-bezier(.6,0,0,1)); 1.2s default, 0.5s hovers, 0.8s card reveals power2.out.
- Lenis lerp .125, smoothWheel, syncTouch; scroller proxy on `.page-wrap`.
- Loader: icon tile → full logo pill, white square scale-out, ~1.1s fade, `loader:done`.
- Hero: lines yPercent 110→0 1.2s stagger .03; eyebrows from 130%; mini cards from 110/120% at +0.5s.
- Statement: chars opacity .2→1 scrubbed per line `top 85%`→`top 50%`, stagger .02.
- Cards: autoAlpha + 2em y, 0.8s, once at `top 85%`.
- Display: gradient pill wipe width 0→100% 2s stagger .025; eyebrow words rotate from 70°.
- Pins: minerals dial (canvas sequence), sticky split, cylinder (rotateX, `+=2000svh`), timeline, process steps; testimonials yPercent 100→0 0.6s.
- Parallax on hero video and next-page bg.
- Barba: default fade; next-scroll-and-reveal (~1.4s).
- Not present: custom cursor, three.js, Swiper.

## Imagery
Dark cinematic photography with orange accents echoing the brand; cut-outs on white/ink; orange wireframe renders on black; 1.5px monoline icons; instrument-style tick dials and mono data labels (`AU [#79]`, `S.03`); hairlines; small radii; no shadows or illustrations.

## Screenshots
Desktop (1440×900) and mobile (375×812) captures of home, about, services, contact and menu states: [cominvi-shots/](cominvi-shots/).
