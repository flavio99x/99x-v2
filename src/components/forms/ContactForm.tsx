"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Field } from "@/components/ui/Field";
import { ButtonAction } from "@/components/ui/Button";

type State = { status: "idle" | "submitting" | "success" | "error" | "rate"; errors: Record<string, string> };
const FALLBACK = "hello.norway@99x.io";

// false in server HTML, true once hydrated: native validation stays on for visitors without JS.
const noopSubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

export function ContactForm({ source, compact = false }: { source: string; compact?: boolean }) {
  const [state, setState] = useState<State>({ status: "idle", errors: {} });
  const hydrated = useHydrated();
  const formRef = useRef<HTMLFormElement>(null);
  const focusInvalid = useRef(false);
  const rendered = ["name", "email", ...(compact ? [] : ["company"]), "phone", "message", "consent"];

  // After server-side validation fails, take keyboard and screen-reader users to the first problem.
  useEffect(() => {
    if (!focusInvalid.current) return;
    focusInvalid.current = false;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

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
      if (res.status === 400 && body.errors && rendered.some((k) => body.errors?.[k])) {
        focusInvalid.current = true;
        return setState({ status: "idle", errors: body.errors });
      }
      if (res.status === 429) return setState({ status: "rate", errors: {} });
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
  const invalid = rendered.filter((k) => e[k]).length;
  return (
    <form ref={formRef} action="/api/contact" method="post" onSubmit={onSubmit} noValidate={hydrated} className="flex flex-col gap-8">
      <input type="hidden" name="source" value={source} />
      {/* Honeypot: hidden from people, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <Field name="name" label="Name" required autoComplete="name" error={e.name} maxLength={120} />
      <Field name="email" type="email" label="Email" required autoComplete="email" error={e.email} maxLength={200} />
      {!compact && <Field name="company" label="Company" autoComplete="organization" error={e.company} maxLength={120} />}
      <Field name="phone" type="tel" label="Phone" hint="Optional" autoComplete="tel" error={e.phone} maxLength={40} />
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
      {state.status === "rate" && (
        <p role="alert" className="text-body-s text-logo-red">
          Too many messages in a short time — please wait a few minutes or email us at <a className="underline" href={`mailto:${FALLBACK}`}>{FALLBACK}</a>.
        </p>
      )}
      <div aria-live="polite" className="sr-only">{invalid ? `${invalid} ${invalid === 1 ? "field needs" : "fields need"} attention.` : ""}</div>
      <ButtonAction type="submit" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Sending…" : "Send"}
      </ButtonAction>
    </form>
  );
}
