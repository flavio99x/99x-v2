import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <section data-theme="dark" className="flex min-h-svh flex-col items-start justify-end gap-8 bg-ink text-paper site-x pb-16">
      <Eyebrow className="text-paper/60">404</Eyebrow>
      <h1 className="text-hero">This page doesn&apos;t exist — yet.</h1>
      <p className="max-w-[35em] text-body-m text-paper/70">We&apos;re rebuilding 99x.io page by page. What you&apos;re looking for may still live on the current site.</p>
      <div className="flex gap-4">
        <Button link={{ label: "Back to home", href: "/" }} variant="light" />
        <Button link={{ label: "Current 99x.io", href: "https://99x.io", external: true }} variant="light" />
      </div>
    </section>
  );
}
