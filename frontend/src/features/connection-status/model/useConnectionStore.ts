import { create } from "zustand";

export type ConnectionStatus =
  "disconnected" | "connecting" | "connected" | "reconnecting" | "error";

interface ConnectionState {
  status: ConnectionStatus;
  lastError: string | null;
  lastPingLatencyMs: number | null;
  pingError: string | null;
  isPinging: boolean;
}

interface ConnectionActions {
  setStatus: (status: ConnectionStatus) => void;
  setLastError: (error: string | null) => void;
  setPingLatency: (latencyMs: number | null) => void;
  setPingError: (error: string | null) => void;
  setIsPinging: (isPinging: boolean) => void;
  reset: () => void;
}

export type ConnectionStore = ConnectionState & ConnectionActions;

const initialState: ConnectionState = {
  status: "disconnected",
  lastError: null,
  lastPingLatencyMs: null,
  pingError: null,
  isPinging: false,
};

export const useConnectionStore = create<ConnectionStore>((set) => ({
  ...initialState,

  setStatus: (status) =>
    set((state) => (state.status === status ? state : { status })),

  setLastError: (lastError) => set({ lastError }),

  setPingLatency: (lastPingLatencyMs) =>
    set({ lastPingLatencyMs, pingError: null }),

  setPingError: (pingError) => set({ pingError, lastPingLatencyMs: null }),

  setIsPinging: (isPinging) =>
    set((state) => (state.isPinging === isPinging ? state : { isPinging })),

  reset: () => set(initialState),
}));

// Точечные селекторы (Strict Zustand Rule — предотвращение лишних ре-рендеров)
export const useConnectionStatus = (): ConnectionStatus =>
  useConnectionStore((state) => state.status);

export const useIsConnected = (): boolean =>
  useConnectionStore((state) => state.status === "connected");

export const useConnectionError = (): string | null =>
  useConnectionStore((state) => state.lastError);

export const usePingLatency = (): number | null =>
  useConnectionStore((state) => state.lastPingLatencyMs);

export const usePingError = (): string | null =>
  useConnectionStore((state) => state.pingError);

export const useIsPinging = (): boolean =>
  useConnectionStore((state) => state.isPinging);
