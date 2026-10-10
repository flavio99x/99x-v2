import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// One piece per office: first "9" (ring + tail), second "9" (ring + tail), long x-stroke,
// upper-right x-stroke, lower-left x-stroke. Vector_5 / Vector_7 duplicate Vector_4 / Vector_6.
export const PIECE_GROUPS: readonly (readonly string[])[] = [["Vector_2", "Vector_4"], ["Vector_3", "Vector_6"], ["Vector"], ["Vector_8"], ["Vector_9"]];
export const PIECE_COLORS = ["#A2B372", "#C49FD5", "#CCB189", "#B44B4B", "#7A6977"];

const LOGO_W = 74;
const LOGO_H = 38;

export type LogoPiece = { id: number; color: string; geometry: THREE.BufferGeometry; center: THREE.Vector3 };

export function buildPieces(svgText: string): LogoPiece[] {
  const data = new SVGLoader().parse(svgText);
  const byId = new Map<string, (typeof data.paths)[number]>();
  for (const p of data.paths) {
    const node: unknown = p.userData?.node;
    const id = node instanceof Element ? node.getAttribute("id") : null;
    if (id && !byId.has(id)) byId.set(id, p);
  }
  return PIECE_GROUPS.map((ids, idx) => {
    const geoms = ids.map((id) => {
      const path = byId.get(id);
      if (!path) throw new Error(`Logo path not found: ${id}`);
      const shapes = path.toShapes();
      return new THREE.ExtrudeGeometry(shapes, { depth: 3, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.35, bevelSegments: 3, curveSegments: 24 });
    });
    const merged = mergeGeometries(geoms, false);
    if (!merged) throw new Error(`Could not merge logo piece ${idx}`);
    geoms.forEach((g) => g.dispose());
    // SVG y grows down; flip, centre on the logo, normalise to ~1 unit wide.
    merged.translate(-LOGO_W / 2, -LOGO_H / 2, -1.5);
    merged.scale(1 / LOGO_W, -1 / LOGO_W, 1 / LOGO_W);
    merged.computeVertexNormals();
    merged.computeBoundingBox();
    const center = new THREE.Vector3();
    merged.boundingBox?.getCenter(center);
    return { id: idx, color: PIECE_COLORS[idx], geometry: merged, center };
  });
}
