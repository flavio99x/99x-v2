import type { IconName } from "@/content/schema";
import { Icon } from "./Icon";
import { Eyebrow } from "./Eyebrow";

export function Stat({ value, label, icon }: { value: string; label: string; icon: IconName }) {
  return (
    <div data-fade className="flex flex-col gap-6 border-t border-ink/20 pt-4">
      <Icon name={icon} className="size-12" />
      <p className="text-stat [text-box:trim-both_cap_alphabetic]">{value}</p>
      <Eyebrow>{label}</Eyebrow>
    </div>
  );
}
