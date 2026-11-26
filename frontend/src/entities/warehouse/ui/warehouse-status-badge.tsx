import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui";
import { warehouseStatusLabel } from "../model/labels";
import type { WarehouseStatus } from "../model/types";

const statusStyles: Record<WarehouseStatus, string> = {
  running: "text-success",
  paused: "text-warning",
  stopped: "text-muted-foreground",
};

type WarehouseStatusBadgeProps = {
  status: WarehouseStatus;
  className?: string;
};

export function WarehouseStatusBadge({
  status,
  className,
}: WarehouseStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "bg-background/85 font-semibold backdrop-blur-sm",
        statusStyles[status],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full bg-current",
          status === "running" && "animate-pulse",
        )}
      />
      {warehouseStatusLabel[status]}
    </Badge>
  );
}
