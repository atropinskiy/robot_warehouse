# Бэклог Robot Warehouse

Архитектура и обоснование решений: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Формат: фича (`F<n>`) → подзадачи (`F<n>.<m>`). Роли: **LEAD, DEVOPS, BE, FE, ALL**.
У каждой фичи — зависимости и критерий готовности (DoD). Подзадача = один PR.

## F0. Монорепо и базовая конфигурация — DEVOPS/LEAD · зависит: —
DoD: `pnpm i && pnpm -r lint test build` проходит локально и в CI.
- [ ] F0.1 [LEAD] pnpm workspace: `frontend`, `backend`, `packages/shared`, `packages/sim-engine`
- [ ] F0.2 [LEAD] Общие tsconfig.base, ESLint, Prettier, Husky + lint-staged, commitlint
- [ ] F0.3 [FE] Инициализация Next.js + Tailwind + shadcn, Vitest+RTL, Storybook
- [ ] F0.4 [FE] FSD-структура + линтер steiger
- [ ] F0.5 [BE] Инициализация NestJS, Swagger, конфиг env с zod-валидацией
- [ ] F0.6 [BE] Prisma + первая миграция, сидер
- [ ] F0.7 [DEVOPS] docker-compose dev: postgres, redis, backend, frontend
- [ ] F0.8 [DEVOPS] GitHub Actions на PR: lint, typecheck, test, build; branch protection
- [ ] F0.9 [LEAD] README: запуск, переменные, правила веток/ревью

## F1. Доменная модель и валидация карты (`packages/shared`) — BE+FE · зависит: F0.1
DoD: типы и zod-схемы используются и фронтом, и бэком; validate покрыт тестами.
- [ ] F1.1 [BE] Типы и zod: Layout, Obstacle, Station, RobotSpawn, Task, RobotState, TaskState, SimEvent
- [ ] F1.2 [BE] validateLayout: границы, 1 объект на клетку, уникальные имена станций, коды ошибок
- [ ] F1.3 [BE] Warning «станция недостижима» (BFS)
- [ ] F1.4 [ALL] Контракт WS-событий: snapshot, diff{seq}, команды, коды ошибок

## F2. Движок симуляции (`packages/sim-engine`) — BE · зависит: F1
DoD: `step(state, commands) → {state, events}` чистый, сценарии ТЗ покрыты тестами.
- [ ] F2.1 A* по сетке (4-связность), тесты на объезд и отсутствие пути
- [ ] F2.2 Модель состояния и step(): один робот pickup → dropoff
- [ ] F2.3 Очередь FIFO + назначение ближайшему свободному роботу
- [ ] F2.4 Разрешение коллизий за тик (резервации, запрет встречного обмена)
- [ ] F2.5 Ожидание и перестроение маршрута после N тиков
- [ ] F2.6 Поломка/починка робота (сломанный = препятствие)
- [ ] F2.7 Детектор дедлока (цикл в графе ожиданий) → событие DEADLOCK
- [ ] F2.8 Понятные причины WAITING/FAILED (NO_PATH, BLOCKED_BY_ROBOT, ...)

## F3. Прототип realtime (без auth) — BE+FE · зависит: F2.2
DoD: два браузера видят одного робота, едущего между двумя станциями.
- [ ] F3.1 [BE] SimulationRunner (setInterval → engine.step) + Socket.IO gateway, комнаты wh:{id}
- [ ] F3.2 [FE] Konva-карта: статичный слой + слой роботов, плавное движение
- [ ] F3.3 [FE] Zustand sim-store, подписка робота на свой слайс
- [ ] F3.4 [FE] Индикатор состояния соединения

## F4. Аутентификация и пользователи — BE+FE · зависит: F0
DoD: регистрация/вход/выход, защищённые роуты и WS-handshake.
- [ ] F4.1 [BE] User, регистрация/логин, хэш паролей, JWT access+refresh (httpOnly cookie)
- [ ] F4.2 [BE] Guard для HTTP и WS-handshake
- [ ] F4.3 [FE] Страницы входа/регистрации (RHF+zod), обработка 401/refresh
- [ ] F4.4 [FE] Личный кабинет и настройки

## F5. Склады и участники — BE+FE · зависит: F4
DoD: CRUD складов, приглашения, роли owner/observer проверяются на HTTP и WS.
- [ ] F5.1 [BE] Модели Warehouse (layout JSONB, layoutVersion), Membership(role)
- [ ] F5.2 [BE] CRUD: создание, переименование, удаление
- [ ] F5.3 [BE] Приглашения, принятие, удаление участника
- [ ] F5.4 [BE] RoleGuard для HTTP и WS-событий + тесты
- [ ] F5.5 [FE] Список складов, создание/переименование/удаление
- [ ] F5.6 [FE] Управление участниками

## F6. Редактор карты — FE+BE · зависит: F1, F3.2, F5
DoD: собрать карту 20×20, сохранить, увидеть ошибки; при активном запуске редактирование закрыто.
- [ ] F6.1 [BE] GET/PUT layout с проверкой версии (409) и validateLayout
- [ ] F6.2 [BE] Запрет изменения layout при RUNNING/PAUSED
- [ ] F6.3 [FE] Zustand-черновик карты
- [ ] F6.4 [FE] Инструменты: препятствие, станция, робот, ластик
- [ ] F6.5 [FE] Перемещение drag&drop, удаление
- [ ] F6.6 [FE] Zoom/pan
- [ ] F6.7 [FE] Подсветка ошибок, сохранение, обработка конфликта версии
- [ ] F6.8 [FE] Storybook-истории компонентов редактора

## F7. Симуляция на бэкенде (multi-instance) — BE+DEVOPS · зависит: F2, F3, F5
DoD: start/pause/resume/reset; клиенты на разных инстансах видят одно состояние; падение инстанса → INTERRUPTED.
- [ ] F7.1 [BE] Модель SimulationRun
- [ ] F7.2 [BE] Redis lease-lock на склад
- [ ] F7.3 [BE] Команды через Redis pub/sub к инстансу-владельцу
- [ ] F7.4 [BE] Socket.IO redis-adapter, рассылка diff с seq
- [ ] F7.5 [BE] Снапшот в Redis + выдача при join/reconnect
- [ ] F7.6 [BE] Start / pause / resume / reset
- [ ] F7.7 [BE] Батчевая запись событий и статусов в Postgres
- [ ] F7.8 [BE] Watchdog: RUNNING без lease → INTERRUPTED
- [ ] F7.9 [DEVOPS] compose с 2 инстансами backend + nginx (websocket)

## F8. Задания и очередь (API) — BE · зависит: F7
DoD: задание создаётся идемпотентно, проходит статусы, есть история.
- [ ] F8.1 [BE] Модель Task, POST /tasks с clientRequestId (unique)
- [ ] F8.2 [BE] Передача в движок, синхронизация статусов в БД
- [ ] F8.3 [BE] Список с фильтрами, пагинация, история
- [ ] F8.4 [BE] Сломать/починить робота (только owner)
- [ ] F8.5 [BE] Журнал событий: API + WS

## F9. Диспетчерская — FE · зависит: F7, F8
DoD: всё из раздела «Диспетчерская» ТЗ; observer только смотрит.
- [ ] F9.1 Live-карта
- [ ] F9.2 Список роботов с состояниями и причиной остановки
- [ ] F9.3 Выбор робота: задание и маршрут на карте
- [ ] F9.4 Форма создания задания
- [ ] F9.5 Очередь и история с фильтрами
- [ ] F9.6 Журнал событий
- [ ] F9.7 Статистика
- [ ] F9.8 Управление симуляцией (reset с подтверждением) + сломать/починить
- [ ] F9.9 Ограничения для observer, показ ошибок команд

## F10. ИИ-помощник — BE+FE · зависит: F8
DoD: черновик задания из текста с подтверждением/уточнением; сводка по складу.
- [ ] F10.1 [BE] BullMQ-очередь ai, клиент OpenAI
- [ ] F10.2 [BE] Текст → черновик задания (structured output или запрос уточнения)
- [ ] F10.3 [BE] Сводка по состоянию и последним событиям
- [ ] F10.4 [BE] Observer не может создавать задания через ИИ
- [ ] F10.5 [FE] Ввод текста, карточка подтверждения, уточнения
- [ ] F10.6 [FE] Кнопка «Сводка»

## F11. Telegram — BE+FE · зависит: F7
DoD: привязка, уведомления об ошибках без спама.
- [ ] F11.1 [BE] Бот, привязка через deep link с одноразовым кодом
- [ ] F11.2 [BE] BullMQ-очередь notifications, дедуп + TTL
- [ ] F11.3 [FE] Привязка/отвязка в настройках

## F12. Лендинг — FE · зависит: F0.3
- [ ] F12.1 Лендинг с CTA
- [ ] F12.2 Адаптивность, SEO-метаданные

## F13. Прод и наблюдаемость — DEVOPS · зависит: F0.7
DoD: релиз одной кнопкой, логи и метрики в Grafana, несколько инстансов.
- [ ] F13.1 Prod multi-stage Dockerfile, образы в GHCR
- [ ] F13.2 Сервер, nginx, TLS, prod compose
- [ ] F13.3 Release workflow (release-ветка + кнопка Release)
- [ ] F13.4 Loki + Promtail, структурированные логи (pino)
- [ ] F13.5 Prometheus + node_exporter + cAdvisor, /metrics backend
- [ ] F13.6 Grafana-дашборды и алерты
- [ ] F13.7 Sentry/GlitchTip для FE и BE
- [ ] F13.8 Секреты GitHub, документация переменных

## F14. Демо и e2e — ALL · зависит: F9, F10
- [ ] F14.1 Сиды под 6 демо-сценариев ТЗ
- [ ] F14.2 e2e smoke (Playwright)
- [ ] F14.3 Проверка двух пользователей на разных инстансах

## F15. Звёздочки
- [ ] F15.1 Аккумулятор и зарядные станции
- [ ] F15.2 Приоритеты заданий
- [ ] F15.3 Скорость симуляции
- [ ] F15.4 Авторазрешение дедлоков
- [ ] F15.5 Совместное редактирование карты
- [ ] F15.6 Восстановление запуска после рестарта
- [ ] F15.7 Генератор заданий
- [ ] F15.8 3D (react-three-fiber)
