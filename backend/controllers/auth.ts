import { Request, Response } from "express";
import {
  getNtnuiToken,
  isValidNtnuiToken,
  refreshNtnuiToken,
  getNtnuiProfile,
} from "ntnui-tools";
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
    let committees: GroupType[] = [];
    userProfile.data.memberships.forEach((membership: { slug: string }) => {
      committees.push({
        groupName: membership.slug,
        roleInGroup: membership.type,
      });
    });

    // Create or update user
    await User.findByIdAndUpdate(
      userProfile.data.ntnui_no,
      { $set: { ...userProfile.data, committees: committees } },
      { upsert: true }
    );

    return res.status(200).send(tokens);
  } catch (error) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const access = await refreshNtnuiToken(req.body.refresh);
    return res.status(200).send(access);
  } catch (error) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
}

export async function verify(req: Request, res: Response) {
  try {
    const access = await isValidNtnuiToken(req.body.access);
    console.log(access);
    if (access) {
      return res.status(200).send({ message: "ok" });
    }
    return res.status(401).send({
      message: "Unauthorized",
    });
  } catch (error) {
    return res.status(401).send({
      message: "Error",
    });
  }
}

export async function logout(req: Request, res: Response) {
  return res.status(401).send({
    message: "Not yet implemented",
  });
}
