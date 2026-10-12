import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SectionTag } from "@/components/ui/SectionTag";

describe("SectionTag", () => {
  it("renders the label", () => {
    const { container } = render(<SectionTag label="About us" />);
    expect(container.textContent).toContain("About us");
  });
});
