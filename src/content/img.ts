import manifest from "./images.json";
import type { Img } from "./schema";

type Manifest = Record<string, { width: number; height: number }>;

export function img(path: string, alt: string): Img {
  const entry = (manifest as Manifest)[path];
  if (!entry) throw new Error(`Image not in manifest: ${path}. Run \`pnpm images\`.`);
  return { src: `/images/${path}`, alt, width: entry.width, height: entry.height };
}
