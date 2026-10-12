import type { ContactInput } from "./schema";
import { renderContactEmail } from "./email";

export type ContactMessage = ContactInput & { receivedAt: string };
export interface ContactProvider {
  send(msg: ContactMessage): Promise<void>;
}

class LogProvider implements ContactProvider {
  async send(msg: ContactMessage) {
    // No delivery target: logs server-side only (Vercel function logs). Used locally and in tests.
    console.info("[contact]", JSON.stringify({ ...msg, message: `${msg.message.slice(0, 200)}…` }));
  }
}

/** Emails each submission to the team through Resend's REST API; replies go straight to the sender. */
export class ResendProvider implements ContactProvider {
  constructor(
    private readonly apiKey: string,
    private readonly to: string[],
    private readonly from: string,
  ) {}

  async send(msg: ContactMessage) {
    const { subject, text, html } = renderContactEmail(msg);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: this.from,
        to: this.to,
        reply_to: msg.email,
        subject,
        text,
        html,
      }),
    });
    // The route turns a throw into a 502 / error page, so the visitor knows it didn't go through.
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

/** CONTACT_PROVIDER picks explicitly ("log" | "resend"); otherwise Resend is used whenever its key is set. */
export function getProvider(env: NodeJS.ProcessEnv = process.env): ContactProvider {
  const choice = env.CONTACT_PROVIDER ?? (env.RESEND_API_KEY ? "resend" : "log");
  if (choice === "resend") {
    if (!env.RESEND_API_KEY || !env.CONTACT_TO) throw new Error("Resend needs RESEND_API_KEY and CONTACT_TO");
    const to = env.CONTACT_TO.split(",").map((s) => s.trim()).filter(Boolean);
    return new ResendProvider(env.RESEND_API_KEY, to, env.CONTACT_FROM ?? "99x website <onboarding@resend.dev>");
  }
  return new LogProvider();
}
