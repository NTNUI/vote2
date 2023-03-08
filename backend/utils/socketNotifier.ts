import { connections } from "..";

export const notifyOne = (ntnui_no: number, message: string) => {
  connections[ntnui_no].send(message);
};
