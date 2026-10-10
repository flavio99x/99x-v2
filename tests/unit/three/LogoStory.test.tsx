import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LogoStory } from "@/components/three/LogoStory";
import { getSite } from "@/content";

vi.mock("@/lib/motion", () => ({ prefersReducedMotion: () => true, useReducedMotion: () => true }));

describe("LogoStory (reduced motion)", () => {
  const offices = getSite().offices;
  it("renders the full office list and the static logo without pinning", () => {
    const { container } = render(<LogoStory offices={offices} />);
    for (const o of offices) expect(screen.getByText(o.city)).toBeInTheDocument();
    expect(container.querySelector("[data-pinned]")).toBeNull();
    expect(container.querySelector("canvas")).toBeNull();
    expect(container.querySelectorAll('path[fill-rule="evenodd"]')).toHaveLength(5);
  });
});
