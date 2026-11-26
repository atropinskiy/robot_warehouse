import type { Metadata } from "next";
import { PagePlaceholder } from "@/shared/ui";

export const metadata: Metadata = { title: "Участники · Robot Warehouse" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Участники"
      description="Приглашение пользователей и управление ролями на складе."
    />
  );
}
