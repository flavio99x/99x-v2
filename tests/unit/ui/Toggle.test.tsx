import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Toggle } from "@/components/ui/Toggle";

function Harness({ onChange = vi.fn() }) {
  const [v, setV] = useState(0);
  return <Toggle items={["01", "02", "03"]} value={v} onChange={(i) => { setV(i); onChange(i); }} label="Proof points" idPrefix="t" />;
}

describe("Toggle", () => {
  it("exposes a tablist with the selected tab", () => {
    render(<Harness />);
    expect(screen.getByRole("tablist", { name: "Proof points" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "01" })).toHaveAttribute("aria-selected", "true");
  });
  it("moves with arrow keys and wraps", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    screen.getByRole("tab", { name: "01" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "03" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "03" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "01" })).toHaveAttribute("aria-selected", "true");
  });
  it("only the selected tab is in the tab order", () => {
    render(<Harness />);
    expect(screen.getByRole("tab", { name: "01" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "02" })).toHaveAttribute("tabindex", "-1");
  });
});
