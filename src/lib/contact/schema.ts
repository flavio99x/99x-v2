import { z } from "zod";

const truthy = z.union([z.literal(true), z.literal("true"), z.literal("on")]);

export const ContactSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name.").max(120, "That name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(200, "That email is too long."),
  company: z.string().trim().max(120, "That company name is too long.").optional(),
  phone: z.string().trim().max(40, "That phone number is too long.").optional(),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a bit more (at least 10 characters).")
    .max(5000, "Keep it under 5,000 characters."),
  consent: truthy,
  source: z.string().trim().max(40, "Please check this field.").default("contact"),
  website: z.string().optional(),
});
export type ContactInput = z.infer<typeof ContactSchema>;

const MESSAGES: Record<string, string> = { consent: "Please accept the privacy policy." };

export function parseContact(
  data: unknown,
): { ok: true; value: ContactInput } | { ok: false; errors: Record<string, string> } {
  if (typeof data !== "object" || data === null) return { ok: false, errors: { form: "Invalid submission." } };
  const r = ContactSchema.safeParse(data);
  if (r.success) return { ok: true, value: r.data };
  const errors: Record<string, string> = {};
  for (const issue of r.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) {
      errors[key] =
        MESSAGES[key] ??
        (issue.message.startsWith("Invalid") || issue.message.startsWith("Required") ? fallback(key) : issue.message);
    }
  }
  return { ok: false, errors };
}

function fallback(key: string) {
  return (
    (
      {
        name: "Please tell us your name.",
        email: "Enter a valid email address.",
        message: "Tell us a bit more (at least 10 characters).",
      } as Record<string, string>
    )[key] ?? "Please check this field."
  );
}
