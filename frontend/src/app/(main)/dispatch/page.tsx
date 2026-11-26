import type { Metadata } from "next";
import { PagePlaceholder } from "@/shared/ui";

export const metadata: Metadata = { title: "Диспетчерская · Robot Warehouse" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Диспетчерская"
      description="Карта склада и управление симуляцией в реальном времени."
    />
  );
}
