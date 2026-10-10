import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CardGrid } from "@/components/sections/CardGrid";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/" }));
vi.mock("@/lib/motion", () => ({ prefersReducedMotion: () => true, useReducedMotion: () => true }));

describe("CardGrid", () => {
  it("only collapses descriptions of linked cards, and only behind the fine-pointer hover variant", () => {
    render(
      <CardGrid
        section={{
          type: "cardGrid", theme: "tint", head: { index: "S.02", label: "What we do", statement: "Ways we help." },
          cards: [
            { title: "Linked", description: "Has a link.", icon: "layers", link: { label: "Linked", href: "/services#product-engineering" } },
            { title: "Plain", description: "No link.", icon: "browser" },
          ],
        }}
      />,
    );
    const linked = screen.getByText("Has a link.").className;
    expect(linked).toContain("hover-fine:opacity-0");
    expect(linked.split(/\s+/).filter((c) => /opacity-0|max-h-0/.test(c)).every((c) => c.startsWith("hover-fine:"))).toBe(true);
    expect(screen.getByText("No link.").className).not.toMatch(/opacity-0|max-h-0/);
  });
});
