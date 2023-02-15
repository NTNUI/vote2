import { Response } from "express";
import { isValidNtnuiToken, refreshNtnuiToken } from "ntnui-tools";
import { Assembly } from "../models/assembly";
import { User } from "../models/user";
import { RequestWithNtnuiNo } from "../utils/request";

export async function getToken(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { refreshToken } = req.cookies;
    // Refresh token to ensure token is fresh (maximum lifespan).
    const accessToken = await refreshNtnuiToken(refreshToken);
    return res
      .cookie("accessToken", accessToken.access, {
        maxAge: 1800000, // 30 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
      })
      .status(200)
      .json(accessToken);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export async function assemblyCheckin(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const group = req.body.group;
  const token = req.body.token;
  const timestamp = req.body.timestamp;
  const user = await User.findById(req.ntnuiNo);
  console.log(user);

  // If user is logged inn, the correct token is provided,
  // and timestamp is less than 15 seconds ago
  if (
    user &&
    (await isValidNtnuiToken(token)) &&
    Date.now() - timestamp < 15000
  ) {
    if (user.groups.some((membership) => membership.groupName == group)) {
      const assembly = await Assembly.findByIdAndUpdate(
        { _id: group },
        { $addToSet: { participants: Number(req.ntnuiNo) } }
      );

      if (assembly == null) {
        return res
          .status(400)
          .json({
            message: "There is currently no active assembly on the given group",
          });
      }
      return res.status(200).json({ message: "Check-in successful" });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
}
