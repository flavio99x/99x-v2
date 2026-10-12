import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SmartLink } from "@/components/ui/SmartLink";

describe("SmartLink", () => {
  it("renders external links as plain anchors with rel", () => {
    render(<SmartLink link={{ label: "AI", href: "https://99x.io/ai-99x", external: true }} />);
    const a = screen.getByRole("link", { name: "AI" });
    expect(a).toHaveAttribute("href", "https://99x.io/ai-99x");
    expect(a).toHaveAttribute("rel", "noopener");
  });
  it("renders mailto as plain anchor", () => {
    render(<SmartLink link={{ label: "Mail", href: "mailto:hello.norway@99x.io" }} />);
    expect(screen.getByRole("link", { name: "Mail" })).toHaveAttribute("href", "mailto:hello.norway@99x.io");
  });
  it("renders internal links", () => {
    render(<SmartLink link={{ label: "About", href: "/about-us" }} />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about-us");
  });
});
