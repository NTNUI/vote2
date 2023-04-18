import { connections } from "..";

export const notifyOne = (ntnui_no: number, message: string) => {
  try {
    connections[ntnui_no].send(message);
  } catch (error) {
    console.log(
      "Could not notify user " +
        ntnui_no +
        ". Is there a problem with the socket URL? (Ignore if testing)"
    );
  }
};
