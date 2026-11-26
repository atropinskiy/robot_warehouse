export { ConnectionStatusBanner } from "./ui/connection-status-banner";
export type { ConnectionStatusBannerProps } from "./ui/connection-status-banner";

export { useConnectionActions } from "./model/useConnectionLifecycle";

export {
  useConnectionError,
  useConnectionStatus,
  useIsConnected,
  useIsPinging,
  usePingError,
  usePingLatency,
} from "./model/useConnectionStore";
export type { ConnectionStatus } from "./model/useConnectionStore";
