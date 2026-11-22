import type { Metadata } from "next";
import { PagePlaceholder } from "@/shared/ui";

export const metadata: Metadata = { title: "Задания · Robot Warehouse" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Задания"
      description="Очередь заданий на перевозку грузов с фильтрами по состоянию."
    />
  );
}
