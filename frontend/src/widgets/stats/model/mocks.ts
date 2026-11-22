export type StatItem = {
  id: string;
  label: string;
  value: number;
  total?: number;
  hint: string;
  hintTone?: "positive" | "muted";
};

// TODO: заменить на агрегаты с бэкенда.
export const mockStats: StatItem[] = [
  {
    id: "active-warehouses",
    label: "Активные склады",
    value: 2,
    total: 3,
    hint: "1 на паузе",
  },
  {
    id: "busy-robots",
    label: "Роботов занято",
    value: 7,
    total: 11,
    hint: "64% загрузки",
  },
  {
    id: "queued-tasks",
    label: "В очереди",
    value: 14,
    hint: "≈ 6 мин до разбора",
    hintTone: "muted",
  },
  {
    id: "done-today",
    label: "Выполнено сегодня",
    value: 128,
    hint: "+18% к вчера",
  },
];
