import { NextResponse } from "next/server";
import { parseContact } from "@/lib/contact/schema";
import { getProvider } from "@/lib/contact/provider";
import { createRateLimiter } from "@/lib/contact/rate-limit";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

async function readBody(req: Request): Promise<unknown> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return req.json();
  const form = await req.formData();
  return Object.fromEntries(Array.from(form.entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""]));
}

export async function POST(req: Request) {
  const wantsJson = (req.headers.get("accept") ?? "").includes("application/json");
  const back = (q: string) => NextResponse.redirect(new URL(`/contact?${q}`, req.url), 303);
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";

  if (!limiter.hit(ip))
    return wantsJson ? NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 }) : back("error=rate");

  let data: unknown;
  try {
    data = await readBody(req);
  } catch {
    return wantsJson
      ? NextResponse.json({ ok: false, errors: { form: "Invalid submission." } }, { status: 400 })
      : back("error=1");
  }

  const parsed = parseContact(data);
  if (!parsed.ok)
    return wantsJson ? NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 }) : back("error=1");

  if (parsed.value.website) return wantsJson ? NextResponse.json({ ok: true }) : back("sent=1"); // honeypot

  try {
    const { website: _hp, ...msg } = parsed.value;
    void _hp;
    await getProvider().send({ ...msg, receivedAt: new Date().toISOString() });
  } catch (err) {
    console.error("[contact] provider failed", err);
    return wantsJson ? NextResponse.json({ ok: false, error: "server" }, { status: 502 }) : back("error=1");
  }
  return wantsJson ? NextResponse.json({ ok: true }) : back("sent=1");
}
