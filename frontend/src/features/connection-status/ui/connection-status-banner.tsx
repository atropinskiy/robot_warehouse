"use client";

import {
  Activity,
  AlertTriangle,
  Loader2,
  RefreshCw,
  WifiOff,
} from "lucide-react";

import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";

import { useConnectionLifecycle } from "../model/useConnectionLifecycle";
import {
  useConnectionError,
  useConnectionStatus,
  useIsPinging,
  usePingError,
  usePingLatency,
} from "../model/useConnectionStore";

export interface ConnectionStatusBannerProps {
  className?: string;
  autoConnect?: boolean;
  showPingControl?: boolean;
}

export function ConnectionStatusBanner({
  className,
  autoConnect = true,
  showPingControl = true,
}: ConnectionStatusBannerProps) {
  const { connect, triggerPing } = useConnectionLifecycle({ autoConnect });
  const status = useConnectionStatus();
  const lastError = useConnectionError();
  const pingLatency = usePingLatency();
  const pingError = usePingError();
  const isPinging = useIsPinging();

  if (status === "connected") {
    if (!showPingControl) {
      return null;
    }

    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Статус WebSocket соединения"
        className={cn(
          "flex items-center justify-between border-b border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="font-mono text-[11px] text-foreground">
            WebSocket: Онлайн
          </span>
          {pingLatency !== null && (
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
              {pingLatency} мс
            </span>
          )}
          {pingError !== null && (
            <span
              className="rounded bg-destructive/15 px-1.5 py-0.5 font-mono text-[11px] text-destructive"
              title={pingError}
            >
              Ping ошибка
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="xs"
          disabled={isPinging}
          onClick={() => triggerPing("manual-ping")}
          className="font-mono text-[11px]"
        >
          {isPinging ? (
            <Loader2
              className="size-3 animate-spin text-primary"
              aria-hidden="true"
            />
          ) : (
            <Activity className="size-3 text-primary" aria-hidden="true" />
          )}
          <span>{isPinging ? "Ping..." : "Тест Ping"}</span>
        </Button>
      </div>
    );
  }

  if (status === "connecting") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-center justify-center gap-2 border-b border-border bg-card/90 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm",
          className,
        )}
      >
        <Loader2
          className="size-3.5 animate-spin text-primary"
          aria-hidden="true"
        />
        <span>Подключение к серверу симуляции...</span>
      </div>
    );
  }

  if (status === "reconnecting") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-center justify-center gap-2 border-b border-warning/30 bg-warning/10 px-4 py-1.5 text-xs font-medium text-warning backdrop-blur-sm",
          className,
        )}
      >
        <RefreshCw className="size-3.5 animate-spin" aria-hidden="true" />
        <span>Связь со складом потеряна. Восстановление соединения...</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className={cn(
          "flex items-center justify-between gap-3 border-b border-destructive/40 bg-destructive/15 px-4 py-1.5 text-xs font-medium text-destructive backdrop-blur-sm",
          className,
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate" title={lastError ?? undefined}>
            {lastError || "Ошибка соединения с сервером."}
          </span>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="xs"
          onClick={connect}
          className="shrink-0 font-semibold"
        >
          <RefreshCw className="size-3" aria-hidden="true" />
          <span>Повторить</span>
        </Button>
      </div>
    );
  }

  // status === 'disconnected'
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-between gap-3 border-b border-border bg-muted/80 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <WifiOff className="size-3.5 shrink-0" aria-hidden="true" />
        <span>WebSocket отключен</span>
      </div>
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={connect}
        className="shrink-0"
      >
        <span>Подключить</span>
      </Button>
    </div>
  );
}
