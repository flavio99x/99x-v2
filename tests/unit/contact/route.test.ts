// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const send = vi.fn();
vi.mock("@/lib/contact/provider", () => ({ getProvider: () => ({ send }) }));

const json = (body: unknown, ip = "1.1.1.1") =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const valid = { name: "Ada", email: "ada@example.com", message: "We need a team of five engineers.", consent: true };

describe("POST /api/contact", () => {
  beforeEach(() => { send.mockReset(); vi.resetModules(); });

  it("sends a valid message", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(json(valid));
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
  });

  it("returns 400 with field errors", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(json({ ...valid, email: "bad" }));
    expect(res.status).toBe(400);
    expect((await res.json()).errors.email).toBeDefined();
    expect(send).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without sending", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(json({ ...valid, website: "spam.example" }));
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed JSON", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(json("{not json"));
    expect(res.status).toBe(400);
  });

  it("rate limits after 5 requests per IP", async () => {
    const { POST } = await import("@/app/api/contact/route");
    for (let i = 0; i < 5; i++) expect((await POST(json(valid, "9.9.9.9"))).status).toBe(200);
    expect((await POST(json(valid, "9.9.9.9"))).status).toBe(429);
  });

  it("returns 502 when the provider fails", async () => {
    send.mockRejectedValueOnce(new Error("down"));
    const { POST } = await import("@/app/api/contact/route");
    expect((await POST(json(valid, "2.2.2.2"))).status).toBe(502);
  });

  it("redirects native form posts", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const body = new URLSearchParams({ name: "Ada", email: "ada@example.com", message: "We need a team of five engineers.", consent: "on" });
    const res = await POST(new Request("http://localhost/api/contact", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": "3.3.3.3" }, body,
    }));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toContain("/contact?sent=1");
  });
});
