import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getSite } from "@/content";
import type { Section } from "@/content/schema";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/" }));
// jsdom has no layout; skip GSAP/SplitText work in this structural test.
vi.mock("@/lib/motion", () => ({ prefersReducedMotion: () => true, useReducedMotion: () => true }));

const pic = { src: "/images/home/hero.jpg", alt: "Team at work", width: 1600, height: 1000 };

describe("SectionRenderer", () => {
  it("renders sections in order with their themes", () => {
    const sections: Section[] = [
      { type: "stats", theme: "paper", head: { index: "S.01", label: "About us", statement: "Two decades of building." },
        items: [{ value: "20+", label: "Years", icon: "calendar" }, { value: "600+", label: "People", icon: "people" }] },
      { type: "cardGrid", theme: "tint", head: { index: "S.02", label: "What we do", statement: "Four ways we help." },
        cards: [{ title: "Product engineering", description: "Long-term co-creation.", icon: "layers" }, { title: "Web solutions", description: "Built and run end to end.", icon: "browser" }] },
      { type: "stickySplit", theme: "paper", head: { index: "S.03", label: "AI" }, image: pic, mediaSide: "left", heading: "Smarter teams", body: "Body." },
    ];
    const { container } = render(<SectionRenderer sections={sections} site={getSite()} />);
    const themes = Array.from(container.querySelectorAll("section")).map((s) => s.getAttribute("data-theme"));
    expect(themes).toEqual(["paper", "tint", "paper"]);
    expect(screen.getByText("Product engineering")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Smarter teams" })).toBeInTheDocument();
  });
});
