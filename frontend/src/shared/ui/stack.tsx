import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

const gaps = { none: "gap-0", sm: "gap-2", md: "gap-3", lg: "gap-4" };
const alignments = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};
const distributions = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

type StackProps = ComponentProps<"div"> & {
  gap?: keyof typeof gaps;
  align?: keyof typeof alignments;
  justify?: keyof typeof distributions;
};

function Stack({
  direction,
  gap = "md",
  align = "stretch",
  justify = "start",
  className,
  ...props
}: StackProps & { direction: "flex-row" | "flex-col" }) {
  return (
    <div
      className={cn(
        "flex",
        direction,
        gaps[gap],
        alignments[align],
        distributions[justify],
        className,
      )}
      {...props}
    />
  );
}

export function HStack(props: StackProps) {
  return <Stack {...props} direction="flex-row" />;
}

export function VStack(props: StackProps) {
  return <Stack {...props} direction="flex-col" />;
}
