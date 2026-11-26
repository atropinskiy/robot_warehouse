import { ApiError } from "./api-error";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
};

type NoContentRequestOptions = RequestOptions & {
  expectNoContent: true;
};

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * Запрос без тела в ответе (например, DELETE → 204): укажите expectNoContent.
 */
export function request(
  path: string,
  options: NoContentRequestOptions,
): Promise<void>;
/**
 * Запрос с JSON в ответе. Для статуса 204 вернётся undefined,
 * поэтому для таких ответов используйте перегрузку с expectNoContent.
 */
export function request<T>(path: string, options?: RequestOptions): Promise<T>;

export async function request(
  path: string,
  options?: RequestOptions & { expectNoContent?: boolean },
): Promise<unknown> {
  const hasBody = options?.body !== undefined;

  const response = await fetch(baseURL + path, {
    method: options?.method ?? "GET",
    headers: hasBody ? { "Content-Type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(options.body) : undefined,
    signal: options?.signal,
  });

  if (!response.ok) {
    const text = await response.text();
    let body: unknown = text;

    try {
      body = JSON.parse(text);
    } catch {
      // Ответ не JSON (например, HTML): оставляем исходный текст
    }

    throw new ApiError(response.status, body);
  }

  if (response.status === 204 || options?.expectNoContent) {
    return undefined;
  }

  return response.json();
}
