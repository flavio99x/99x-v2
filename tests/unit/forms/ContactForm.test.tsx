import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/forms/ContactForm";

afterEach(() => vi.restoreAllMocks());

async function fill(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Name/), "Ada");
  await user.type(screen.getByLabelText(/^Email/), "ada@example.com");
  await user.type(screen.getByLabelText(/^Message/), "We need a team of five engineers.");
  await user.click(screen.getByRole("checkbox"));
}

describe("ContactForm", () => {
  it("is a native form that posts to the API without JS", () => {
    const { container } = render(<ContactForm source="contact" />);
    const form = container.querySelector("form")!;
    expect(form).toHaveAttribute("action", "/api/contact");
    expect(form).toHaveAttribute("method", "post");
    expect(container.querySelector('input[name="website"]')).toHaveAttribute("tabindex", "-1");
  });

  it("shows server field errors and marks fields invalid", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ ok: false, errors: { email: "Enter a valid email address." } }), { status: 400 }));
    const user = userEvent.setup();
    render(<ContactForm source="contact" />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute("aria-invalid", "true");
  });

  it("replaces the form with a confirmation on success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const user = userEvent.setup();
    render(<ContactForm source="contact" />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByRole("status")).toHaveTextContent(/thanks/i);
  });

  it("shows a mailto fallback when the network fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    const user = userEvent.setup();
    render(<ContactForm source="contact" />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/hello.norway@99x.io/);
  });

  it("shows success after a no-JS redirect with ?sent=1", () => {
    window.history.replaceState({}, "", "/contact?sent=1");
    render(<ContactForm source="contact" />);
    expect(screen.getByRole("status")).toHaveTextContent(/thanks/i);
    window.history.replaceState({}, "", "/");
  });
});
