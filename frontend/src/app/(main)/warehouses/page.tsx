import type { Metadata } from "next";
import { PagePlaceholder } from "@/shared/ui";

export const metadata: Metadata = { title: "Склады · Robot Warehouse" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Склады"
      description="Создание, переименование и удаление складов."
    />
  );
}
