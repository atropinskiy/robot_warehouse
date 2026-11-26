export type EventTone = "default" | "success" | "error";

/** Часть сообщения: обычный текст или выделенное имя (робот, задание). */
export type EventMessagePart = string | { strong: string };

export type SimulationEvent = {
  id: string;
  time: string;
  tone: EventTone;
  message: EventMessagePart[];
};

// TODO: заменить на события симуляции из WebSocket.
export const mockEvents: SimulationEvent[] = [
  {
    id: "e5",
    time: "14:02:41",
    tone: "success",
    message: ["Доставка завершена · ", { strong: "#T-318" }],
  },
  {
    id: "e4",
    time: "14:02:37",
    tone: "default",
    message: [{ strong: "Мул-01" }, " получил груз на «Приёмка-1»"],
  },
  {
    id: "e3",
    time: "14:02:20",
    tone: "default",
    message: [{ strong: "Штабелёр-02" }, " назначен на ", { strong: "#T-319" }],
  },
  {
    id: "e2",
    time: "14:01:58",
    tone: "error",
    message: ["Маршрут не найден: «Упаковка-2» окружена препятствиями"],
  },
  {
    id: "e1",
    time: "14:01:12",
    tone: "default",
    message: ["Создано задание ", { strong: "#T-320" }, " (AI)"],
  },
];
