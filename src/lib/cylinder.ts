export function cylinderItem(i: number, focus: number, step = 18) {
  const angle = (i - focus) * step;
  const visible = Math.abs(angle) <= 90;
  const opacity = visible ? Math.max(0.08, Math.cos((angle * Math.PI) / 180)) : 0;
  return { angle: Object.is(angle, -0) ? 0 : angle, opacity: angle === 0 ? 1 : opacity, visible };
}

export function timelineIndex(progress: number, count: number) {
  return Math.max(0, Math.min(count - 1, Math.floor(progress * count)));
}
