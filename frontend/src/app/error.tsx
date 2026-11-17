"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: unknown;
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Не удалось отобразить страницу</h1>

      <p>Попробуйте повторить попытку или вернуться на главную.</p>

      <button
        type="button"
        onClick={() => retry()}
        className="rounded border px-4 py-2"
      >
        Попробовать снова
      </button>

      <Link href="/" className="underline">
        На главную
      </Link>
    </main>
  );
}
