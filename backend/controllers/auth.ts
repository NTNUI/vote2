import { Request, Response } from "express";
import { getNtnuiToken, getNtnuiProfile } from "ntnui-tools";
import { User } from "../models/user";
import { GroupType } from "../types/user";
import { groupOrganizers } from "../utils/user";

export async function login(req: Request, res: Response) {
  try {
    const tokens = await getNtnuiToken(
      req.body.phone_number,
      req.body.password
    );
    const userProfile = await getNtnuiProfile(tokens.access);

    let mainAssemblyOrganizer = false;

    // Members of the Main Board can modify the main assembly
    // Every other user is a member
    if (
      userProfile.data.memberships.some(
        (membership) => membership.slug == "hovedstyret"
      )
    ) {
      mainAssemblyOrganizer = true;
    }

    // Get committees and role in committee
    const groups: GroupType[] = [
      {
        groupName: "NTNUI",
        groupSlug: "main-assembly",
        organizer: mainAssemblyOrganizer,
      },
    ];
    userProfile.data.memberships.forEach((membership) => {
      let organizer = false;
      if (groupOrganizers().includes(membership.type)) {
        organizer = true;
      }
      groups.push({
        groupName: membership.group,
        groupSlug: membership.slug,
        organizer: organizer,
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
