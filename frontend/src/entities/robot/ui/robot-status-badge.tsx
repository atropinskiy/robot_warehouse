import { Badge } from "@/shared/ui";
import { robotStatusLabel } from "../model/labels";
import type { RobotStatus } from "../model/types";

const statusVariant = {
  free: "success",
  busy: "info",
  waiting: "warning",
  broken: "destructive",
} as const satisfies Record<RobotStatus, string>;

export function RobotStatusBadge({ status }: { status: RobotStatus }) {
  return (
    <Badge variant={statusVariant[status]} className="rounded-md font-semibold">
      {robotStatusLabel[status]}
    </Badge>
  );
}
