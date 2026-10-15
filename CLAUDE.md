# 99x website

Next.js 16 (App Router) + Tailwind v4 + GSAP/ScrollTrigger + Lenis + React Three Fiber. Visual system recreates cominvi.com.mx with 99x content.

Also read `AGENTS.md` (Next.js 16 has breaking changes: consult `node_modules/next/dist/docs/` before writing Next code). This file and AGENTS.md agree; AGENTS.md's block is managed by `next dev`.

## Start here
New session? Read `_docs/HANDOFF.md` first: current state, architecture map, gotchas, backlog and next steps.

## Rules
- All docs and .md files live in `_docs/` (except this file / AGENTS.md).
- Spec: `_docs/specs/2026-10-10-99x-website-phase1-design.md`. Design system: `_docs/DESIGN.md`. Product: `_docs/PRODUCT.md`.
- Content lives in `src/content/en/**` and is validated by `src/content/schema.ts`. Components never import content; pages pass it in.
- Size with the fluid unit (`--u`; Tailwind spacing/type tokens). No raw px except 1px hairlines.
- Space between sections is one constant, `--section-space` (`section-y`, applied by SectionShell). Never give a section its own vertical padding; every page section goes through SectionShell or uses `section-y`.
- Register GSAP plugins only in `src/lib/gsap.ts`; use `useGSAP` for every animation; respect `useReducedMotion`.
- Defer below-the-fold motion setup with `whenNear` from `src/lib/near.ts` (keeps main-thread work off first load).
- Images: add to `scripts/image-manifest.mjs`, run `pnpm images`, reference via `img(path, alt)` with real alt text.
- Unbuilt pages link to https://99x.io (external flag).
- Every button and link shows `cursor: pointer`. A global base rule in `globals.css` covers `a[href]`, `button`, `[role=button|tab]` and friends; anything clickable that is not one of those (e.g. a `div` with `onClick`) needs `cursor-pointer` explicitly. Check this when reviewing UI.
- `cn` has no tailwind-merge: a component's default class does not lose to a conflicting caller class (e.g. `size-6` vs `size-4`). Apply defaults only when the caller passes none.
- E2E must run on a clean `.next` (`rm -rf .next` first) to avoid stale-build flakiness.

## Commands
- `pnpm dev` · `pnpm build` · `pnpm test` · `pnpm test:e2e` · `pnpm images`
- `pnpm typecheck` (`next typegen && tsc --noEmit`) · `pnpm lint` (`eslint .`)
- Dev component gallery: `/dev/kitchen-sink` (404 in production).
