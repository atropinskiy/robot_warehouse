import type { Metadata } from "next";
import { PagePlaceholder } from "@/shared/ui";

export const metadata: Metadata = { title: "История · Robot Warehouse" };

export default function Page() {
  return (
    <PagePlaceholder
      title="История"
      description="Выполненные задания и события симуляции."
    />
  );
}
