import type { RobotDirection, RobotModel } from "@/shared/config";

export type WarehouseStatus = "running" | "paused" | "stopped";
export type WarehouseRole = "owner" | "observer";

export type WarehousePreviewRobot = {
  model: RobotModel;
  direction: RobotDirection;
};

export type Warehouse = {
  id: string;
  name: string;
  status: WarehouseStatus;
  role: WarehouseRole;
  robotCount: number;
  queueSize: number;
  size: { width: number; height: number };
  /** Зерно для генерации мини-карты, пока нет настоящего layout с бэкенда. */
  previewSeed: number;
  previewRobots: WarehousePreviewRobot[];
};
