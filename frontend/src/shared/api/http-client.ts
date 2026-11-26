/**
 * Кастомный fetch для сгенерированного Orval-клиента.
 *
 * - подставляет базовый URL (NEXT_PUBLIC_API_URL)
 * - всегда шлёт куки (credentials: "include")
 * - при 401 пробует обновить токены через /auth/refresh и повторяет запрос
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof (body as { message?: unknown }).message === "string"
        ? ((body as { message: string }).message as string)
        : `Ошибка запроса (${status})`;
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

let refreshPromise: Promise<boolean> | null = null;

/** Обновляет пару токенов по refresh-куке. Один параллельный запрос на всех. */
function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function isAuthEndpoint(url: string): boolean {
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh")
  );
}

export async function httpClient(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const url =
    typeof input === "string" ? `${API_BASE_URL}${input}` : input.toString();

  const doFetch = () =>
    fetch(url, {
      ...init,
      credentials: "include",
    });

  let res = await doFetch();

  // Access-токен истёк — пробуем обновить и повторить исходный запрос.
  if (res.status === 401 && !isAuthEndpoint(url)) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await doFetch();
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let body: unknown = text;
    try {
      body = text ? JSON.parse(text) : undefined;
    } catch {
      // не JSON — оставляем текст
    }
    throw new ApiError(res.status, body);
  }

  return res;
}
