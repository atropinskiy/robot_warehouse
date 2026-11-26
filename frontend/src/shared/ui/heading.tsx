import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

const headingStyles = {
  display:
    "font-display text-(length:--text-heading-display)/(--text-heading-display--line-height) font-bold tracking-[-0.01em]",
  page: "font-display text-(length:--text-heading-page)/(--text-heading-page--line-height) font-bold tracking-[-0.01em]",
  section:
    "font-display text-(length:--text-heading-section)/(--text-heading-section--line-height) font-medium",
  card: "text-(length:--text-heading-card)/(--text-heading-card--line-height) font-semibold",
  subsection:
    "text-(length:--text-heading-subsection)/(--text-heading-subsection--line-height) font-semibold",
  compact:
    "text-(length:--text-heading-compact)/(--text-heading-compact--line-height) font-semibold",
};

type HeadingProps = ComponentProps<"h1"> & {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant: keyof typeof headingStyles;
};

export function Heading({
  as: Tag,
  variant,
  className,
  ...props
}: HeadingProps) {
  return <Tag className={cn(headingStyles[variant], className)} {...props} />;
}
