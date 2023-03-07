import { Response } from "express";
import { Types } from "mongoose";
import { Assembly } from "../models/assembly";
import { User } from "../models/user";
import { RequestWithNtnuiNo } from "../utils/request";
import { Votation, Option } from "../models/vote";
import { OptionType } from "../types/vote";

export async function createVotation(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const group = req.body.group;
  const title = req.body.title;
  let voteDescription = req.body.voteText;
  const optionTitle = req.body.optionTitle;
  const user = await User.findById(req.ntnuiNo);

  if (voteDescription === undefined) {
    voteDescription = "";
  }

  if (user) {
    if (
      user.groups.some(
        (membership) => membership.organizer && membership.groupSlug == group
      )
    ) {
      const tempOptionTitles: OptionType[] = [];
      if (optionTitle != undefined) {
        optionTitle.forEach(function (title: string) {
          tempOptionTitles.push(
            new Option({
              title: title,
              voteCount: 0,
            })
          );
        });
      }

      const newVotation = new Votation({
        title: title,
        isFinished: false,
        options: tempOptionTitles,
        voteText: voteDescription,
      });

      const assembly = await Assembly.findById(group);
      if (assembly != null && title != undefined) {
        let tempVotes = assembly.votes;
        const feedback = await Votation.create(newVotation);
        if (tempVotes.length === 0) {
          tempVotes = [feedback.id];
        } else {
          tempVotes.push(feedback.id);
        }
        await Assembly.findByIdAndUpdate(group, {
          $set: {
            votes: tempVotes,
          },
        });
        return res
          .status(200)
          .json({ message: "Votation successfully created" });
      } else {
        return res
          .status(400)
          .json(
            title == undefined
              ? { message: "Votation is missing title" }
              : { message: "Assembly not found" }
          );
      }
    }
  }

  return res
    .status(401)
    .json({ message: "You are not authorized to proceed with this request" });
}

export async function setVotationStatus(
  req: RequestWithNtnuiNo,
  res: Response
) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const group = req.body.group;
  const voteId = req.body.voteId;
  const user = await User.findById(req.ntnuiNo);

  if (user) {
    if (
      user.groups.some(
        (membership) => membership.organizer && membership.groupSlug == group
      )
    ) {
      if (!Types.ObjectId.isValid(voteId)) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found " });
      }
      const vote = await Votation.findById(voteId);
      const assembly = await Assembly.findById(group);

      if (vote?.isFinished) {
        return res
          .status(400)
          .json({ message: "This votation cannot be reactivated" });
      }

      if (vote === null) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found " });
      }
      if (assembly?.currentVotation) {
        return res
          .status(400)
          .json({ message: "Another votation is currently ongoing" });
      }

      await Assembly.findByIdAndUpdate(group, {
        $set: {
          currentVotation: vote,
        },
      });
      return res
        .status(200)
        .json({ message: "Votation successfully activated" });
    }
  }

  return res
    .status(401)
    .json({ message: "You are not authorized to proceed with this request" });
}

export async function removeVotationStatus(
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
      const assembly = await Assembly.findById(group);

      if (assembly?.currentVotation === null) {
        return res
          .status(400)
          .json({ message: "There is no current votation ongoing" });
      }

      const voteId = assembly?.currentVotation._id;
      const vote = await Votation.findById(voteId);

      if (vote === null) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found " });
      }

      await Assembly.findByIdAndUpdate(group, {
        $set: {
          currentVotation: null,
        },
      });
      await Votation.findByIdAndUpdate(voteId, {
        $set: {
          isFinished: true,
        },
      });

      return res
        .status(200)
        .json({ message: "Votation successfully deactivated" });
    }
  }

  return res
    .status(401)
    .json({ message: "You are not authorized to proceed with this request" });
}

export async function deleteVotation(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const group = req.body.group;
  const voteId = req.body.voteId;
  const user = await User.findById(req.ntnuiNo);

  if (user) {
    if (
      user.groups.some(
        (membership) => membership.organizer && membership.groupSlug == group
      )
    ) {
      if (!Types.ObjectId.isValid(voteId)) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found " });
      }
      const vote = await Votation.findById(voteId);
      const assembly = await Assembly.findById(group);

      if (vote === null) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found " });
      }

      if (assembly === null) {
        return res
          .status(400)
          .json({ message: "No assembly with the given ID found " });
      }

      if (assembly.currentVotation !== null) {
        if (assembly.currentVotation._id.equals(voteId)) {
          return res.status(400).json({
            message: "One cannot delete the currently active votation",
          });
        }
      }

      await Votation.findByIdAndDelete(voteId);

      return res.status(200).json({ message: "Votation successfully deleted" });
    }
  }

  return res.status(401).json({
    message:
      "Testing delete, You are not authorized to proceed with this request",
  });
}

export async function editVotation(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.status(401).json({
    message:
      "Testing edit, You are not authorized to proceed with this request",
  });
}
