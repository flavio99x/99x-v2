import type { ContactMessage } from "./provider";

// Brand tokens (globals.css), inlined because email clients ignore stylesheets.
const INK = "#160f17";
const TINT = "#efe8f3";
const ACCENT = "#c49fd5";
const ACCENT_DEEP = "#4a3255";
const MUTED = "#6b6370";
const LINE = "#e6e0e9";
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

/** Which form the visitor used (the `source` hidden field); unknown values are shown as-is. */
const FORMS: Record<string, string> = {
  contact: "Contact page",
  "nearshore-usa": "Nearshore tech talent (USA)",
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function formatReceived(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const s = new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC",
  }).format(d);
  return `${s} UTC`;
}

export function renderContactEmail(msg: ContactMessage) {
  const form = FORMS[msg.source] ?? msg.source;
  const received = formatReceived(msg.receivedAt);
  const firstName = msg.name.split(/\s+/)[0];
  const subject = `New website enquiry: ${msg.name}${msg.company ? `, ${msg.company}` : ""}`;
  const replyHref = `mailto:${encodeURIComponent(msg.email).replace(/%40/g, "@")}?subject=${encodeURIComponent("Re: Your enquiry to 99x")}`;

  const details: [string, string, string?][] = [
    ["Name", msg.name],
    ["Email", msg.email, `mailto:${msg.email}`],
    ...(msg.company ? [["Company", msg.company] as [string, string]] : []),
    ...(msg.phone ? [["Phone", msg.phone, `tel:${msg.phone.replace(/[^+\d]/g, "")}`] as [string, string, string]] : []),
    ["Form", form],
    ["Received", received],
  ];

  const text = [
    `New website enquiry from ${msg.name}${msg.company ? ` (${msg.company})` : ""}`,
    "",
    msg.message,
    "",
    "---",
    ...details.map(([k, v]) => `${k}: ${v}`),
    "",
    `Reply to this email to answer ${firstName} directly.`,
  ].join("\n");

  const detailRows = details
    .map(([k, v, href], i) => {
      const value = href
        ? `<a href="${esc(href)}" style="color:${ACCENT_DEEP};text-decoration:underline;">${esc(v)}</a>`
        : esc(v);
      const border = i === details.length - 1 ? "" : `border-bottom:1px solid ${LINE};`;
      return `<tr>
<td style="${border}padding:10px 16px 10px 0;width:96px;vertical-align:top;font:600 11px/16px ${FONT};letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};">${k}</td>
<td style="${border}padding:10px 0;vertical-align:top;font:400 15px/22px ${FONT};color:${INK};">${value}</td>
</tr>`;
    })
    .join("");

  const preheader = esc(msg.message.replace(/\s+/g, " ").slice(0, 110));

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#f5f2f6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f2f6;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${LINE};border-radius:8px;border-collapse:separate;overflow:hidden;">

<tr><td style="background:${INK};padding:20px 32px;border-radius:8px 8px 0 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="font:700 22px/24px ${FONT};letter-spacing:-0.02em;color:#ffffff;">99x</td>
<td align="right" style="font:600 11px/24px ${FONT};letter-spacing:0.12em;text-transform:uppercase;color:${ACCENT};">Website enquiry</td>
</tr></table>
</td></tr>

<tr><td style="padding:32px 32px 8px;">
<p style="margin:0 0 8px;font:600 11px/16px ${FONT};letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">New message · ${esc(form)}</p>
<h1 style="margin:0;font:600 24px/30px ${FONT};letter-spacing:-0.01em;color:${INK};">${esc(msg.name)}${msg.company ? `<span style="font-weight:400;color:${MUTED};"> from ${esc(msg.company)}</span>` : ""}</h1>
</td></tr>

<tr><td style="padding:16px 32px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:${TINT};border-left:3px solid ${ACCENT_DEEP};padding:20px 24px;font:400 15px/24px ${FONT};color:${INK};white-space:pre-wrap;">${esc(msg.message)}</td>
</tr></table>
</td></tr>

<tr><td style="padding:24px 32px 8px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:${INK};border-radius:4px;">
<a href="${esc(replyHref)}" style="display:inline-block;padding:12px 22px;font:600 14px/20px ${FONT};color:#ffffff;text-decoration:none;">Reply to ${esc(firstName)}</a>
</td></tr></table>
</td></tr>

<tr><td style="padding:16px 32px 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">${detailRows}</table>
</td></tr>

</table>
<p style="margin:16px 0 0;max-width:600px;font:400 12px/18px ${FONT};color:${MUTED};">Sent from the contact form on the 99x website. Replying to this email goes straight to ${esc(msg.name)}.</p>
</td></tr>
</table>
</body></html>`;

  return { subject, text, html };
}
