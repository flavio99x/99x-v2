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
    expect(container.querySelectorAll("[data-piece]")).toHaveLength(5);
    expect([...container.querySelectorAll("path")].map((p) => p.getAttribute("fill"))).toEqual(["#A2B372", "#BC8E58", "#C49FD5", "#905B54", "#CCB189", "#B44B4B", "#7A6977"]);
  });
});
