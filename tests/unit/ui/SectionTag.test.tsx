import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SectionTag } from "@/components/ui/SectionTag";

describe("SectionTag", () => {
  it("renders index and label", () => {
    const { container } = render(<SectionTag index="S.01" label="About us" />);
    expect(container.textContent).toContain("S.01");
    expect(container.textContent).toContain("About us");
  });
});
