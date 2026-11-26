import type { WarehouseRole, WarehouseStatus } from "./types";

export const warehouseStatusLabel: Record<WarehouseStatus, string> = {
  running: "Симуляция идёт",
  paused: "Пауза",
  stopped: "Остановлен",
};

export const warehouseRoleLabel: Record<WarehouseRole, string> = {
  owner: "Владелец",
  observer: "Наблюдатель",
};
