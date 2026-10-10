export const STEP_START = 0.1;
export const STEP_END = 0.9;
/** Depth the active piece is brought forward to. */
export const FOCUS_Z = 0.15;
/** Radius (logo units, before the scene scale) inactive pieces park at during the steps — just outside the dial ring. */
export const RING_R = 0.92;
/** Opacity inactive pieces fade to while another piece is in focus. */
export const DIM = 0.85;

type Vec3 = [number, number, number];

// Unit directions from logo centre for each piece (first 9 left, second 9 centre-up, x strokes right).
const OUTWARD: [number, number][] = [[-1, 0.3], [-0.2, 1], [1, -0.2], [0.8, 0.8], [0.4, -1]];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function storyStep(progress: number, count: number) {
  if (progress < STEP_START) return { active: -1, local: 0, phase: "intro" as const };
  if (progress >= STEP_END) return { active: -1, local: 0, phase: "outro" as const };
  const t = (progress - STEP_START) / (STEP_END - STEP_START);
  const f = t * count;
  const active = Math.min(count - 1, Math.floor(f));
  return { active, local: f - active, phase: "steps" as const };
}

/**
 * Story target for piece `i`. `center` is the piece's assembled position; `pos` is the offset from it.
 * `focus` (0–1) is how far the piece is centred and scaled up as the active piece.
 */
export function pieceTarget(
  i: number,
  progress: number,
  count: number,
  center: readonly [number, number] = [0, 0],
): { pos: Vec3; rot: Vec3; dim: number; focus: number } {
  if (progress <= 0 || progress >= 1) return { pos: [0, 0, 0], rot: [0, 0, 0], dim: 0, focus: 0 };
  // Explode amount ramps in during intro and out during outro.
  const explode =
    progress < STEP_START ? ease(progress / STEP_START) : progress >= STEP_END ? 1 - ease((progress - STEP_END) / (1 - STEP_END)) : 1;
  const { active, local, phase } = storyStep(progress, count);
  const [cx, cy] = center;
  if (phase === "steps" && i === active) {
    // Ease to the dial centre during the first 20% of the step, hold, ease back during the last 20%;
    // a gentle y swing (max ~35°) that returns to 0 so the piece is never seen edge-on.
    const focus = smoothstep(0, 0.2, local) * (1 - smoothstep(0.8, 1, local));
    return { pos: [-cx * focus, -cy * focus, FOCUS_Z * focus], rot: [0, Math.sin(local * Math.PI) * 0.6, 0], dim: 0, focus };
  }
  // Inactive pieces park on a ring just outside the dial, in their own direction.
  const [dx, dy] = OUTWARD[i % OUTWARD.length];
  const len = Math.hypot(dx, dy);
  return {
    pos: [((dx / len) * RING_R - cx) * explode, ((dy / len) * RING_R - cy) * explode, -0.1 * explode],
    rot: [0.15 * explode * dy, 0.25 * explode * dx, 0],
    dim: phase === "steps" ? DIM : DIM * explode,
    focus: 0,
  };
}
