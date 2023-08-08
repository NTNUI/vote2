import jsonwebtoken from "jsonwebtoken";
import { IncomingMessage } from "http";

export function NTNUINoFromRequest(req: IncomingMessage): number | null {
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
      return decoded.ntnui_no;
    }
  }
  return null;
}

interface CookieMap {
  [key: string]: string;
}
