import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

// One piece per office: first "9" (ring + tail), second "9" (ring + tail), long x-stroke,
// upper-right x-stroke, lower-left x-stroke. Vector_5 / Vector_7 duplicate Vector_4 / Vector_6.
export const PIECE_GROUPS: readonly (readonly string[])[] = [["Vector_2", "Vector_4"], ["Vector_3", "Vector_6"], ["Vector"], ["Vector_8"], ["Vector_9"]];
/** Primary colour of each piece (its first path). Every part keeps its own original fill — see `parts`. */
export const PIECE_COLORS = ["#A2B372", "#C49FD5", "#CCB189", "#B44B4B", "#7A6977"];

const LOGO_W = 74;
const LOGO_H = 38;

export type LogoPart = { color: string; geometry: THREE.BufferGeometry };
export type LogoPiece = { id: number; color: string; parts: LogoPart[]; center: THREE.Vector3 };

export function buildPieces(svgText: string): LogoPiece[] {
  const data = new SVGLoader().parse(svgText);
  const byId = new Map<string, { path: (typeof data.paths)[number]; fill: string }>();
  for (const p of data.paths) {
    const node: unknown = p.userData?.node;
    if (!(node instanceof Element)) continue;
    const id = node.getAttribute("id");
    if (id && !byId.has(id)) byId.set(id, { path: p, fill: node.getAttribute("fill") ?? `#${p.color.getHexString()}` });
  }
  return PIECE_GROUPS.map((ids, idx) => {
    const box = new THREE.Box3();
    const parts = ids.map((id) => {
      const entry = byId.get(id);
      if (!entry) throw new Error(`Logo path not found: ${id}`);
      const geometry = new THREE.ExtrudeGeometry(entry.path.toShapes(), {
        depth: 3, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.35, bevelSegments: 3, curveSegments: 24,
      });
      // SVG y grows down; flip, centre on the logo, normalise to ~1 unit wide.
      geometry.translate(-LOGO_W / 2, -LOGO_H / 2, -1.5);
      geometry.scale(1 / LOGO_W, -1 / LOGO_W, 1 / LOGO_W);
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      if (geometry.boundingBox) box.union(geometry.boundingBox);
      return { color: entry.fill, geometry };
    });
    const center = new THREE.Vector3();
    box.getCenter(center);
    return { id: idx, color: PIECE_COLORS[idx], parts, center };
  });
}
