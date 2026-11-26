import { Text } from "@/shared/ui";

type WarehouseMetricProps = {
  value: string | number;
  label?: string;
};

export function WarehouseMetric({ value, label }: WarehouseMetricProps) {
  return (
    <Text as="span" tone="muted" className="text-[13px]">
      <Text as="span" variant="mono" className="text-[13px] text-foreground">
        {value}
      </Text>
      {label && ` ${label}`}
    </Text>
  );
}
