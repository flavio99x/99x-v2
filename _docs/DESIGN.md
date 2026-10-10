---
name: 99x website (phase 1)
description: A Norwegian-rooted engineering company shown as a numbered, ink-and-paper editorial system with lavender as the single live accent and the 99x line-work logo as the only multicolour element.
colors:
  ink: "#160f17"
  paper: "#ffffff"
  tint: "#efe8f3"
  accent: "#c49fd5"
  accent-deep: "#4a3255"
  logo-sage: "#a2b372"
  logo-lavender: "#c49fd5"
  logo-sand: "#ccb189"
  logo-bronze: "#bc8e58"
  logo-brown: "#905b54"
  logo-red: "#b44b4b"
  logo-mauve: "#7a6977"
typography:
  hero:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "calc(var(--u) * 3.5)"
    fontWeight: 700
    lineHeight: 1.1
  display-xxl:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "calc(var(--u) * 7)"
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: "-0.025em"
  statement:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "calc(var(--u) * 3)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.0098em"
  next-page:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "calc(var(--u) * 3.5)"
    fontWeight: 700
    lineHeight: 1
  stat:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "calc(var(--u) * 2.5)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.0098em"
  headline:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "calc(var(--u) * 2)"
    fontWeight: 700
    lineHeight: 1
  card-title:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "calc(var(--u) * 2)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  menu:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "calc(var(--u) * 2)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.0075em"
  label:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "calc(var(--u) * 1.5)"
    fontWeight: 700
    lineHeight: 1.1
  body-m:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "calc(var(--u) * 1.25)"
    fontWeight: 700
    lineHeight: 1.1
  body-s:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "var(--u)"
    fontWeight: 700
    lineHeight: 1.2
  mono-caption-m:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "calc(var(--u) * 0.75)"
    fontWeight: 300
    lineHeight: 1
  mono-caption-s:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "calc(var(--u) * 0.7)"
    fontWeight: 300
    lineHeight: 0.9
  button:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "calc(var(--u) * 0.813)"
    fontWeight: 300
    lineHeight: 0.8
rounded:
  xs: "2px"
  sm: "calc(var(--u) * 0.25)"
  md: "calc(var(--u) * 0.5)"
spacing:
  unit: "calc(var(--u) * 0.25)"
  gutter: "var(--u)"
  site-margin: "calc(var(--u) * 2)"
components:
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "4px"
    height: "44px"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "4px"
  button-next:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-m}"
    rounded: "{rounded.md}"
  button-sm:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.mono-caption-s}"
    rounded: "{rounded.xs}"
    height: "28px"
  button-sm-hover:
    backgroundColor: "{colors.accent}"
  card-tile:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "32px"
  card-tile-hover:
    backgroundColor: "{colors.accent}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-s}"
    padding: "24px 0"
  toggle:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "4px"
---

# Design System: 99x website (phase 1)

> Recorded from the shipped build (branch feat/phase1-website), not from the plan. Fonts are stand-ins pending licences: Inter Tight (500/700) for Helvetica Now Display, Geist Mono (300) for PP Supply Mono. Swapping to licensed faces is a `next/font/local` change in `src/lib/fonts.ts` only; recorded sizes and weights should then be re-verified.

## Overview

**Creative North Star: "The Numbered Dossier"**

The site reads as an indexed document: sections carry a two-part index tag, long statements are read line by line as the page scrolls, and every claim sits on flat ink, paper or pale-lilac ground. The structure, type, palette and motion follow the cominvi.com.mx reference pinned by the user, re-skinned with the 99x lavender and plum. Colour is nearly absent from the layout; it arrives through the multicolour line-work logo (the 3D piece, the header tile) and the single lavender accent that answers hover and focus.

Density is airy and tall: sections separate by 160-256px of bottom padding, headlines are large and tightly leaded, and body copy is small. The surface is flat. Hierarchy comes from scale, ink/paper inversion between sections, hairlines and mono captions, never from shadows or gradients (the only gradient is a legibility scrim over hero photography).

**Key Characteristics:**
- Three section grounds (ink, paper, tint) alternate; the fixed header recolours itself to the section beneath it.
- One fluid unit `--u` (1u = 16px at the design width) drives type, spacing, radius and component size.
- Heavy sans display (700) paired with light mono (300) for data, roles, buttons and index tags.
- Easing is one house curve; reveals are slow (1.2s) and masked, hovers are 0.5s.
- The 3D logo is the one place the full seven-colour logo palette appears at scale.

## Colors

A near-black plum ink, white, one pale lilac tint, one lavender accent and its plum dark; the seven logo colours are reserved for the logo.

### Primary
- **Lavender Accent** (`colors.accent`, #c49fd5): the only interactive colour. Hover/focus fill on cards and small buttons, the sliding arrow chip on buttons, the "next page" arrow chip. It is also the logo's lavender stroke.
- **Deep Plum** (`colors.accent-deep`, #4a3255): focus ring on light grounds (2px, 2px offset) and field focus border. On dark grounds the focus ring flips to Lavender.

### Neutral
- **Plum Ink** (`colors.ink`, #160f17): dark section ground, all text on light grounds, `body` background (shows during page-shell inset), hero scrim base.
- **Paper White** (`colors.paper`, #ffffff): light ground, text on ink, card tiles and button shells.
- **Lilac Tint** (`colors.tint`, #efe8f3): the third section ground and the toggle track on tinted sections.

### Logo palette (reserved)
- `logo-sage` #a2b372, `logo-lavender` #c49fd5, `logo-sand` #ccb189, `logo-bronze` #bc8e58, `logo-brown` #905b54, `logo-red` #b44b4b, `logo-mauve` #7a6977: logo sub-path fills (each keeps its original fill) in the 3D scene, the inline SVG fallback and the LogoStory. Outside the logo, only `logo-red` appears, as the form error colour.

### Named Rules
**The Ink-Paper-Tint Rule.** A section is exactly one of dark (ink), paper or tint, declared through `data-theme`; the header and focus ring read that attribute. Do not invent a fourth ground.

**The Logo Owns The Spectrum Rule.** The sage/sand/bronze/brown/mauve colours are never used for UI, charts or decoration. Lavender is the only logo colour doing UI work.

**The Opacity Contrast Rule.** Secondary text is the ground colour at 60-70% (`ink/60`, `ink/70`, `paper/60`, `paper/70`). Values were raised during the build for axe contrast: names-cylinder neighbours rest at .55, inactive LogoStory cities at .5 (large h2 type), `paper/50` on menu group labels. Do not go below these on text of the same size.

## Typography

**Display Font:** Inter Tight 500/700 (stand-in for Helvetica Now Display), fallback "Helvetica Neue", Arial, sans-serif. `body` defaults to 700.
**Mono Font:** Geist Mono 300 (stand-in for PP Supply Mono), fallback ui-monospace.

**Character:** A bold, tightly tracked grotesque for everything the reader is meant to read, and a thin uppercase mono for everything that is data: index, role, country, coordinates, button label.

### Hierarchy
All sizes are multiples of `--u` (16px at 1440 wide). Mobile (<=767px) steps statement to 2u, xxl to 4u, hero and next-page to 2.5u.
- **Display XXL** (700, 7u = 112px, 0.8, -0.025em): oversized display lines (DisplayLine sections).
- **Hero / Next-page** (700, 3.5u = 56px, 1.1 / 1): home hero H1 and the next-page link block.
- **Statement** (700, 3u = 48px, 1, -0.0098em): section statements in the head of every SectionShell, scrubbed line by line.
- **Stat** (700, 2.5u = 40px, 1): stat figures, cap-trimmed.
- **Headline / Card / Menu** (700, 2u = 32px; line-height 1 / 1.1 / 0.9): h2 in lists, card titles (-0.025em), menu links (-0.0075em).
- **Label** (700, 1.5u = 24px, 1.1): form labels.
- **Body M / S** (700, 1.25u = 20px at 1.1; 1u = 16px at 1.2): lead and running text; body-s secondary copy runs at ink/70.
- **Mono caption** (300 uppercase, 0.75u = 12px and 0.7u = 11.2px): stat labels, roles, countries, row numbers, coordinates, card tags, error text.
- **Button** (300 uppercase mono, 0.813u = 13px; xl uses body-m 20px): button labels.

### Named Rules
**The Heavy-Light Pairing Rule.** Weight is the hierarchy: 700 sans for reading, 300 mono uppercase for data. No third family, no italic, no mid-weight sans in the build (500 is loaded but unused in sampled components).

**The Cap-Trim Rule.** Large numerals use `text-box: trim-both cap alphabetic` so they align to hairlines without leading gaps.

## Layout

A 12-column grid (`grid-12`, column gap 1u) inside `site-x` side padding (2u at desktop, 1u at <=991px). Section heads occupy 8 of 12 columns. Breakpoints: 480 / 768 / 992 / 1440. The fluid scale clamps the container between 992 and 1920px on desktop and re-bases at 834 (tablet), 550 (large phone) and 390 (phone) design widths, so a layout scales proportionally inside each band rather than reflowing continuously. Tailwind's spacing step is 0.25u (4px at design width).

Sections open with 2u top padding and close with 160px/256px (large) or 128px/192px (medium) at mobile/desktop; heads sit 96px/160px above content. Card grids go 1 column, 2 at tablet, and 3 or 4 at desktop (4 when exactly four tiles). Hero is full `svh` with content bottom-aligned. Pinned stages (names cylinder, logo story) use transform pinning so they survive the menu's page-shell transform.

Home runs: hero, then sections indexed S.01 onward, with Insights as its own section (S.07) and Trusted by as S.08; About places divisions as its own S.07. Index tags are content-driven (`head.index`).

## Elevation & Depth

Flat. There are no box-shadows anywhere in the build. Depth is conveyed by ground inversion (ink / paper / tint), 20% hairlines (`ink/20`, `paper/20`), the page shell scaling to 0.96 and dropping behind the open menu, and the pinned names cylinder (3D transform, not shadow). The only gradient is the hero/next-page photo scrim (`ink/85 -> ink/35 -> ink/40`, or flat `ink/40`).

### Named Rules
**The Flat Rule.** Surfaces never lift. State change is a colour swap (paper to lavender), a translate, or an opacity change.

## Shapes

Small, even rounding derived from the unit: 2px (`rounded-xs`, small buttons and tag chips), 4px (`rounded-sm`, arrow chips, tag boxes, toggle thumb), 8px (`rounded-md`, buttons, cards, images, toggle track). `rounded-full` appears only for circular pieces. The SectionTag is a stacked pair of outlined boxes (index on top, label below, top-left corner squared so they read as one folded tab). Photography is clipped to `rounded-md`; hero cards use 4px with a 20% paper hairline. Icons are a custom 24px line set, 1.5px stroke, round caps, drawn as inline SVG paths.

## Components

### Buttons
- **Shape:** 8px shell with 4px padding holding a 32px arrow chip (4px radius); min height 44px.
- **Primary (dark):** ink shell, paper text, paper arrow chip. **Light:** inverse. **Next:** paper shell, lavender arrow chip, xl size (20px label).
- **Hover / Focus:** label and chip slide 36px right while the front arrow fades and a hidden lavender chip enters from the left (0.5s house ease). Keyboard focus triggers the same motion.
- **Small button:** 28px tall, 2px radius, paper fill, mono caption plus 8px triangle; hover/focus fills lavender and nudges the label 4px.

### Cards / Containers
- **Tile (CardGrid):** square, paper, 8px radius, 32px padding, icon top / title bottom. Description is hidden at desktop and revealed on hover or focus-within; fill goes lavender. On touch widths the description is always visible.
- **Case and insight cards:** photo-led, 8px radius; a paper mono tag chip sits at the photo's top-left.
- **Stats:** top hairline (`ink/20`), 48px line icon, 40px figure, mono label.

### Inputs / Fields
- **Style:** underline only (1px ink bottom border, transparent ground, 24px vertical padding), bold body-s value, `ink/30` placeholder, 24px label above, optional hint at `ink/70`.
- **Focus:** border becomes Deep Plum. **Error:** border and mono uppercase message in logo red; `aria-invalid` and `aria-describedby` are wired.

### Navigation
- **Header:** fixed, 24px from top, no bar. A logo pill (colour logo on an ink or paper tile, 64px wide) beside an outlined wordmark box, and a menu button. It recolours to the section beneath and hides on scroll down (slides off the sides), returns on scroll up. The wordmark box currently repeats "99x" as text pending a wordmark asset.
- **Menu:** full-screen ink dialog; the page shell drops and insets to 0.96 scale on desktop (1.2s). Links are 32px display with masked rise-in (0.8s, 30ms stagger); group labels are mono at `paper/50`. Escape closes; focus is trapped.

### Toggle / Tabs
Segmented pill: 8px track, square 34px cells, a sliding 4px-radius thumb inverts the label colour; arrow keys, Home and End move selection.

### SectionTag and TickRuler (signature)
SectionTag is the index device (see Shapes). TickRuler is a hairline ruler of 24-48 ticks in a 0.75/0.875/1/1.25/1.5/1.25/1/0.875u width cycle; ticks at 20% opacity fill to 75% with scroll progress. It frames the names cylinder and numbered lists.

### LogoScene and LogoStory (signature)
The logo is cut into five motion pieces: first "9" (ring Vector_2 + tail Vector_4), second "9" (Vector_3 + Vector_6), the long x-stroke (Vector), the upper-right stroke (Vector_8) and the lower-left stroke (Vector_9). Each sub-path keeps its original fill. The 3D fallback (no WebGL / reduced motion) is an inline exploded SVG of the same pieces. LogoStory pairs the scene with a five-city list at 100% active / 50% inactive and a coordinate caption.

### Motion
- **House ease** `cubic-bezier(0.6, 0, 0, 1)` (GSAP "house", CSS `ease-house`) is the default for every tween.
- **Durations:** reveal 1.2s, card 0.8s, hover 0.5s. Fade-up batches use `power2.out`, 0.8s, 80ms stagger, trigger at top 85%.
- **Patterns:** masked line reveal (RevealLines, waits for loader), character-opacity scrub from 0.2 to 1 on statements (ScrubText), parallax photos (8-10%), pill wipe, once-only fade-up. NumberedList reveals each row once rather than scrubbing so text never rests dimmed.
- **Setup is deferred:** `whenNear` builds each section's motion only within one screen of the viewport.
- **Reduced motion:** a global rule zeroes transition duration/delay and collapses animation to 0.01ms; JS branches (`prefersReducedMotion`) skip scrubs, render the names cylinder as a static 2-3 column list and the LogoStory as static.

## Do's and Don'ts

### Do:
- **Do** express every size, gap and radius in `--u` multiples so the fluid scale keeps proportions.
- **Do** open each indexed section through SectionShell (tag, statement, theme) and set `data-theme` so the header and focus ring follow.
- **Do** use mono 300 uppercase for data (roles, countries, coordinates, row numbers, button labels) and 700 sans for reading text.
- **Do** answer hover and focus with the lavender fill or the arrow-chip slide at 0.5s house ease, and make them identical for keyboard focus.
- **Do** keep text over photography on an ink scrim and keep secondary text at the recorded opacity floors.
- **Do** keep each logo sub-path in its original fill and group pieces as recorded.

### Don't:
- **Don't** add box-shadows, glow or blur; depth is ground inversion and hairlines.
- **Don't** use the non-lavender logo colours outside the logo.
- **Don't** introduce a third typeface or a mid-weight sans for hierarchy.
- **Don't** scrub body or list text to a dim resting state; reveal it to full contrast (statements are the only scrubbed text).
- **Don't** hard-code px for type; the stand-in fonts will change and the scale must stay in `--u`.

## Accepted deviations from the spec (recorded)
Insights is its own Home section (S.07) with Trusted by at S.08; About divisions are their own S.07. The hero renders no mono kicker. The 3D fallback is an inline exploded SVG. Names-cylinder neighbours rest at .55 opacity and LogoStory inactive cities at .5 for contrast. The header wordmark box repeats "99x" pending an asset.

## Not canonized (defects the build carries)
Mono Eyebrow lines placed above or beside headings as kickers (NextPage `eyebrow`, CaseCards/ProofToggle/DisplayLine sublines, menu group labels) are a build carry, not a rule for new surfaces: new work uses the mono caption only as data (role, country, label on a figure, coordinates). The hero deliberately has none. ScrubText's 0.2 starting opacity on statements is transient scroll state, not a resting value, and must not be used as a contrast precedent.
