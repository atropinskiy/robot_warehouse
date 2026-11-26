import Link from "next/link";
import { Badge, Card, Heading, HStack } from "@/shared/ui";
import { warehouseRoleLabel } from "../model/labels";
import type { Warehouse } from "../model/types";
import { WarehouseMapPreview } from "./warehouse-map-preview";
import { WarehouseMetric } from "./warehouse-metric";
import { WarehouseStatusBadge } from "./warehouse-status-badge";

type WarehouseCardProps = {
  warehouse: Warehouse;
  href: string;
};

export function WarehouseCard({ warehouse, href }: WarehouseCardProps) {
  const { name, status, role, robotCount, queueSize, size } = warehouse;

  return (
    <Card className="relative gap-0 py-0 transition-[border-color,translate] focus-within:border-ring hover:-translate-y-0.5 hover:border-input">
      <div className="relative aspect-[1.6] overflow-hidden border-b border-border">
        <WarehouseMapPreview
          seed={warehouse.previewSeed}
          robots={warehouse.previewRobots}
        />
        <WarehouseStatusBadge
          status={status}
          className="absolute top-2.5 left-2.5"
        />
      </div>
      <div className="px-4 pt-3.5 pb-4">
        <HStack align="center" justify="between" gap="sm">
          <Heading as="h3" variant="card" className="truncate">
            {/* Растянутая ссылка: вся карточка кликабельна, но в дереве одна ссылка. */}
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {name}
            </Link>
          </Heading>
          <Badge variant="outline" className="rounded-md text-muted-foreground">
            {warehouseRoleLabel[role]}
          </Badge>
        </HStack>
        <HStack gap="lg" className="mt-2.5 flex-wrap">
          <WarehouseMetric value={robotCount} label="роб." />
          <WarehouseMetric value={queueSize} label="в очереди" />
          <WarehouseMetric value={`${size.width}×${size.height}`} />
        </HStack>
      </div>
    </Card>
  );
}
