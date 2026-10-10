"use client";
import { useEffect, useState } from "react";
import { Field } from "@/components/ui/Field";
import { ButtonAction } from "@/components/ui/Button";

type State = { status: "idle" | "submitting" | "success" | "error"; errors: Record<string, string> };
const FALLBACK = "hello.norway@99x.io";

export function ContactForm({ source, compact = false }: { source: string; compact?: boolean }) {
  const [state, setState] = useState<State>({ status: "idle", errors: {} });

  // Native (no-JS) posts redirect back with ?sent=1 / ?error=...; read it in an effect so server and client HTML match.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must run after hydration to keep SSR markup identical
    if (q.get("sent") === "1") setState({ status: "success", errors: {} });
    else if (q.get("error")) setState({ status: "error", errors: {} });
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "submitting", errors: {} });
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ ...data, consent: data.consent === "on" }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Record<string, string> };
      if (res.ok && body.ok) return setState({ status: "success", errors: {} });
      if (res.status === 400 && body.errors) return setState({ status: "idle", errors: body.errors });
      setState({ status: "error", errors: {} });
    } catch {
      setState({ status: "error", errors: {} });
    }
  }

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col gap-4 border-t border-ink pt-8">
        <p className="text-h2">Thanks — we&apos;ve got your message.</p>
        <p className="text-body-m text-ink/70">The right team will get back to you within two working days.</p>
      </div>
    );
  }

  const e = state.errors;
  return (
    <form action="/api/contact" method="post" onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <input type="hidden" name="source" value={source} />
      {/* Honeypot: hidden from people, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <Field name="name" label="Name" required autoComplete="name" error={e.name} maxLength={120} />
      <Field name="email" type="email" label="Email" required autoComplete="email" error={e.email} maxLength={200} />
      {!compact && <Field name="company" label="Company" autoComplete="organization" maxLength={120} />}
      <Field name="phone" type="tel" label="Phone" hint="Optional" autoComplete="tel" maxLength={40} />
      <Field name="message" type="textarea" label="Message" hint="What are you building, and how can we help?" required error={e.message} maxLength={5000} />
      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 text-body-s">
          <input type="checkbox" name="consent" required aria-invalid={e.consent ? true : undefined} aria-describedby={e.consent ? "f-consent-err" : undefined} className="mt-0.5 size-5 accent-[var(--color-accent-deep)]" />
          <span>I have read and accept the <a href="https://99x.io/compliance/privacy-policy" rel="noopener" className="underline underline-offset-2">privacy policy</a>.</span>
        </label>
        {e.consent && <p id="f-consent-err" className="font-mono text-eyebrow-m font-light uppercase text-logo-red">{e.consent}</p>}
      </div>
      {state.status === "error" && (
        <p role="alert" className="text-body-s text-logo-red">
          Something went wrong on our side. Please try again, or email us at <a className="underline" href={`mailto:${FALLBACK}`}>{FALLBACK}</a>.
        </p>
      )}
      <div aria-live="polite" className="sr-only">{Object.keys(e).length ? `${Object.keys(e).length} fields need attention.` : ""}</div>
      <ButtonAction type="submit" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Sending…" : "Send"}
      </ButtonAction>
    </form>
  );
}
