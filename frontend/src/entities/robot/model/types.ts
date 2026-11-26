import type { RobotDirection, RobotModel } from "@/shared/config";

/** Состояния робота из ТЗ. */
export type RobotStatus = "free" | "busy" | "waiting" | "broken";

export type Robot = {
  id: string;
  name: string;
  model: RobotModel;
  direction: RobotDirection;
  position: { x: number; y: number };
  status: RobotStatus;
  /** Короткое пояснение: текущий маршрут или причина ожидания. */
  note: string;
};
