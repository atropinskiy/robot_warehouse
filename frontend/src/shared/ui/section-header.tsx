import Link from "next/link";
import { Heading } from "./heading";

type SectionHeaderProps = {
  id: string;
  title: string;
  link: { href: string; label: string };
};

export function SectionHeader({ id, title, link }: SectionHeaderProps) {
  return (
    <div className="mt-7.5 mb-3.5 flex items-baseline justify-between gap-4">
      <Heading as="h2" variant="section" id={id}>
        {title}
      </Heading>
      <Link
        href={link.href}
        className="rounded font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {link.label} →
      </Link>
    </div>
  );
}
