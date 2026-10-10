import NextLink from "next/link";
import type { Link } from "@/content/schema";

type Props = { link: Link; className?: string; children?: React.ReactNode; onClick?: React.MouseEventHandler<HTMLAnchorElement> };

const isPlain = (href: string) => href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#");

export function SmartLink({ link, className, children, onClick }: Props) {
  const content = children ?? link.label;
  if (link.external) {
    return (
      <a href={link.href} rel="noopener" className={className} onClick={onClick}>
        {content}
      </a>
    );
  }
  if (isPlain(link.href)) {
    return (
      <a href={link.href} className={className} onClick={onClick}>
        {content}
      </a>
    );
  }
  return (
    <NextLink href={link.href} className={className} onClick={onClick}>
      {content}
    </NextLink>
  );
}
