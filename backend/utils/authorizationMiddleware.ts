import { Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
import { isValidNtnuiToken } from "ntnui-tools";
import { RequestWithNtnuiNo } from "./request";

/**
 * # The authorization middleware
 * 1. Retrieve access-token from cookies
 *     * If none are sent return error
 * 2. Check validity of access token against NTNUI
 *     * If not valid, return error
 *     - Decode ntnui_no from token and add to request
 *     - Allow user through middleware with next()
 */
const authorization = async (
  req: RequestWithNtnuiNo,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.cookies;
  try {
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isValid = await isValidNtnuiToken(accessToken);
    if (!isValid) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jsonwebtoken.decode(accessToken);
    if (decoded && typeof decoded !== "string") {
      req.ntnuiNo = parseInt(decoded.ntnui_no);
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authorization;
