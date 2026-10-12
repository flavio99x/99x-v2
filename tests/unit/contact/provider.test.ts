// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import { getProvider, ResendProvider } from "@/lib/contact/provider";

const msg = {
  name: "Ada <Lovelace>",
  email: "ada@example.com",
  company: "Analytical",
  message: "Hello & welcome, <b>team</b>.",
  consent: true as const,
  source: "contact",
  receivedAt: "2026-10-12T10:00:00.000Z",
};

afterEach(() => vi.unstubAllGlobals());

describe("getProvider", () => {
  it("logs when no Resend key is set", () => {
    expect(getProvider({} as NodeJS.ProcessEnv)).not.toBeInstanceOf(ResendProvider);
  });
  it("uses Resend when the key is set, unless CONTACT_PROVIDER says log", () => {
    const env = { RESEND_API_KEY: "re_test", CONTACT_TO: "a@x.io" } as unknown as NodeJS.ProcessEnv;
    expect(getProvider(env)).toBeInstanceOf(ResendProvider);
    expect(getProvider({ ...env, CONTACT_PROVIDER: "log" })).not.toBeInstanceOf(ResendProvider);
  });
  it("refuses Resend without a recipient", () => {
    expect(() => getProvider({ RESEND_API_KEY: "re_test" } as unknown as NodeJS.ProcessEnv)).toThrow(/CONTACT_TO/);
  });
});

describe("ResendProvider", () => {
  it("posts an escaped email that replies to the sender", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    await new ResendProvider("re_test", ["a@x.io", "b@x.io"], "Site <site@x.io>").send(msg);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_test");
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({ from: "Site <site@x.io>", to: ["a@x.io", "b@x.io"], reply_to: "ada@example.com", subject: "New website enquiry: Ada <Lovelace>, Analytical" });
    expect(body.html).toContain("Ada &lt;Lovelace&gt;");
    expect(body.html).toContain("Hello &amp; welcome, &lt;b&gt;team&lt;/b&gt;.");
    expect(body.html).not.toContain("<b>team</b>");
    expect(body.text).toContain("Company: Analytical");
  });
  it("throws when Resend rejects, so the route reports a failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("bad from", { status: 422 })));
    await expect(new ResendProvider("re_test", ["a@x.io"], "x@x.io").send(msg)).rejects.toThrow(/422/);
  });
});
