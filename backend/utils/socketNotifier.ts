import { IncomingMessage } from "http";
import { WebSocket } from "ws";
import { NTNUINoFromRequest } from "./wsCookieRetriever";

/*
 * This file contains functions for storing connections and notifying users connected to the WebSocket servers.
 * Because the connections are stored in arrays/local data structures, the service has to run on a single instance, as the connections cannot be shared between instances.
 * For making it possible to run multiple instances, this part can be rewritten using for example a redis or mongoDB database.
 * However, this is not necessary for the current use case, as the one instance should be able to handle 350 concurrent connections on Azure basic plan. And thousands on the standard plan.
 * https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits
 */

// Store all active organizer connections, the connections are stored by their respective groupSlug.
// This makes it possible to send messages to all logged in organizers of a group.
export const organizerConnections = new Map<string, Map<number, WebSocket>>();
// Store all active participant connections, for access when sending messages about assembly.
export const lobbyConnections = new Map<number, WebSocket>();

const sendPing = (ws: WebSocket) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.ping();
  }
};

// Send ping to all participants to check if they are still connected and prevent the connection from closing.
export const startHeartbeatInterval = setInterval(() => {
  lobbyConnections.forEach((ws: WebSocket) => {
    sendPing(ws);
  });

  organizerConnections.forEach((socketList) => {
    socketList.forEach((ws: WebSocket) => {
      sendPing(ws);
    });
  });
}, 30000); // 30 seconds

export const storeLobbyConnectionByCookie = (
  ws: WebSocket,
  req: IncomingMessage
) => {
  const ntnuiNo = NTNUINoFromRequest(req);
  if (ntnuiNo !== null) {
    // Notify about kicking out old connection if user already is connected.
    if (lobbyConnections.has(ntnuiNo)) {
      notifyOneParticipant(ntnuiNo, JSON.stringify({ status: "removed" }));
      lobbyConnections.get(ntnuiNo)?.close();
    }
    // Store socket connection on NTNUI ID.
    lobbyConnections.set(ntnuiNo, ws);
  }
};

export const removeLobbyConnectionByCookie = (req: IncomingMessage) => {
  const ntnuiNo = NTNUINoFromRequest(req);
  if (ntnuiNo !== null) {
    lobbyConnections.delete(ntnuiNo);
  }
};

export const removeOrganizerConnectionByCookie = (req: IncomingMessage) => {
  const ntnuiNo = NTNUINoFromRequest(req);
  if (ntnuiNo !== null) {
    for (const groupSlug of organizerConnections.keys()) {
      for (const ntnui_no of organizerConnections.get(groupSlug)?.keys() ||
        []) {
        if (ntnui_no === ntnuiNo) {
          try {
            organizerConnections.get(groupSlug)?.delete(ntnui_no);
          } catch (e) {
            console.error(
              "Tried to delete connection that did not exist. " + e
            );
          }
          console.log(
            "Organizer " + ntnui_no + " unsubscribed from group " + groupSlug
          );
          return;
        }
      }
    }
  }
};

export const storeOrganizerConnectionByNTNUINo = (
  ntnui_no: number,
  groupSlug: string,
  ws: WebSocket
) => {
  if (!organizerConnections.get(groupSlug)) {
    organizerConnections.set(groupSlug, new Map<number, WebSocket>());
  }
  organizerConnections.get(groupSlug)?.set(ntnui_no, ws);
};

export const notifyOneParticipant = (ntnui_no: number, message: string) => {
  const connection = lobbyConnections.get(ntnui_no);
  if (connection) connection.send(message);
  else {
    console.log(
      "Could not notify user " +
        ntnui_no +
        " (disconnected). Is there a problem with the socket URL? (Ignore if testing / dev has restarted)"
    );
  }
};

export const notifyOrganizers = (groupSlug: string, message: string) => {
  for (const ntnui_no of organizerConnections.get(groupSlug)?.keys() || []) {
    console.log("Sending message to organizer " + ntnui_no);
    const socket = organizerConnections.get(groupSlug)?.get(ntnui_no);
    if (socket) {
      try {
        socket.send(message);
      } catch (e) {
        console.error(
          "Error when sending message to organizer " + ntnui_no + ": " + e
        );
      }
    }
  }
};
