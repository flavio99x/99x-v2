import type { ContactInput } from "./schema";

export type ContactMessage = ContactInput & { receivedAt: string };
export interface ContactProvider {
  send(msg: ContactMessage): Promise<void>;
}

class LogProvider implements ContactProvider {
  async send(msg: ContactMessage) {
    // Phase 1: no delivery target yet. Logs server-side only (Vercel function logs).
    console.info("[contact]", JSON.stringify({ ...msg, message: `${msg.message.slice(0, 200)}…` }));
  }
}

export function getProvider(): ContactProvider {
  switch (process.env.CONTACT_PROVIDER ?? "log") {
    case "log":
    default:
      return new LogProvider();
  }
}
