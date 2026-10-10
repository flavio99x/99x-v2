// Visible names never drop below 3:1 contrast (WCAG large text) on paper/tint; near the cylinder's
// edges the rotateX foreshortening, not opacity, is what makes them recede.
const MIN_OPACITY = 0.55;

export function cylinderItem(i: number, focus: number, step = 18) {
  const angle = (i - focus) * step;
  const visible = Math.abs(angle) <= 90;
  const opacity = visible ? Math.max(MIN_OPACITY, Math.cos((angle * Math.PI) / 180)) : 0;
  return { angle: Object.is(angle, -0) ? 0 : angle, opacity: angle === 0 ? 1 : opacity, visible };
}

export function timelineIndex(progress: number, count: number) {
  return Math.max(0, Math.min(count - 1, Math.floor(progress * count)));
}
