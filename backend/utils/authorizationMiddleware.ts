import { Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
import { isValidNtnuiToken } from "ntnui-tools";
import { CustomError, UnauthorizedUserError } from "ntnui-tools/customError";
import { RequestWithNtnuiNo } from "./request";

/**
 * # The authorization middleware - Provided by NTNUI
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
  let { accessToken } = req.cookies;
  try {
    if (!accessToken) {
      throw new CustomError("No access token sent", 401);
    }
    const isValid = await isValidNtnuiToken(accessToken);
    if (!isValid) {
      throw new CustomError("Invalid token", 401);
    }
    const decoded = jsonwebtoken.decode(accessToken);
    if (decoded && typeof decoded !== "string") {
      req.ntnuiNo = decoded.ntnui_no;
      return next();
    }
    throw UnauthorizedUserError;
  } catch (error) {
    return next(error);
  }
};

export default authorization;
