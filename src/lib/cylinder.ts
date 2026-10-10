// The visible list is aria-hidden (an sr-only list carries the names), but axe still checks its
// contrast, so every name at rest stays >= 3:1 (opacity .55 on paper/tint). Beyond two steps a name
// fades out over the last half step and is then hidden; the angle is clamped so the perspective
// never shears names into fake italics.
const MIN_OPACITY = 0.55;
const STEP_OPACITY = [1, MIN_OPACITY, MIN_OPACITY] as const;
const MAX_STEPS = 2.5;

export function cylinderItem(i: number, focus: number, step = 16) {
  const d = i - focus;
  const a = Math.abs(d);
  const visible = a <= MAX_STEPS;
  let opacity = 0;
  if (visible && a > 2) {
    opacity = MIN_OPACITY * (MAX_STEPS - a) / (MAX_STEPS - 2);
  } else if (visible) {
    const lo = Math.floor(a);
    const hi = Math.min(2, lo + 1);
    opacity = STEP_OPACITY[lo] + (STEP_OPACITY[hi] - STEP_OPACITY[lo]) * (a - lo);
  }
  const raw = Math.max(-MAX_STEPS, Math.min(MAX_STEPS, d)) * step;
  const angle = Object.is(raw, -0) ? 0 : raw;
  return { angle, opacity, visible };
}

export function timelineIndex(progress: number, count: number) {
  return Math.max(0, Math.min(count - 1, Math.floor(progress * count)));
}
