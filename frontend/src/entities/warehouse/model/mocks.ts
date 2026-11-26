import type { Warehouse } from "./types";

// TODO: заменить на данные из API складов (F5.5).
export const mockWarehouses: Warehouse[] = [
  {
    id: "central",
    name: "Центральный склад",
    status: "running",
    role: "owner",
    robotCount: 4,
    queueSize: 9,
    size: { width: 20, height: 20 },
    previewSeed: 3,
    previewRobots: [
      { model: "mule", direction: "right" },
      { model: "lifter", direction: "down" },
      { model: "picker", direction: "left" },
      { model: "mule", direction: "up" },
    ],
  },
  {
    id: "north",
    name: "Склад «Север»",
    status: "paused",
    role: "owner",
    robotCount: 3,
    queueSize: 5,
    size: { width: 20, height: 20 },
    previewSeed: 11,
    previewRobots: [
      { model: "picker", direction: "down" },
      { model: "mule", direction: "left" },
      { model: "lifter", direction: "up" },
    ],
  },
  {
    id: "sorting-hub",
    name: "Сортировочный хаб",
    status: "stopped",
    role: "observer",
    robotCount: 2,
    queueSize: 0,
    size: { width: 20, height: 20 },
    previewSeed: 27,
    previewRobots: [
      { model: "lifter", direction: "right" },
      { model: "mule", direction: "down" },
    ],
  },
];
