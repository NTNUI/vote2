import { WebSocketServer } from "ws";
import { storeLobbyConnectionByCookie } from "../utils/socketNotifier";
import { NTNUINoFromRequest } from "../utils/wsCookieRetriever";

export const lobbyWss = new WebSocketServer({ noServer: true });

lobbyWss.on("connection", function connection(ws, req) {
  // Store connections to be able to send messages to specific users when needed.
  storeLobbyConnectionByCookie(ws, req);

  ws.on("pong", () => {
    // The client responded to the ping, so the connection is still active.
    // Connections are deleted when the user logs out or closes the connection/tab.
  });
});
