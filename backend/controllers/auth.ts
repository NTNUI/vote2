import { Request, Response } from "express";
import { getNtnuiToken, getNtnuiProfile } from "ntnui-tools";
import { User } from "../models/user";
import { GroupType } from "../types/user";

export async function login(req: Request, res: Response) {
  try {
    const tokens = await getNtnuiToken(
      req.body.phone_number,
      req.body.password
    );
    const userProfile = await getNtnuiProfile(tokens.access);

    // Get committees and role in committee
    let groups: GroupType[] = [];
    userProfile.data.memberships.forEach((membership: { slug: string }) => {
      groups.push({
        groupName: membership.slug,
        role: membership.type,
      });
    });

    // Create or update user
    await User.findByIdAndUpdate(
      userProfile.data.ntnui_no,
      { $set: { ...userProfile.data, groups: groups } },
      { upsert: true }
    );

    return res
      .cookie("accessToken", tokens.access, {
        maxAge: 1800000, // 30 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
      })
      .cookie("refreshToken", tokens.refresh, {
        maxAge: 86400000, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
      })
      .status(200)
      .json({ message: "Successful login" });
  } catch (error) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
}

export async function logout(req: Request, res: Response) {
  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json({ message: "Successfully logged out" });
}
