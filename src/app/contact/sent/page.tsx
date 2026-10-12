import type { Metadata } from "next";
import { FormResult } from "@/components/forms/FormResult";

export const metadata: Metadata = { title: "Message sent", robots: { index: false } };

export default function ContactSentPage() {
  return (
    <FormResult
      eyebrow="Contact"
      title="Thanks — we've got your message."
      body="The right team will get back to you within two working days."
    />
  );
}
