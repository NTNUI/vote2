import { Response } from "express";
import { Types } from "mongoose";
import { Assembly } from "../models/assembly";
import { User } from "../models/user";
import { RequestWithNtnuiNo } from "../utils/request";
import { Votation, Option } from "../models/vote";
import {
  LimitedOptionType,
  LimitedVoteResponseType,
  OptionType,
  VoteResponseType,
} from "../types/vote";
import { notifyOne } from "../utils/socketNotifier";

export async function getAllVotations(req: RequestWithNtnuiNo, res: Response) {
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
      const listOfVotations: VoteResponseType[] = [];

      const assembly = await Assembly.findById(group);
      if (!assembly) {
        return res
          .status(400)
          .json({ message: "No assembly with the given group found " });
      }

      const voteIDs = assembly.votes;

      for (const voteID of voteIDs) {
        if (!Types.ObjectId.isValid(String(voteID))) {
          continue;
        }
        const vote = await Votation.findById(voteID);

        if (!vote) {
          continue;
        }

        const optionList: OptionType[] = [];

        for (const optionID of vote.options) {
          const id = optionID;
          const option = await Option.findById(id);
          if (option) {
            const newOption = new Option({
              _id: id,
              title: option.title,
              voteCount: option.voteCount,
            });
            optionList.push(newOption);
          }
        }

        let isActive = false;
        if (assembly.currentVotation) {
          isActive = assembly.currentVotation._id.equals(vote._id);
        }

        const votationResponse: VoteResponseType = {
          _id: vote._id,
          title: vote.title,
          caseNumber: vote.caseNumber,
          voteText: vote.voteText,
          voted: vote.voted,
          options: optionList,
          isActive: isActive,
          isFinished: vote.isFinished,
          numberParticipants: vote.numberParticipants,
        };

        listOfVotations.push(votationResponse);
      }

      return res.status(200).json(listOfVotations);
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
}

export async function getCurrentVotation(
  req: RequestWithNtnuiNo,
  res: Response
) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const group = req.body.group;
  const user = await User.findById(req.ntnuiNo);

  if (user) {
    if (user.groups.some((membership) => membership.groupSlug == group)) {
      const assembly = await Assembly.findById(group);
      if (!assembly) {
        return res
          .status(400)
          .json({ message: "No assembly with the given group found " });
      }

      if (!assembly.currentVotation) {
        return res.status(200).json(null);
      }

      const participants: number[] = assembly.participants;

      if (!participants.includes(user._id)) {
        return res
          .status(400)
          .json({ message: "This user is not a part of the assembly" });
      }

      if (!Types.ObjectId.isValid(assembly.currentVotation._id)) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found " });
      }

      const vote = await Votation.findById(assembly.currentVotation._id);
      if (!vote) {
        return res.status(400).json({ message: "No votation found" });
      }

      const voted: number[] = vote.voted;

      if (voted.includes(user._id)) {
        return res.status(200).json(null);
      }

      const optionList: LimitedOptionType[] = [];

      for (const optionID of vote.options) {
        const id = optionID;
        const option = await Option.findById(id);
        if (option) {
          const newOption: LimitedOptionType = {
            _id: id,
            title: option.title,
          };
          optionList.push(newOption);
        }
      }

      const votationResponse: LimitedVoteResponseType = {
        _id: assembly.currentVotation._id,
        title: vote.title,
        caseNumber: vote.caseNumber,
        voteText: vote.voteText,
        options: optionList,
      };
      return res.status(200).json(votationResponse);
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
}

export async function createVotation(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const group = req.body.group;
  const title = req.body.title;
  let voteText = req.body.voteText;
  const caseNumber = req.body.caseNumber;
  const options: [] = req.body.options;
  const user = await User.findById(req.ntnuiNo);

  if (!voteText) {
    voteText = "";
  }

  if (user) {
    if (
      user.groups.some(
        (membership) => membership.organizer && membership.groupSlug == group
      )
    ) {
      const tempOptionTitles: OptionType[] = [];

      if (options) {
        if (!Array.isArray(options)) {
          return res
            .status(400)
            .json({ message: "Options is not on correct format" });
        }

        for (const optionID of options) {
          const title = optionID;
          const newOption = new Option({
            title: title,
            voteCount: 0,
          });
          const feedback = await Option.create(newOption);
          tempOptionTitles.push(feedback);
        }
      }

      const newVotation = new Votation({
        title: title,
        caseNumber: caseNumber,
        isFinished: false,
        options: tempOptionTitles,
        voteText: voteText,
      });

      const assembly = await Assembly.findById(group);
      if (assembly && title && Number.isFinite(caseNumber)) {
        const votationFeedback = await Votation.create(newVotation);
        const assemblyFeedback = await Assembly.findByIdAndUpdate(group, {
          $push: {
            votes: votationFeedback,
          },
        });
        if (assemblyFeedback) {
          return res
            .status(200)
            .json({ message: "Votation successfully created" });
        }
      } else if (!Number.isFinite(caseNumber)) {
        return res
          .status(400)
          .json({ message: "Votation is missing casenumber" });
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

  return res.status(401).json({ message: "Unauthorized" });
}

export async function activateVotationStatus(
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
          .json({ message: "No votation with the given ID found" });
      }
      const vote = await Votation.findById(voteId);
      const assembly = await Assembly.findById(group);

      if (!vote) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found " });
      }

      if (!assembly) {
        return res
          .status(400)
          .json({ message: "No assembly with the given group found " });
      }

      if (!assembly.isActive) {
        return res
          .status(400)
          .json({ message: "No active assembly with the given group found " });
      }

      if (vote.isFinished) {
        return res
          .status(400)
          .json({ message: "This votation cannot be reactivated" });
      }

      if (assembly.currentVotation) {
        return res
          .status(400)
          .json({ message: "Another votation is currently ongoing" });
      }

      await Assembly.findByIdAndUpdate(group, {
        $set: {
          currentVotation: vote,
        },
      });

      // Notify all active participants to fetch the activated votation.
      assembly.participants.forEach((member) => {
        notifyOne(member, JSON.stringify({ status: "update", group: group }));
      });

      await Votation.findByIdAndUpdate(voteId, {
        $set: {
          numberParticipants: req.body.numberParticipants,
        },
      });

      return res
        .status(200)
        .json({ message: "Votation successfully activated" });
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
}

export async function deactivateVotationStatus(
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

      if (!assembly || !assembly.currentVotation) {
        return res
          .status(400)
          .json({ message: "There is no current votation ongoing" });
      }

      const voteId = assembly.currentVotation._id;
      const vote = await Votation.findById(voteId);

      if (!vote) {
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

      // Notify all active participants to return to lobby.
      assembly.participants.forEach((member) => {
        notifyOne(member, JSON.stringify({ status: "ended", group: group }));
      });

      return res
        .status(200)
        .json({ message: "Votation successfully deactivated" });
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
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

      if (!vote) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found " });
      }

      if (!assembly) {
        return res
          .status(400)
          .json({ message: "No assembly with the given ID found " });
      }

      if (assembly.currentVotation) {
        if (assembly.currentVotation._id.equals(voteId)) {
          return res.status(400).json({
            message: "One cannot delete the currently active votation",
          });
        }
      }

      for (const optionID of vote.options) {
        const oldOptionId = optionID;
        await Option.findByIdAndDelete(oldOptionId);
      }

      await Votation.findByIdAndDelete(voteId);

      await Assembly.findByIdAndUpdate(group, {
        $pull: {
          votes: voteId,
        },
      });

      return res.status(200).json({ message: "Votation successfully deleted" });
    }
  }

  return res.status(401).json({
    message: "Unauthorized",
  });
}

export async function editVotation(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const group = req.body.group;
  const voteId = req.body.voteId;
  const title = req.body.title;
  const caseNumber = req.body.caseNumber;
  const voteText = req.body.voteText;
  const options: [] = req.body.options;
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

      if (!vote) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found " });
      }

      if (!assembly) {
        return res
          .status(400)
          .json({ message: "No assembly with the given ID found " });
      }

      if (assembly.currentVotation) {
        if (assembly.currentVotation._id.equals(voteId)) {
          return res.status(400).json({
            message: "One cannot edit the currently active votation",
          });
        }
      }

      for (const optionID of vote.options) {
        const oldOptionId = optionID;
        await Option.findByIdAndDelete(oldOptionId);
      }

      const tempOptionTitles: OptionType[] = [];

      if (options) {
        if (!Array.isArray(options)) {
          return res
            .status(400)
            .json({ message: "Options is not on correct format" });
        }

        for (let i = 0; i < options.length; i++) {
          const title = options[i];
          const newOption = new Option({
            title: title,
            voteCount: 0,
          });
          const feedback = await Option.create(newOption);
          tempOptionTitles.push(feedback);
        }
      }

      await Votation.findByIdAndUpdate(voteId, {
        $set: {
          title: !title ? vote.title : title,
          voteText: !voteText ? vote.voteText : voteText,
          options: !options ? vote.options : tempOptionTitles,
          caseNumber: !Number.isFinite(caseNumber)
            ? vote.caseNumber
            : caseNumber,
        },
      });

      return res.status(200).json({ message: "Votation successfully updated" });
    }
  }

  return res.status(401).json({
    message: "Unauthorized",
  });
}

export async function submitVote(req: RequestWithNtnuiNo, res: Response) {
  if (!req.ntnuiNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const group = req.body.group;
  const voteId = req.body.voteId;
  const user = await User.findById(req.ntnuiNo);
  const optionId = req.body.optionId;

  if (user) {
    if (user.groups.some((membership) => membership.groupSlug == group)) {
      if (!Types.ObjectId.isValid(voteId)) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found" });
      }

      if (!Types.ObjectId.isValid(optionId)) {
        return res
          .status(400)
          .json({ message: "No option with the given ID found" });
      }

      const vote = await Votation.findById(voteId);
      const assembly = await Assembly.findById(group);
      const option = await Option.findById(optionId);

      if (!assembly) {
        return res
          .status(400)
          .json({ message: "No assembly with the given group found " });
      }

      if (!assembly.currentVotation) {
        return res
          .status(400)
          .json({ message: "No currently active votation" });
      }

      if (!vote) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found " });
      }

      if (vote.isFinished) {
        return res
          .status(400)
          .json({ message: "This votation is already finished" });
      }

      if (!assembly.currentVotation._id.equals(voteId)) {
        return res
          .status(400)
          .json({ message: "You can not vote on this votation" });
      }

      if (!option) {
        return res
          .status(400)
          .json({ message: "No option with the given ID found " });
      }

      const participants: number[] = assembly.participants;

      if (!participants.includes(user._id)) {
        return res
          .status(400)
          .json({ message: "This user is not a part of the assembly" });
      }

      const voted: number[] = vote.voted;

      if (voted.indexOf(user._id) !== -1) {
        return res
          .status(400)
          .json({ message: "This user have already voted" });
      } else {
        await Votation.findByIdAndUpdate(voteId, {
          $push: {
            voted: user._id,
          },
        });

        await Option.findByIdAndUpdate(optionId, {
          $set: {
            voteCount: option.voteCount + 1,
          },
        });
      }

      return res.status(200).json({ message: "Successfully submited vote" });
    }
  }

  return res.status(401).json({
    message: "Unauthorized",
  });
}
