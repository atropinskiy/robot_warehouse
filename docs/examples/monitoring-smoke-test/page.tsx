"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function MonitoringSmokeTestPage() {
  const [shouldCrash, setShouldCrash] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);

  if (shouldCrash) {
    throw new Error("Monitoring smoke test: render error");
  }

  function sendHandledError() {
    const id = Sentry.captureException(
      new Error("Monitoring smoke test: handled error"),
      {
        tags: {
          source: "monitoring-smoke-test",
          operation: "manual-capture",
        },
      },
    );

    setEventId(id);
  }

  function throwUnhandledError() {
    throw new Error("Monitoring smoke test: unhandled click error");
  }

  return (
    <main className="flex min-h-screen flex-col items-start gap-4 p-6">
      <h1 className="text-2xl font-semibold">Проверка мониторинга</h1>

      <p>
        Только для локальной проверки. Каждая кнопка намеренно создаёт тестовую
        ошибку.
      </p>

      <button
        type="button"
        className="rounded border px-4 py-2"
        onClick={sendHandledError}
      >
        1. Отправить обработанную ошибку
      </button>

      <button
        type="button"
        className="rounded border px-4 py-2"
        onClick={throwUnhandledError}
      >
        2. Вызвать необработанную ошибку клика
      </button>

      <button
        type="button"
        className="rounded border px-4 py-2"
        onClick={() => setShouldCrash(true)}
      >
        3. Вызвать ошибку рендера
      </button>

      {eventId && (
        <p role="status">
          SDK вернул ID события: <code>{eventId}</code>. Получение события
          подтвердите в GlitchTip.
        </p>
      )}
    </main>
  );
}
