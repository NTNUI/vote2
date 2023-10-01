import { WebSocketServer } from "ws";
import { NTNUINoFromRequest } from "../utils/wsCookieRetriever";
import { User } from "../models/user";
import {
  removeOrganizerConnectionByCookie,
  storeOrganizerConnectionByNTNUINo,
} from "../utils/socketNotifier";

export const organizerWss = new WebSocketServer({ noServer: true });

organizerWss.on("connection", function connection(ws, req) {
  // Organizers has to send their groupSlug to be able to subscribe to events from their group.
  // Format of message: { groupSlug: string }
  ws.on("message", async function message(data: string) {
    const ntnuiNo = NTNUINoFromRequest(req);
    let groupSlug: string | null = null;

    try {
      groupSlug = JSON.parse(data).groupSlug;
    } catch (error) {
      // Invalid JSON
      ws.close();
      return;
    }
    if (ntnuiNo !== null && groupSlug !== null) {
      const user = await User.findById(ntnuiNo);
      if (user) {
        if (
          user.groups.some(
            (membership) =>
              membership.organizer && membership.groupSlug == groupSlug
          )
        ) {
          storeOrganizerConnectionByNTNUINo(ntnuiNo, groupSlug, ws);
          console.log(
            "Organizer " + ntnuiNo + " are subscribed to group " + groupSlug
          );
        } else {
          // User is not organizer of group
          ws.close();
        }
      } else {
        // User not found
        ws.close();
      }
    } else {
      // User not logged in / invalid cookie
      ws.close();
    }
  });

  ws.on("pong", () => {
    // The client responded to the ping, so the connection is still active.
  });

  ws.on("close", () => {
    removeOrganizerConnectionByCookie(req);
  });
});
