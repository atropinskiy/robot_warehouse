import type { Robot } from "./types";

// TODO: заменить на live-состояние симуляции (sim-store, F3.3).
export const mockRobots: Robot[] = [
  {
    id: "mule-01",
    name: "Мул-01",
    model: "mule",
    direction: "right",
    position: { x: 4, y: 7 },
    status: "busy",
    note: "Приёмка → Упаковка",
  },
  {
    id: "lifter-02",
    name: "Штабелёр-02",
    model: "lifter",
    direction: "down",
    position: { x: 12, y: 3 },
    status: "waiting",
    note: "Путь занят, ждёт",
  },
  {
    id: "picker-03",
    name: "Сборщик-03",
    model: "picker",
    direction: "left",
    position: { x: 9, y: 15 },
    status: "free",
    note: "Без задания",
  },
  {
    id: "mule-04",
    name: "Мул-04",
    model: "mule",
    direction: "up",
    position: { x: 17, y: 11 },
    status: "broken",
    note: "Остановлен вручную",
  },
];
