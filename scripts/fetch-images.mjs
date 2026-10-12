// Downloads source photography from 99x.io, resizes, writes public/images/** and src/content/images.json.
// Usage: pnpm images   (idempotent; skips files that already exist unless --force)
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { manifest } from "./image-manifest.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "_docs/content/source");
const OUT_DIR = path.join(ROOT, "public/images");
const JSON_OUT = path.join(ROOT, "src/content/images.json");
const force = process.argv.includes("--force");
const URL_RE = /https:\/\/99x\.io\/_\/media:image\/[^\s)`"']+/g;

const exists = (p) => access(p).then(() => true, () => false);

async function findUrl(page, match) {
  const md = await readFile(path.join(SRC_DIR, `${page}.md`), "utf8");
  const urls = [...new Set(md.match(URL_RE) ?? [])].filter((u) => u.includes(match));
  if (!urls.length) throw new Error(`No URL in ${page}.md matching "${match}"`);
  // Prefer the largest rendition: rewrite the size segment to "full".
  return urls[0].replace(/\/(block-\d+-\d+|square-\d+|full)\//, "/full/");
}

const result = {};
for (const { page, match, out } of manifest) {
  const dest = path.join(OUT_DIR, out);
  await mkdir(path.dirname(dest), { recursive: true });
  if (force || !(await exists(dest))) {
    const url = await findUrl(page, match);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).rotate().resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
    console.log("✓", out);
  }
  const { width, height } = await sharp(dest).metadata();
  result[out] = { width, height };
}
await writeFile(JSON_OUT, JSON.stringify(result, null, 2) + "\n");
console.log(`Wrote ${Object.keys(result).length} entries to src/content/images.json`);
