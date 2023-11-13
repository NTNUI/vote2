import { IncomingMessage } from "http";
import { WebSocket } from "ws";
import { NTNUINoFromRequest } from "./wsCookieRetriever";

/*
 * This file contains functions for storing connections and notifying users connected to the WebSocket servers.
 * Because the connections are stored in arrays/local data structures, the service has to run on a single instance, as the connections cannot be shared between instances.
 * For making it possible to run multiple instances, this part can be rewritten using for example a Redis or the MongoDB database.
 * However, this is not necessary for the current use case, as the one instance should be able to handle 350 concurrent connections on Azure basic plan. And thousands on the standard plan.
 * https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits
 */

// Store all active organizer connections, the connections are stored by their respective groupSlug.
// This makes it possible to send messages to all logged in organizers of a group.
// An organizer can be logged in on multiple devices, and multiple organizers can receive events from the same group.
export const organizerConnections = new Map<string, WebSocket[]>();
// Store all active lobby connections, for access when sending messages to assembly participants.
// Maximum one lobby connection per user.
export const lobbyConnections = new Map<number, WebSocket>();

const sendPing = (ws: WebSocket) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.ping();
  }
};

// Send ping to all participants to check if they are still connected and prevent the connection from closing.
export const startHeartbeatInterval = () => {
  return setInterval(() => {
    lobbyConnections.forEach((ws: WebSocket, userID: number) => {
      // Remove connection if it is closed by the client.
      if (ws.readyState === WebSocket.CLOSED) {
        lobbyConnections.delete(userID);
        return;
      }
      sendPing(ws);
    });

    organizerConnections.forEach((socketList) => {
      socketList.forEach((ws: WebSocket) => {
        // Remove connection if it is closed by the client.
        if (ws.readyState === WebSocket.CLOSED) {
          socketList.splice(socketList.indexOf(ws), 1);
          return;
        }
        sendPing(ws);
      });
    });
  }, 30000); // 30 seconds
};

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
    console.log("User " + ntnuiNo + " connected to lobby");
  }
};

export const removeLobbyConnectionByCookie = (req: IncomingMessage) => {
  const ntnuiNo = NTNUINoFromRequest(req);
  if (ntnuiNo !== null) {
    lobbyConnections.delete(ntnuiNo);
  }
};

export const storeOrganizerConnection = (groupSlug: string, ws: WebSocket) => {
  if (!organizerConnections.get(groupSlug)) {
    organizerConnections.set(groupSlug, [ws]);
  }
  organizerConnections.get(groupSlug)?.push(ws);
};

export const notifyOneParticipant = (ntnui_no: number, message: string) => {
  const connection = lobbyConnections.get(ntnui_no);
  if (connection) connection.send(message);
  else {
    console.log(
      "Could not notify user " +
        ntnui_no +
        " (disconnected). Is there a problem with the socket URL? (Ignore if headless testing / dev has restarted and wiped the connections)"
    );
  }
};

export const notifyOrganizers = (groupSlug: string, message: string) => {
  const connections = organizerConnections.get(groupSlug);
  if (connections) {
    connections.forEach((connection) => {
      connection.send(message);
    });
  }
};
