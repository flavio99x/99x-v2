import type { ContactInput } from "./schema";

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

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Emails each submission to the team through Resend's REST API; replies go straight to the sender. */
export class ResendProvider implements ContactProvider {
  constructor(
    private readonly apiKey: string,
    private readonly to: string[],
    private readonly from: string,
  ) {}

  async send(msg: ContactMessage) {
    const rows: [string, string | undefined][] = [
      ["Name", msg.name],
      ["Email", msg.email],
      ["Company", msg.company],
      ["Phone", msg.phone],
      ["Source", msg.source],
      ["Received", msg.receivedAt],
    ];
    const filled = rows.filter((r): r is [string, string] => !!r[1]);
    const text = `${filled.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${msg.message}`;
    const html =
      `<table>${filled.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join("")}</table>` +
      `<p style="white-space:pre-wrap">${escapeHtml(msg.message)}</p>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: this.from,
        to: this.to,
        reply_to: msg.email,
        subject: `Website contact: ${msg.name}${msg.company ? ` (${msg.company})` : ""}`,
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
