import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

const textStyles = {
  body: "text-sm leading-normal",
  caption: "text-xs leading-snug",
  mono: "font-mono text-xs leading-normal tabular-nums",
};

type TextProps = ComponentProps<"p"> & {
  as?: "p" | "span";
  variant?: keyof typeof textStyles;
  tone?: "default" | "muted" | "danger";
};

export function Text({
  as: Tag = "p",
  variant = "body",
  tone = "default",
  className,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(
        textStyles[variant],
        tone === "muted" && "text-muted-foreground",
        tone === "danger" && "text-destructive",
        className,
      )}
      {...props}
    />
  );
}
