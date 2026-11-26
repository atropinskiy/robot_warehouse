import Link from "next/link";
import { routes } from "@/shared/config";
import { AddIcon } from "@/shared/icons";
import { Text } from "@/shared/ui";

// TODO: открыть форму создания склада (features/create-warehouse).
export function CreateWarehouseCard() {
  return (
    <Link
      href={routes.warehouses}
      className="grid min-h-[260px] place-items-center rounded-xl border border-dashed border-border bg-card text-center outline-none transition-[border-color,translate] hover:-translate-y-0.5 hover:border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div>
        <span className="mx-auto mb-2.5 grid size-11 place-items-center rounded-xl bg-muted text-primary">
          <AddIcon aria-hidden="true" className="size-6" />
        </span>
        <Text className="font-semibold">Создать склад</Text>
        <Text tone="muted">Пустая карта 20×20</Text>
      </div>
    </Link>
  );
}
