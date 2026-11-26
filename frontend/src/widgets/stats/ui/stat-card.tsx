import { cn } from "@/shared/lib/utils";
import { Card, Text } from "@/shared/ui";
import type { StatItem } from "../model/mocks";

export function StatCard({ label, value, total, hint, hintTone }: StatItem) {
  return (
    <Card className="gap-0 rounded-[14px] px-4.5 py-4">
      <Text tone="muted" className="text-[13px] font-medium">
        {label}
      </Text>
      <Text className="mt-1.5 font-mono text-3xl leading-[1.2] font-medium tabular-nums">
        {value}
        {total !== undefined && (
          <Text as="span" tone="muted" className="font-mono text-base">
            /{total}
          </Text>
        )}
      </Text>
      <Text
        variant="caption"
        className={cn(
          "mt-0.5",
          hintTone === "muted" ? "text-muted-foreground" : "text-success",
        )}
      >
        {hint}
      </Text>
    </Card>
  );
}
