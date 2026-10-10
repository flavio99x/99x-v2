// The visible list is decorative (aria-hidden; an sr-only list carries the names), so only the
// focused name needs full contrast. Neighbours recede by opacity; the angle is clamped so the
// perspective never shears names into fake italics.
const STEP_OPACITY = [1, 0.15, 0.05] as const;
const MAX_STEPS = 2.5;

export function cylinderItem(i: number, focus: number, step = 16) {
  const d = i - focus;
  const a = Math.abs(d);
  const visible = a <= MAX_STEPS;
  let opacity = 0;
  if (visible) {
    const lo = Math.min(2, Math.floor(a));
    const hi = Math.min(2, lo + 1);
    const t = Math.min(1, a - lo);
    opacity = STEP_OPACITY[lo] + (STEP_OPACITY[hi] - STEP_OPACITY[lo]) * t;
  }
  const raw = Math.max(-MAX_STEPS, Math.min(MAX_STEPS, d)) * step;
  const angle = Object.is(raw, -0) ? 0 : raw;
  return { angle, opacity, visible };
}

export function timelineIndex(progress: number, count: number) {
  return Math.max(0, Math.min(count - 1, Math.floor(progress * count)));
}
