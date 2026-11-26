"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useSessionStore } from "@/entities/session";

// Инициализирует сессию (GET /auth/me) на старте приложения.
// Не блокирует рендер: защищённые layout'ы сами показывают загрузку.
function SessionProvider({ children }: { children: ReactNode }) {
  const init = useSessionStore((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
}
