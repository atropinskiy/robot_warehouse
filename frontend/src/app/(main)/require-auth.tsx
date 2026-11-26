"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config";
import { useSessionStore } from "@/entities/session";

// Защита приватных страниц: неавторизованных отправляем на вход.
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const status = useSessionStore((s) => s.status);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(routes.login);
    }
  }, [router, status]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Загрузка…</p>
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return <>{children}</>;
}
