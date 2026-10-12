import type { Office } from "@/content/schema";
import { project } from "@/lib/geo";

// Coarse land mask: rows of [startLng, endLng] spans per 6° latitude band (north → south), enough for a dot-matrix silhouette.
const LAND: Record<number, [number, number][]> = {
  72: [[-60, -20], [20, 140]], 66: [[-165, -60], [-50, -20], [10, 180]], 60: [[-165, -60], [-45, -40], [5, 180]],
  54: [[-130, -60], [-10, 160]], 48: [[-125, -55], [-5, 145]], 42: [[-125, -70], [-9, 140]], 36: [[-122, -76], [-8, 140]],
  30: [[-115, -80], [-10, 120]], 24: [[-110, -80], [-16, 120]], 18: [[-105, -88], [-17, 110]], 12: [[-90, -60], [-17, 50], [75, 110]],
  6: [[-80, -50], [-10, 45], [95, 120]], 0: [[-80, -48], [8, 42], [100, 140]], [-6]: [[-80, -35], [12, 40], [105, 150]],
  [-12]: [[-77, -38], [13, 40], [125, 145]], [-18]: [[-72, -39], [12, 50], [120, 148]], [-24]: [[-70, -42], [14, 35], [114, 152]],
  [-30]: [[-72, -50], [17, 31], [115, 153]], [-36]: [[-73, -57], [140, 150], [172, 178]], [-42]: [[-74, -63], [145, 148], [170, 175]],
  [-48]: [[-75, -66]],
} as Record<number, [number, number][]>;

const W = 360, H = 170, STEP = 3;
/** Rough width of a city label (5px mono caps) plus the gap to its dot. */
const LABEL_W = 40;
const MAP_H = H * (180 / 170);

const DOTS: { x: number; y: number }[] = [];
for (const [latStr, spans] of Object.entries(LAND)) {
  const lat = Number(latStr);
  for (const [a, b] of spans) for (let lng = a; lng <= b; lng += STEP) for (let dLat = 0; dLat < 6; dLat += STEP) {
    DOTS.push(project(lat - dLat, lng, W, MAP_H));
  }
}

export function WorldDotMap({ offices, active }: { offices: Office[]; active?: string }) {
  return (
    <figure className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-ink" role="img" aria-label={`Map of 99x offices: ${offices.map((o) => `${o.city}, ${o.country}`).join("; ")}`}>
        {DOTS.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={0.7} className="fill-current opacity-20" />)}
        {offices.map((o) => {
          const p = project(o.lat, o.lng, W, MAP_H);
          const on = active === o.id;
          // Flip the label to the left when another office sits just to the right (e.g. Colombo → Kuala Lumpur).
          const crowded = offices.some((q) => {
            if (q.id === o.id) return false;
            const r = project(q.lat, q.lng, W, MAP_H);
            return r.x > p.x && r.x - p.x < LABEL_W && Math.abs(r.y - p.y) < 8;
          });
          return (
            <g key={o.id}>
              <circle cx={p.x} cy={p.y} r={on ? 5 : 3.5} className="fill-accent/40" />
              <circle cx={p.x} cy={p.y} r={1.8} className="fill-accent-deep" />
              <text x={crowded ? p.x - 5 : p.x + 5} y={p.y + 1.5} textAnchor={crowded ? "end" : "start"} className="fill-current font-mono text-[5px] uppercase">{o.city}</text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
