# Запуск в докере

Для одинаковой среды разработки на разных платформах установите Docker с поддержкой Docker Compose Watch:
https://docs.docker.com/get-started/get-docker/

## Используемые команды пакетов

В докерфайлах используются стандартные команды пакетов

**frontend**: `pnpm dev`

**backend**: `pnpm start:dev`

### Первый запуск в dev-режиме

```shell
docker compose -f docker-compose.dev.yml up --build --watch
```

### Повторные запуски

```shell
docker compose -f docker-compose.dev.yml up --watch
```

Если у пользователя нет доступа к Docker без `sudo`, используйте:

```shell
sudo docker compose -f docker-compose.dev.yml up --build --watch
```

Frontend доступен на `http://localhost` (порт 80). Nginx запускается после того, как frontend и backend проходят healthcheck.

## Переменные окружения

### **URL для серверных запросов (SSR) внутри Docker-сети:**

```shell
INTERNAL_API_URL=http://backend:3000
```

### **URL для клиентских запросов (браузер) — идёт через nginx:**

```shell
NEXT_PUBLIC_API_URL=/api
```

## Зависимости

Изменения `package.json` или `pnpm-lock.yaml` автоматически пересобирают соответствующий образ. Для изменения зависимостей отредактируйте манифесты в `frontend/` или `backend/` и дождитесь завершения пересборки в Compose Watch.
