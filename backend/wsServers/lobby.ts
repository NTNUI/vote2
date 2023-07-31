import { WebSocketServer } from "ws";
import { storeConnectionByCookie } from "../utils/wsCookieRetriever";

export const lobbyWss = new WebSocketServer({ noServer: true });

lobbyWss.on("connection", function connection(ws, req) {
  // Store connections to be able to send messages to specific users when needed.
  storeConnectionByCookie(ws, req);
});
