export {
  connectSocket,
  disconnectSocket,
  sendPing,
  socket,
} from "./socket-client";
export { SOCKET_EVENTS, type SocketEventName } from "./events";
export type {
  ClientToServerEvents,
  PingPayload,
  PongPayload,
  ServerToClientEvents,
  TypedSocket,
} from "./types";
