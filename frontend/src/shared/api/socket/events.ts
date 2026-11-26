/**
 * Реестр имён WebSocket-событий в проекте Robot Warehouse
 */
export const SOCKET_EVENTS = {
  // Системные события Socket.IO
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
  RECONNECT: "reconnect",
  RECONNECT_ATTEMPT: "reconnect_attempt",
  RECONNECT_FAILED: "reconnect_failed",

  // Проверка соединения (Ping-Pong через ack)
  HEALTH_PING: "health:ping",
} as const;

export type SocketEventName =
  (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
