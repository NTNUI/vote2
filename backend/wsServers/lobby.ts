import { WebSocketServer } from "ws";
import { storeLobbyConnectionByCookie } from "../utils/socketNotifier";

export const lobbyWss = new WebSocketServer({ noServer: true });

lobbyWss.on("connection", function connection(ws, req) {
  // Store connections to be able to send messages to specific users when needed.
  storeLobbyConnectionByCookie(ws, req);
});
