// @vitest-environment node
import { describe, it, expect } from "vitest";
import { renderContactEmail } from "@/lib/contact/email";

const msg = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical",
  phone: "+47 22 00 00 00",
  message: "Hello & welcome,\n<b>team</b>.",
  consent: true as const,
  source: "nearshore-usa",
  receivedAt: "2026-10-12T11:47:00.159Z",
};

describe("renderContactEmail", () => {
  it("names the sender and company in the subject", () => {
    expect(renderContactEmail(msg).subject).toBe("New website enquiry: Ada Lovelace, Analytical");
    expect(renderContactEmail({ ...msg, company: undefined }).subject).toBe("New website enquiry: Ada Lovelace");
  });
  it("shows a readable form name and UTC time instead of raw values", () => {
    const { html, text } = renderContactEmail(msg);
    expect(html).toContain("Nearshore tech talent (USA)");
    expect(text).toContain("Received: Mon, 12 Oct 2026, 11:47 UTC");
    expect(renderContactEmail({ ...msg, source: "deploy-test" }).text).toContain("Form: deploy-test");
  });
  it("links the reply button, email and phone", () => {
    const { html } = renderContactEmail(msg);
    expect(html).toContain('href="mailto:ada@example.com?subject=Re%3A%20Your%20enquiry%20to%2099x"');
    expect(html).toContain("Reply to Ada");
    expect(html).toContain('href="tel:+4722000000"');
  });
  it("escapes visitor input and leaves out empty optional rows", () => {
    const { html } = renderContactEmail({ ...msg, name: "<script>", phone: undefined, company: undefined });
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).toContain("Hello &amp; welcome,\n&lt;b&gt;team&lt;/b&gt;.");
    expect(html).not.toContain(">Phone<");
    expect(html).not.toContain(">Company<");
  });
});
