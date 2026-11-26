import { io } from 'socket.io-client';
import { z } from 'zod';

import { SOCKET_EVENTS } from './events';
import type { PingPayload, PongPayload, TypedSocket } from './types';

const PING_TIMEOUT_MS = 5000;

/**
 * Получение базового URL для подключения WebSocket
 */
const getSocketUrl = (): string => {
  if (typeof window === 'undefined') {
    return 'http://localhost';
  }
  return (
    process.env.NEXT_PUBLIC_WS_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
    window.location.origin
  );
};

/**
 * Синглтон экземпляра Socket.IO клиента
 */
export const socket: TypedSocket = io(getSocketUrl(), {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ['websocket', 'polling'],
});

/**
 * Zod-схема для безопасной валидации объекта авторизации сокета
 */
const socketAuthSchema = z.object({
  token: z.string().optional(),
});

/**
 * Инициализация соединения с опциональной передачей или сбросом токена аутентификации
 */
export const connectSocket = (token?: string, forceReconnect = false): void => {
  const parsed = socketAuthSchema.safeParse(socket.auth);
  const currentToken = parsed.success ? parsed.data.token : undefined;
  const isTokenChanged = token !== undefined && token !== currentToken;

  if (token !== undefined) {
    socket.auth = token ? { token } : {};
  }

  if (!socket.connected) {
    socket.connect();
  } else if (forceReconnect || isTokenChanged) {
    socket.disconnect().connect();
  }
};

/**
 * Безопасное отключение сокета
 */
export const disconnectSocket = (): void => {
  if (socket.connected || socket.active) {
    socket.disconnect();
  }
};

/**
 * Отправка диагностического ping с таймаутом и замером round-trip времени
 * Возвращает false, если сокет не подключён
 */
export const sendPing = (
  message = 'ping',
  onSuccess?: (response: PongPayload | string | undefined, roundTripMs: number) => void,
  onError?: (error: Error) => void,
): boolean => {
  if (!socket.connected) {
    return false;
  }

  const payload: PingPayload = {
    timestamp: Date.now(),
    message,
  };

  const start = Date.now();
  socket
    .timeout(PING_TIMEOUT_MS)
    .emit(SOCKET_EVENTS.HEALTH_PING, payload, (err, response) => {
      if (err) {
        onError?.(err);
        return;
      }
      const roundTripMs = Date.now() - start;
      onSuccess?.(response, roundTripMs);
    });

  return true;
};
