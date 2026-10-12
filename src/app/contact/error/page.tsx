import type { Metadata } from "next";
import { FormResult, CONTACT_EMAIL } from "@/components/forms/FormResult";

export const metadata: Metadata = { title: "Message not sent", robots: { index: false } };

export default function ContactErrorPage() {
  return (
    <FormResult
      eyebrow="Contact"
      title="Your message didn't go through."
      body={`Please check the form and try again in a few minutes, or email us directly at ${CONTACT_EMAIL}.`}
      mailto
    />
  );
}
