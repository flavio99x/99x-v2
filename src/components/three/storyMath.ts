export const STEP_START = 0.1;
export const STEP_END = 0.9;
/** Depth the active piece is brought forward to. */
export const FOCUS_Z = 0.6;

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

export function pieceTarget(i: number, progress: number, count: number): { pos: Vec3; rot: Vec3; dim: number } {
  if (progress <= 0 || progress >= 1) return { pos: [0, 0, 0], rot: [0, 0, 0], dim: 0 };
  // Explode amount ramps in during intro and out during outro.
  const explode =
    progress < STEP_START ? ease(progress / STEP_START) : progress >= STEP_END ? 1 - ease((progress - STEP_END) / (1 - STEP_END)) : 1;
  const { active, local, phase } = storyStep(progress, count);
  const [dx, dy] = OUTWARD[i % OUTWARD.length];
  if (phase === "steps" && i === active) {
    // Ease forward during the first 20% of the step, hold, ease back during the last 20%.
    const focus = smoothstep(0, 0.2, local) * (1 - smoothstep(0.8, 1, local));
    return { pos: [0, 0, FOCUS_Z * focus], rot: [0, local * Math.PI * 2 * 0.25, 0], dim: 0 };
  }
  return {
    pos: [dx * 0.45 * explode, dy * 0.45 * explode, -0.1 * explode],
    rot: [0.15 * explode * dy, 0.25 * explode * dx, 0],
    dim: phase === "steps" ? 0.6 : 0.6 * explode,
  };
}
