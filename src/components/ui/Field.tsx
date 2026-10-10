import { cn } from "@/lib/cn";

type Props = {
  name: string;
  label: string;
  hint?: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  error?: string;
  autoComplete?: string;
  maxLength?: number;
};

export function Field({ name, label, hint, type = "text", required, error, autoComplete, maxLength }: Props) {
  const id = `f-${name}`;
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  const common = {
    id, name, required, autoComplete, maxLength,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: cn(
      "w-full border-0 border-b bg-transparent py-6 text-body-s font-bold outline-none placeholder:text-ink/30 focus-visible:border-accent-deep",
      error ? "border-logo-red" : "border-ink",
    ),
  };
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && <span id={`${id}-hint`} className="mt-1 text-body-s text-ink/50">{hint}</span>}
      {type === "textarea" ? <textarea rows={4} {...common} /> : <input type={type} {...common} />}
      {error && <p id={`${id}-err`} className="mt-2 font-mono text-eyebrow-m font-light uppercase text-logo-red">{error}</p>}
    </div>
  );
}
