"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config";
import { useSessionStore } from "@/entities/session";

// Страницы входа/регистрации рендерятся сразу (без экрана загрузки).
// Если пользователь уже авторизован — редиректим на дашборд после проверки сессии.
export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const status = useSessionStore((s) => s.status);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(routes.dashboard);
    }
  }, [router, status]);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
