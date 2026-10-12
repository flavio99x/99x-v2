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
  it("gives friendly messages for over-long optional fields", () => {
    const r = parseContact({ ...valid, company: "x".repeat(121), phone: "1".repeat(41), source: "s".repeat(41) });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.company).toBe("That company name is too long.");
      expect(r.errors.phone).toBe("That phone number is too long.");
      expect(r.errors.source).toBe("Please check this field.");
      for (const m of Object.values(r.errors)) expect(m).not.toMatch(/too big|too_big|expected/i);
    }
  });
  it("accepts empty optional fields", () => {
    expect(parseContact({ ...valid, company: "", phone: "" }).ok).toBe(true);
  });
  it("rejects non-object input", () => {
    expect(parseContact(null).ok).toBe(false);
    expect(parseContact("hello").ok).toBe(false);
  });
});
