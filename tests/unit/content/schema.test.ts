import { describe, it, expect } from "vitest";
import { ImgSchema, LinkSchema, SectionSchema } from "@/content/schema";

describe("ImgSchema", () => {
  it("rejects filename-like alt text", () => {
    const r = ImgSchema.safeParse({ src: "/images/a.jpg", alt: "IMG_0745", width: 10, height: 10 });
    expect(r.success).toBe(false);
  });
  it("rejects alt with a file extension", () => {
    const r = ImgSchema.safeParse({ src: "/images/a.jpg", alt: "photo.jpg", width: 10, height: 10 });
    expect(r.success).toBe(false);
  });
  it("accepts descriptive alt", () => {
    const r = ImgSchema.safeParse({ src: "/images/a.jpg", alt: "Engineers at a whiteboard", width: 10, height: 10 });
    expect(r.success).toBe(true);
  });
});

describe("LinkSchema", () => {
  it("requires external links to be absolute https", () => {
    expect(LinkSchema.safeParse({ label: "x", href: "/ai-99x", external: true }).success).toBe(false);
    expect(LinkSchema.safeParse({ label: "x", href: "https://99x.io/ai-99x", external: true }).success).toBe(true);
  });
  it("allows mailto and anchors as internal", () => {
    expect(LinkSchema.safeParse({ label: "x", href: "mailto:hi@99x.io" }).success).toBe(true);
    expect(LinkSchema.safeParse({ label: "x", href: "#talk" }).success).toBe(true);
  });
});

describe("SectionSchema", () => {
  it("rejects unknown section types", () => {
    expect(SectionSchema.safeParse({ type: "carousel" }).success).toBe(false);
  });
  it("parses a namesCylinder section", () => {
    const r = SectionSchema.safeParse({
      type: "namesCylinder",
      theme: "paper",
      head: { label: "Trusted by", statement: "Companies that build with us." },
      names: ["Adra", "Kavli", "OBOS"],
    });
    expect(r.success).toBe(true);
  });
});
