'use client';

import { useEffect } from 'react';

import {
  connectSocket,
  disconnectSocket,
  sendPing,
  socket,
  SOCKET_EVENTS,
} from '@/shared/api';

import { useConnectionStore } from './useConnectionStore';

export interface UseConnectionLifecycleOptions {
  autoConnect?: boolean;
}

let activeSubscribers = 0;
let detachListeners: (() => void) | null = null;

/**
 * Инициализирует глобальные слушатели Socket.IO и синхронизирует их со стором Zustand.
 * Безопасно для повторного вызова (идемпотентно).
 */
export function initSocketListeners(): void {
  if (detachListeners !== null) {
    return;
  }

  const { setStatus, setLastError } = useConnectionStore.getState();

  const handleConnect = () => {
    setStatus('connected');
    setLastError(null);
  };

  const handleDisconnect = (reason: string) => {
    if (reason === 'io client disconnect' || reason === 'io server disconnect') {
      setStatus('disconnected');
    } else {
      setStatus('reconnecting');
    }
  };

  const handleConnectError = (error: Error) => {
    const message = error.message || 'Ошибка подключения к серверу WebSocket';
    setLastError(message);

    // Если менеджер Socket.IO продолжает попытки реконнекта, не мигаем красным 'error'
    if (socket.active) {
      setStatus('reconnecting');
    } else {
      setStatus('error');
    }
  };

  const handleReconnectAttempt = () => {
    setStatus('reconnecting');
  };

  const handleReconnect = () => {
    setStatus('connected');
    setLastError(null);
  };

  const handleReconnectFailed = () => {
    setStatus('error');
    setLastError('Не удалось подключиться к серверу после нескольких попыток');
  };

  socket.on(SOCKET_EVENTS.CONNECT, handleConnect);
  socket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
  socket.on(SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);

  socket.io.on(SOCKET_EVENTS.RECONNECT_ATTEMPT, handleReconnectAttempt);
  socket.io.on(SOCKET_EVENTS.RECONNECT, handleReconnect);
  socket.io.on(SOCKET_EVENTS.RECONNECT_FAILED, handleReconnectFailed);

  if (socket.connected) {
    setStatus('connected');
  }

  detachListeners = () => {
    socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
    socket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    socket.off(SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);

    socket.io.off(SOCKET_EVENTS.RECONNECT_ATTEMPT, handleReconnectAttempt);
    socket.io.off(SOCKET_EVENTS.RECONNECT, handleReconnect);
    socket.io.off(SOCKET_EVENTS.RECONNECT_FAILED, handleReconnectFailed);
  };
}

/**
 * Снимает глобальные слушатели Socket.IO.
 */
export function cleanupSocketListeners(): void {
  detachListeners?.();
  detachListeners = null;
}

const connectionActions = {
  connect(): void {
    const { setStatus, setLastError } = useConnectionStore.getState();
    setStatus('connecting');
    setLastError(null);
    connectSocket();
  },

  disconnect(): void {
    disconnectSocket();
    useConnectionStore.getState().setStatus('disconnected');
  },

  triggerPing(message = 'ping'): void {
    const { isPinging, setIsPinging, setPingLatency, setPingError } =
      useConnectionStore.getState();
    if (isPinging) {
      return;
    }

    setIsPinging(true);
    setPingError(null);

    const sent = sendPing(
      message,
      (_response, roundTripMs) => {
        setPingLatency(roundTripMs);
        setIsPinging(false);
      },
      (error) => {
        setPingError(error.message || 'Таймаут ответа ping');
        setIsPinging(false);
      },
    );

    if (!sent) {
      setPingError('Сокет не подключён');
      setIsPinging(false);
    }
  },
};

/**
 * Публичный хук действий (connect, disconnect, triggerPing) со стабильной ссылкой без накладных расходов.
 */
export function useConnectionActions() {
  return connectionActions;
}

/**
 * Инициализирует слушатели сокета при монтировании и корректно отписывается при размонтировании последнего подписчика.
 */
export function useConnectionLifecycle({
  autoConnect = true,
}: UseConnectionLifecycleOptions = {}) {
  useEffect(() => {
    activeSubscribers += 1;
    initSocketListeners();

    if (autoConnect && !socket.connected) {
      connectionActions.connect();
    }

    return () => {
      activeSubscribers = Math.max(0, activeSubscribers - 1);
      if (activeSubscribers === 0) {
        cleanupSocketListeners();
      }
    };
  }, [autoConnect]);

  return connectionActions;
}
