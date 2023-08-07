import jsonwebtoken from "jsonwebtoken";
import { notifyOne } from "../utils/socketNotifier";
import { IncomingMessage } from "http";
import { WebSocket } from "ws";

// Store all active connections, for access when sending messages.
export const connections: WebSocket[] = [];

export function storeConnectionByCookie(ws: WebSocket, req: IncomingMessage) {
  // WS do not support direct access to cookies, so we have to parse them manually into a map for easy access.
  const cookies = req.headers.cookie ? req.headers.cookie.split("; ") : [];

  const cookieMap: CookieMap = {};
  cookies.forEach((cookie) => {
    const [name, value] = cookie.split("=");
    cookieMap[name] = value;
  });

  if (cookieMap["accessToken"] !== undefined) {
    const decoded = jsonwebtoken.decode(cookieMap["accessToken"]);
    if (decoded && typeof decoded !== "string") {
      // Notify about kicking out old connection if user already is connected.
      if (typeof connections[decoded.ntnui_no] !== "undefined") {
        notifyOne(decoded.ntnui_no, JSON.stringify({ status: "removed" }));
      }
      // Store socket connection on NTNUI ID.
      connections[decoded.ntnui_no] = ws;
    }
  }
}

interface CookieMap {
  [key: string]: string;
}
