import type { Metadata } from "next";
import { PagePlaceholder } from "@/shared/ui";

export const metadata: Metadata = { title: "Настройки · Robot Warehouse" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Настройки"
      description="Личный кабинет и настройки аккаунта."
    />
  );
}
