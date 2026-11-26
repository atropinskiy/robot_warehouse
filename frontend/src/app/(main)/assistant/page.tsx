import type { Metadata } from "next";
import { PagePlaceholder } from "@/shared/ui";

export const metadata: Metadata = { title: "AI-помощник · Robot Warehouse" };

export default function Page() {
  return (
    <PagePlaceholder
      title="AI-помощник"
      description="Создание заданий и анализ склада с помощью AI."
    />
  );
}
