import { describe, it, expect } from "vitest";
import { parseContact } from "@/lib/contact/schema";

const valid = { name: "Ada", email: "ada@example.com", message: "We need a team of five engineers.", consent: "on" };

describe("parseContact", () => {
  it("accepts a valid submission", () => {
    const r = parseContact(valid);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.source).toBe("contact");
  });
  it("returns field errors with friendly messages", () => {
    const r = parseContact({ name: "", email: "nope", message: "short", consent: undefined });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.name).toBe("Please tell us your name.");
      expect(r.errors.email).toBe("Enter a valid email address.");
      expect(r.errors.message).toBe("Tell us a bit more (at least 10 characters).");
      expect(r.errors.consent).toBe("Please accept the privacy policy.");
    }
  });
  it("rejects messages over 5000 chars", () => {
    const r = parseContact({ ...valid, message: "x".repeat(5001) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.message).toBe("Keep it under 5,000 characters.");
  });
  it("rejects non-object input", () => {
    expect(parseContact(null).ok).toBe(false);
    expect(parseContact("hello").ok).toBe(false);
  });
});
