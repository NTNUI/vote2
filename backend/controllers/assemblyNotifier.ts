import { allSockets, connections } from "..";

export const notifyAll = (status: string, group: string) => {
  allSockets.clients.forEach((client) => {
    client.send(JSON.stringify({ status: status, group: group }));
  });
};

export const notifyOne = (ntnui_no: number, message: string) => {
  connections[ntnui_no].send(message);
};
