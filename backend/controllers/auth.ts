import { Request, Response } from "express";
import { getNtnuiToken, getNtnuiProfile, refreshNtnuiToken } from "ntnui-tools";
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

    // User must have a valid NTNUI membership for logging into the application.
    // The membership are valid until and including the expiry date.
    if (
      !userProfile.data.contract_expiry_date ||
      new Date(userProfile.data.contract_expiry_date || "") <
        new Date(new Date().toISOString().split("T")[0])
    ) {
      return res.status(403).send({
        message: "Unauthorized",
        info: "No active NTNUI membership found for the given user",
      });
    }

    // Check if start_date of one of the valid contracts is from the last month same date as today or earlier.
    // if none of the contract has been valid for a month, the user is not allowed to log in
    let validContract = false;
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );

    for (const contract of userProfile.data.contracts) {
      const contractStartDate = new Date(contract.start_date);
      if (contractStartDate <= oneMonthAgo) {
        // Also check if the contract is still valid
        if (
          !contract.expiry_date ||
          new Date(contract.expiry_date) >=
            new Date(today.toISOString().split("T")[0])
        ) {
          validContract = true;
          break;
        }
      }
    }

    if (!validContract) {
      return res.status(403).send({
        message: "Unauthorized",
        info: "NTNUI membership has not been valid for a month",
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
