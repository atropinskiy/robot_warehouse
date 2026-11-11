"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

type GlobalErrorProps = {
  error: unknown;
  retry: () => void;
};

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ru">
      <body>
        <main>
          <h1>Не удалось загрузить приложение</h1>

          <p>Попробуйте повторить попытку или вернуться на главную.</p>

          <button type="button" onClick={() => retry()}>
            Попробовать снова
          </button>

          <p>
            {/* Полная загрузка страницы для восстановления после глобальной ошибки. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">На главную</a>
          </p>
        </main>
      </body>
    </html>
  );
}
