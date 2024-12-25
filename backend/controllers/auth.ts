import { Request, Response } from "express";
import { getNtnuiToken, getNtnuiProfile, refreshNtnuiToken } from "ntnui-tools";
import { User } from "../models/user";
import { GroupType } from "../types/user";
import { groupOrganizers } from "../utils/user";
import { Organizer } from "../models/organizer";

export async function login(req: Request, res: Response) {
  try {
    const tokens = await getNtnuiToken(
      req.body.phone_number,
      req.body.password
    );
    const userProfile = await getNtnuiProfile(tokens.access);

    // User must have a valid NTNUI membership for logging into the application.
    // The membership are valid until and including the expiry date.
    if (
      !userProfile.data.contract_expiry_date ||
      new Date(userProfile.data.contract_expiry_date || "") <
        new Date(new Date().toISOString().split("T")[0])
    ) {
      return res.status(403).send({
        message: "Unauthorized",
        info: "NTNUI membership is expired",
      });
    }

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
    for (const membership of userProfile.data.memberships) {
      let organizer = false;
      // User is automatically an organizer if they are part of the group board
      if (groupOrganizers().includes(membership.type)) {
        organizer = true;
      } else {
        // Check if user is added as an extra organizer for the given assembly
        const extraOrganizer = await Organizer.exists({
          ntnui_no: userProfile.data.ntnui_no,
          assembly_id: membership.slug,
        });
        if (extraOrganizer) {
          organizer = true;
        }
      }
      groups.push({
        groupName: membership.group,
        groupSlug: membership.slug,
        organizer: organizer,
      });
    }

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
        path: "/auth/token/refresh",
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
    .clearCookie("refreshToken", { path: "/auth/token/refresh" })
    .status(200)
    .json({ message: "Successfully logged out" });
}

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token sent" });
  }

  try {
    const refreshedTokens = await refreshNtnuiToken(refreshToken);
    return res
      .cookie("accessToken", refreshedTokens.access, {
        maxAge: 1800000, // 30 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
      })
      .status(200)
      .json({ message: "accessToken refreshed" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};
