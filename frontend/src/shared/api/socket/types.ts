import type { Socket } from "socket.io-client";

/**
 * Полезная нагрузка события ping
 */
export interface PingPayload {
  timestamp: number;
  message?: string;
}

/**
 * Полезная нагрузка события pong
 */
export interface PongPayload {
  timestamp: number;
  message?: string;
}

/**
 * События от Сервера к Клиенту
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ServerToClientEvents {}

/**
 * События от Клиента к Серверу
 * Контракт health:ping — клиент отправляет PingPayload и ожидает PongPayload через Socket.IO acknowledgement.
 */
export interface ClientToServerEvents {
  "health:ping": (
    payload: PingPayload,
    callback: (response: PongPayload | string) => void,
  ) => void;
}

/**
 * Строго типизированный экземпляр Socket.IO клиента
 */
export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
