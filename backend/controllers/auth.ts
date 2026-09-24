import { Request, Response } from "express";
import { getNtnuiToken, getNtnuiProfile, refreshNtnuiToken } from "ntnui-tools";
import { User } from "../models/user";
import { GroupType } from "../types/user";
import { groupOrganizers } from "../utils/user";

// A user with a contract valid on this date is accepted, even if the
// membership has not been active for 30 days. This is a consequence
// of the switch to our own iBooking payment system, and can be turned
// off with the DISABLE_MEMBERSHIP_CUTOFF_DATE_CHECK feature flag.
export const MEMBERSHIP_CUTOFF_DATE = "2026-06-01";

const isCutoffDateCheckEnabled = () =>
  process.env.DISABLE_MEMBERSHIP_CUTOFF_DATE_CHECK !== "true";

// Contracts are nullable in medlem
type MedlemContract = { start_date: string | null; expiry_date: string | null };
type Contract = { start_date: string; expiry_date: string };

const addDays = (date: string, days: number) => {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
};

const todayInNorway = () =>
  new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" });

const coversDate = (contract: Contract, date: string) =>
  contract.start_date <= date && date <= contract.expiry_date;

// Returns the start date of the continuous membership period covering the given date.
// Renewals within one day are treated as a continuous period.
const continuousMembershipStart = (contracts: Contract[], date: string) => {
  const sorted = contracts
    .filter((contract) => contract.start_date <= date)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  let period: Contract | undefined;
  for (const contract of sorted) {
    if (period && contract.start_date <= addDays(period.expiry_date, 1)) {
      if (contract.expiry_date > period.expiry_date) {
        period.expiry_date = contract.expiry_date;
      }
    } else {
      period = { ...contract };
    }
  }

  return period && date <= period.expiry_date ? period.start_date : undefined;
};

// Returns the reason the user is not allowed to log in, or null if they are.
// A user must have a currently valid membership, and either:
// 1. the membership has been active for at least the last 30 days, or
// 2. have had a valid contract on MEMBERSHIP_CUTOFF_DATE (unless disabled).
export const membershipDenialReason = (
  contracts: (MedlemContract | null)[] | undefined,
  today: string = todayInNorway(),
  cutoffDateCheckEnabled: boolean = isCutoffDateCheckEnabled()
): string | null => {
  // Contracts without both dates are not valid, matching NTNUI's own checks
  const validContracts = (contracts || []).filter(
    (contract): contract is Contract =>
      !!contract?.start_date && !!contract.expiry_date
  );

  const membershipStart = continuousMembershipStart(validContracts, today);
  if (!membershipStart) {
    return "No active NTNUI membership found for the given user";
  }

  if (
    membershipStart <= addDays(today, -30) ||
    (cutoffDateCheckEnabled &&
      validContracts.some((contract) =>
        coversDate(contract, MEMBERSHIP_CUTOFF_DATE)
      ))
  ) {
    return null;
  }

  return "NTNUI membership has not been valid for 30 days";
};

export async function login(req: Request, res: Response) {
  try {
    const tokens = await getNtnuiToken(
      req.body.phone_number,
      req.body.password
    );
    const userProfile = await getNtnuiProfile(tokens.access);

    // User must have a valid NTNUI membership for logging into the application.
    // See membershipDenialReason for the full requirements.
    const denialReason = membershipDenialReason(userProfile.data.contracts);
    if (denialReason) {
      return res.status(403).send({
        message: "Unauthorized",
        info: denialReason,
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
