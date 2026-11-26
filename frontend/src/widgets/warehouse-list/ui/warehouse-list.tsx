import {
  mockWarehouses,
  WarehouseCard,
  type Warehouse,
} from "@/entities/warehouse";
import { routes } from "@/shared/config";
import { CreateWarehouseCard } from "./create-warehouse-card";

export function WarehouseList({
  warehouses = mockWarehouses,
}: {
  warehouses?: Warehouse[];
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3.5">
      {warehouses.map((warehouse) => (
        <WarehouseCard
          key={warehouse.id}
          warehouse={warehouse}
          // TODO: вести на страницу конкретного склада, когда появится роут.
          href={routes.warehouses}
        />
      ))}
      <CreateWarehouseCard />
    </div>
  );
}
