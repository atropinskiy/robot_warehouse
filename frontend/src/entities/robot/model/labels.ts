import type { RobotStatus } from "./types";

export const robotStatusLabel: Record<RobotStatus, string> = {
  free: "Свободен",
  busy: "В задании",
  waiting: "Ожидает",
  broken: "Неисправен",
};
