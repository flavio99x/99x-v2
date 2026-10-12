import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import manifest from "@/content/images.json";
import { manifest as source } from "../../../scripts/image-manifest.mjs";

describe("image manifest", () => {
  it("has an entry and a file for every manifest item", () => {
    for (const { out } of source) {
      expect(manifest, out).toHaveProperty(out);
      expect(existsSync(path.join(process.cwd(), "public/images", out)), out).toBe(true);
    }
  });
});
