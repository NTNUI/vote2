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

type SocketList = { [key: number]: WebSocket };
type OrganizersByGroupSlug = { [key: string]: SocketList };

// Store all active organizer connections, the connections are stored by their respective groupSlug.
// This makes it possible to send messages to all logged in organizers of a group.
export const organizerConnections: OrganizersByGroupSlug = {};
// Store all active participant connections, for access when sending messages about assembly.
export const lobbyConnections: SocketList = [];

export function storeLobbyConnectionByCookie(
  ws: WebSocket,
  req: IncomingMessage
) {
  const ntnuiNo = NTNUINoFromRequest(req);
  if (ntnuiNo !== null) {
    // Notify about kicking out old connection if user already is connected.
    if (typeof lobbyConnections[ntnuiNo] !== null) {
      notifyOneParticipant(ntnuiNo, JSON.stringify({ status: "removed" }));
    }
    // Store socket connection on NTNUI ID.
    lobbyConnections[ntnuiNo] = ws;
  }
}

export function storeOrganizerConnectionByNTNUINo(
  ntnui_no: number,
  groupSlug: string,
  ws: WebSocket
) {
  if (!organizerConnections[groupSlug]) organizerConnections[groupSlug] = [];
  organizerConnections[groupSlug][ntnui_no] = ws;
}

export const notifyOneParticipant = (ntnui_no: number, message: string) => {
  try {
    lobbyConnections[ntnui_no].send(message);
  } catch (error) {
    console.log(
      "Could not notify user " +
        ntnui_no +
        ". Is there a problem with the socket URL? (Ignore if testing)"
    );
  }
};

export const notifyOrganizers = (groupSlug: string, message: string) => {
  console.log("organizerConnections: ");
  console.log(organizerConnections[groupSlug]);
  if (organizerConnections[groupSlug]) {
    for (const ntnui_no in organizerConnections[groupSlug]) {
      console.log("Sending message to organizer " + ntnui_no);
      try {
        organizerConnections[groupSlug][ntnui_no].send(message);
      } catch (error) {
        console.log(
          "Could not notify organizer " +
            ntnui_no +
            ". Is there a problem with the socket URL? (Ignore if testing)"
        );
      }
    }
  }
};
