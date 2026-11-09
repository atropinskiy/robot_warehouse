# Robot Warehouse — архитектура и стек

## Контекст
Репозиторий пока пустой (CONTEXT.md с ТЗ, README с ролями, пустые `frontend/`, `backend/`).
Базовый стек задан ТЗ (Next.js + NestJS + Postgres + Redis + Socket.IO + BullMQ). Открытые вопросы:
чем рисовать карту, как хранить геометрию склада, как устроить движок симуляции и как он
работает при нескольких инстансах бэкенда. Ниже — принятые решения.

## 1. Что доопределяем в стеке
| Вопрос | Решение | Почему |
|---|---|---|
| Структура репо | **pnpm workspace (монорепо)**: `frontend/`, `backend/`, `packages/shared`, `packages/sim-engine` | Общие типы/zod-схемы и валидация карты на фронте и бэке; движок тестируется отдельно (требование ТЗ) |
| ORM | **Prisma** | Типы из схемы, простые миграции, хорошо дружит с NestJS |
| Карта | **react-konva (Konva)** | Canvas, слои, drag&drop, zoom/pan из коробки; точечная перерисовка нод. Pixi избыточен, SVG хуже для частых апдейтов |
| 3D (звёздочка) | позже `@react-three/fiber` поверх той же модели | Модель карты не зависит от рендера |
| Realtime между инстансами | `@socket.io/redis-adapter` + Redis pub/sub | Broadcast в комнату склада с любого инстанса |
| Владение складом | Redis lease-lock (`SET NX PX` + продление) | «Один склад — один инстанс» |
| Валидация | zod-схемы в `packages/shared` | Одна правда для формы редактора, DTO и движка |
| Балансер | nginx, Socket.IO с `transports: ['websocket']` (или sticky) | Без sticky polling ломается |

## 2. Геометрия склада (модель)
Сетка `width × height` (v1: 20×20), координаты `{x, y}`, 4-связность.

```
Layout {
  version: number            // оптимистичная блокировка при сохранении
  width, height
  obstacles: {x,y}[]         // непроходимые клетки
  stations:  {id, name, x, y, kind?}[]   // проходимая клетка, робот встаёт на неё
  robots:    {id, name, x, y}[]          // стартовые позиции (spawn)
}
```
- Хранение: `Warehouse.layout` — **JSONB** + `layoutVersion` в Postgres. Сохраняется целиком
  одним PUT (атомарно, просто для редактора). Station/robot id — uuid, генерятся на клиенте,
  стабильны между сохранениями; задания ссылаются на `stationId` (+ снапшот имени для истории).
- Валидация (`packages/shared/layout/validate.ts`, чистые функции, тесты):
  в пределах сетки; ≤1 объекта на клетку; робот/станция не в препятствии; уникальные имена станций;
  (warning) станция недостижима из-за стен — BFS.
- Запуск симуляции фиксирует `layoutVersion` в записи `SimulationRun`; пока run `RUNNING|PAUSED`,
  PUT layout → 409. Редактировать можно только после reset/stop.
- Фронт-редактор: черновик в zustand (`features/map-editor`), инструменты «препятствие / станция /
  робот / ластик», та же zod-валидация до отправки; сервер повторно валидирует.
- Рендер (Konva): слой 1 — сетка+препятствия+станции (статичный, `cache()`), слой 2 — роботы и
  маршрут выбранного робота. Каждый `<RobotNode id>` подписан на `useSimStore(s => s.robots[id])`,
  движение — tween между клетками → апдейт позиции не перерисовывает приложение.

## 3. Движок симуляции (`packages/sim-engine`, чистый TS, без Nest/БД/сокетов)
`step(state, commands[]) → { state, events[] }` — детерминированный тик (например 500 мс).

- **Состояния**: Robot `IDLE | BUSY(toPickup|toDropoff) | WAITING(reason) | BROKEN`;
  Task `QUEUED | IN_PROGRESS | DONE | FAILED(reason)`.
- **Назначение**: FIFO-очередь; первое задание → ближайший свободный робот (длина пути BFS).
- **Маршрут**: A* (Манхэттен) по статичной сетке; сломанные роботы = препятствия.
  Нет пути даже без учёта роботов → задание `FAILED: NO_PATH (станция X недостижима)`.
- **Коллизии за тик**: собрать намерения «следующая клетка», разрешить по приоритету (id/возраст задания):
  клетка занята или уже зарезервирована → ждать; встречный обмен A↔B запрещён.
  Ждёт > N тиков → перестроить путь, считая соседних роботов временными препятствиями.
- **Дедлок**: граф ожиданий «робот → робот, который мешает»; цикл → событие `DEADLOCK` владельцу
  (авторазрешение — звёздочка).
- **События**: TASK_CREATED, ROBOT_ASSIGNED, CARGO_PICKED, DELIVERED, TASK_FAILED, ROBOT_BROKEN/REPAIRED,
  DEADLOCK — используются для журнала, статистики, Telegram и сводки ИИ.
- Тесты (vitest): один робот/одно задание; объезд стены; два робота навстречу в коридоре;
  поломка робота на пути; недостижимая станция; дедлок.

## 4. Как склады «работают» на бэкенде (несколько инстансов)
```
client ─WS/HTTP─> любой инстанс ── проверка прав (owner/observer)
                      │ команда → Redis channel  wh:{id}:cmd
                      ▼
          инстанс-владелец (держит lease  wh:{id}:lock)
             SimulationRunner: setInterval(tick) → engine.step()
                      ├─ diff {seq, robots, tasks, events} → socket.io room wh:{id} (redis adapter → все инстансы)
                      ├─ снапшот → Redis  wh:{id}:snapshot (каждый тик)
                      ├─ задания/события → Postgres (батчами, не каждое движение)
                      └─ проблемы → BullMQ (telegram, дедуп по jobId)
```
- **Start**: инстанс, получивший команду, берёт lease (`SET NX PX 5000`), продлевает каждый тик.
  Lease не взят → команда пересылается владельцу через pub/sub.
- **Падение инстанса**: lease истекает; watchdog при старте/по крону помечает `RUNNING` без lease
  как `INTERRUPTED` (карта и история в БД остаются) — соответствует ТЗ.
- **Переподключение**: join комнаты → сервер шлёт снапшот из Redis с `seq`, клиент отбрасывает diff с `seq ≤ snapshot.seq`.
- **Идемпотентность**: `clientRequestId` в создании задания + unique-индекс.
- **BullMQ** только для ИИ и уведомлений; Telegram-дедуп: `jobId = wh:problem:entity` + TTL-ключ.
- Модули Nest: `auth`, `users`, `warehouses` (CRUD, members, layout), `simulation` (runner, gateway,
  lock — адаптер над `sim-engine`), `tasks`, `ai`, `notifications/telegram`.

## 5. Фронтенд (FSD)
- `entities/{warehouse,robot,station,task}` — типы из shared, UI-карточки.
- `features/{map-editor, create-task, ai-task-draft, sim-controls, robot-break}`.
- `widgets/{warehouse-map, dispatch-panel, event-log, stats}`; `pages/{landing, dashboard, warehouse/editor, warehouse/dispatch}`.
- `shared/api/socket` — один socket-клиент, статус соединения в UI; REST — TanStack Query; live-состояние — zustand.
- Линтер FSD: `@feature-sliced/steiger`.

## 6. Порядок (по ТЗ — сначала прототип)
1. Монорепо + `packages/shared` (модель карты, zod, validate) + `sim-engine` с A* и тестами 1 робот/1 задание.
2. Прототип: Nest runner + Socket.IO, Next-страница с Konva, два браузера видят движение.
3. Redis adapter + lease → проверка на двух инстансах в docker-compose.
4. Редактор карты, auth/роли, задания/очередь, диспетчерская.
5. ИИ, Telegram, мониторинг, звёздочки.

## Verification
- `pnpm -r test`: юнит-тесты validate + engine (сценарии из §3).
- docker-compose с 2 инстансами backend + nginx: два клиента на разных инстансах видят одинаковые позиции;
  kill инстанса-владельца → run становится `INTERRUPTED`; переподключение получает снапшот.
- Демо-сценарии из ТЗ (успешная доставка, очередь, препятствие, поломка, второй пользователь, ИИ).
