import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProofToggle } from "@/components/sections/ProofToggle";

const section = {
  type: "proofToggle" as const, theme: "paper" as const,
  head: { index: "S.06", label: "Why 99x" }, subline: "Why work with us",
  items: [{ value: "90%", text: "of clients say we met or exceeded expectations" }, { value: "100+", text: "companies transformed" }],
};

describe("ProofToggle", () => {
  it("shows one proof point at a time and switches via tabs", async () => {
    const user = userEvent.setup();
    render(<ProofToggle section={section} />);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("90%");
    await user.click(screen.getByRole("tab", { name: "02" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("100+");
  });
});
