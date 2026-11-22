import type { Metadata } from "next";
import { PagePlaceholder } from "@/shared/ui";

export const metadata: Metadata = { title: "Редактор карты · Robot Warehouse" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Редактор карты"
      description="Размещение препятствий, станций и роботов на сетке."
    />
  );
}
