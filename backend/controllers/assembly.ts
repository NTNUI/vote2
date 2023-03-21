import { Response } from "express";
import { Assembly } from "../models/assembly";
import { User } from "../models/user";
import { Votation, Option } from "../models/vote";
import { RequestWithNtnuiNo } from "../utils/request";

export async function createAssembly(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const group = req.body.group;
  const user = await User.findById(req.ntnuiNo);

  if (user) {
    if (
      user.groups.some(
        (membership) => membership.organizer && membership.groupSlug == group
      )
    ) {
      await Assembly.findByIdAndUpdate(
        group,
        {
          $set: {
            isActive: false,
            createdBy: Number(req.ntnuiNo),
          },
        },
        { upsert: true }
      );
      return res.status(200).json({ message: "Assembly successfully created" });
    }
  }

  return res
    .status(401)
    .json({ message: "You are not authorized to create this assembly" });
}

export async function setAssemblyStatus(
  req: RequestWithNtnuiNo,
  res: Response
) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const group = req.body.group;
  const user = await User.findById(req.ntnuiNo);

  if (user) {
    if (
      user.groups.some(
        (membership) => membership.organizer && membership.groupSlug == group
      )
    ) {
      const assembly = await Assembly.findByIdAndUpdate(group, {
        $set: { isActive: req.body.isActive },
      });

      if (assembly == null) {
        return res
          .status(400)
          .json({ message: "No assembly with the given ID found" });
      }
      return res.status(200).json({ message: "Assembly successfully updated" });
    }
  }

  return res.status(401).json({
    message: "You are not authorized to change activation for this assembly",
  });
}

export async function deleteAssembly(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const group = req.body.group;
  const user = await User.findById(req.ntnuiNo);

  if (user) {
    if (
      user.groups.some(
        (membership) => membership.organizer && membership.groupSlug == group
      )
    ) {
      const assembly = await Assembly.findById(group);

      if (assembly == null) {
        return res
          .status(400)
          .json({ message: "No assembly with the given ID found" });
      }
      if (assembly.isActive) {
        return res.status(400).json({
          message: "Can't delete a active assembly, deactivate first.",
        });
      }

      assembly.votes.forEach(async (vote) => {
        const votation = await Votation.findById(vote);

        if (votation) {
          for (let i = 0; i < votation.options.length; i++) {
            const oldOptionId = votation.options[i];

            await Option.findByIdAndDelete(oldOptionId);
          }
        }
        await Votation.findByIdAndDelete(vote);
      });
      await Assembly.deleteOne({ _id: assembly._id });
      return res.status(200).json({ message: "Assembly successfully deleted" });
    }
  }

  return res
    .status(401)
    .json({ message: "You are not authorized to delete this assembly" });
}

export async function getAssemblyByName(
  req: RequestWithNtnuiNo,
  res: Response
) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const groupSlug = req.body.groupSlug;
  const user = await User.findById(req.ntnuiNo);

  if (user) {
    if (
      user.groups.some(
        (membership) =>
          membership.organizer && membership.groupSlug == groupSlug
      )
    ) {
      const assembly = await Assembly.findById(groupSlug);
      if (assembly == null) {
        return res
          .status(400)
          .json({ message: "No assembly with the given ID found" });
      }
      return res.status(200).json(assembly);
    }
  }
  return res.status(401).json({ message: "Not authorized" });
}

export async function isUserInAssembly(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const groupSlug = req.body.groupSlug;
  const user = await User.findById(req.ntnuiNo);

  if (user) {
    if (user.groups.some((membership) => membership.groupSlug == groupSlug)) {
      const assembly = await Assembly.findById(groupSlug);

      if (assembly == null) {
        return res
          .status(400)
          .json({ message: "No assembly with the given ID found" });
      }

      if (assembly.participants.includes(Number(req.ntnuiNo))) {
        return res
          .status(200)
          .json({ status: "ok", info: "User is already checked in" });
      } else {
        return res
          .status(401)
          .json({ status: "not checked-in", info: "User is not checked in" });
      }
    }
  }
  return res.status(401).json({ message: "Not authorized" });
}
