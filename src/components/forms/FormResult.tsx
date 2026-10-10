import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const CONTACT_EMAIL = "hello.norway@99x.io";

/** Static confirmation / failure screen for contact posts made without JavaScript. */
export function FormResult({ eyebrow, title, body, mailto = false }: { eyebrow: string; title: string; body: string; mailto?: boolean }) {
  return (
    <section data-theme="dark" className="flex min-h-svh flex-col items-start justify-end gap-8 bg-ink text-paper site-x pb-16">
      <Eyebrow className="text-paper/60">{eyebrow}</Eyebrow>
      <h1 className="text-hero">{title}</h1>
      <p className="max-w-[35em] text-body-m text-paper/70">{body}</p>
      <div className="flex flex-wrap gap-4">
        <Button link={{ label: "Back to home", href: "/" }} variant="light" />
        {mailto ? (
          <Button link={{ label: `Email ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}` }} variant="light" />
        ) : (
          <Button link={{ label: "Back to contact", href: "/contact" }} variant="light" />
        )}
      </div>
    </section>
  );
}
