# shared/api

HTTP-клиент для запросов к backend и класс ошибки `ApiError`. Импортируйте из `@/shared/api`.

## Адрес API

Базовый адрес берётся из `NEXT_PUBLIC_API_URL`. В Docker это `/api`: nginx убирает префикс и проксирует запрос на backend.

## `request`

```ts
import { request } from "@/shared/api";

type Robot = { name: string; role: "lifter" | "runner" };

// GET с JSON в ответе
const robots = await request<Robot[]>("/robots");

// POST с телом
const created = await request<Robot>("/robots", {
  method: "POST",
  body: { name: "Mule", role: "lifter" },
});

// Ответ без тела (например, 204)
await request("/robots/1", { method: "DELETE", expectNoContent: true });
```

Тело отправляется как JSON, заголовок `Content-Type` ставится автоматически.

## Использование с TanStack Query

Передавайте `signal`, чтобы Query мог отменить запрос:

```ts
useQuery({
  queryKey: ["robots"],
  queryFn: ({ signal }) => request<Robot[]>("/robots", { signal }),
});
```

## Ошибки

- `ApiError` — сервер ответил неуспешным статусом. Поля: `status` и `body` (разобранный JSON или исходный текст, если ответ не JSON).
- Любая другая ошибка (например, `Failed to fetch`) — запрос не дошёл до сервера.

```ts
if (error instanceof ApiError && error.status === 404) {
  // ...
}
```

## Что здесь не реализовано

Авторизация и обновление токенов, предзагрузка данных на сервере (SSR) и генерация хуков из OpenAPI.

## QueryClientProvider

Провайдер лежит в `src/app/api/query-provider.tsx` и подключён в корневом `layout.tsx`. На сервере создаётся новый `QueryClient`, в браузере — один на вкладку. Стартовая настройка: `staleTime` 30 секунд.

## Тесты

```bash
pnpm test
```
