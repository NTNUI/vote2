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
import {
  notifyOneParticipant,
  notifyOrganizers,
} from "../utils/socketNotifier";

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
      const assembly = await Assembly.findById(group);
      if (!assembly) {
        return res
          .status(400)
          .json({ message: "No assembly found on the given group found" });
      }

      const listOfVotations: VoteResponseType[] = await Votation.aggregate([
        {
          $match: {
            _id: { $in: assembly.votes },
          },
        },
        {
          $lookup: {
            from: "options", // The name of the collection containing the option documents (for joining data).
            localField: "options",
            foreignField: "_id",
            as: "options",
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            caseNumber: 1,
            voteText: 1,
            voted: { $size: "$voted" }, // Count the number of elements in the array to get the number of votes.
            maximumOptions: 1,
            isFinished: 1,
            numberParticipants: 1,
            options: 1,
            isActive: {
              $eq: ["$_id", assembly.currentVotation], // Compare _id with assembly.CurrentVotation
            },
          },
        },
      ]);

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

      if (!assembly.participants.includes(user._id)) {
        return res
          .status(400)
          .json({ message: "This user is not a part of the assembly" });
      }

      const vote = await Votation.findById(assembly.currentVotation);
      if (!vote) {
        return res
          .status(500)
          .json({ message: "There was an error getting the votation" });
      }

      if (vote.voted.includes(user._id)) {
        return res.status(200).json(null);
      }

      const optionList: LimitedOptionType[] = await Option.find({
        _id: { $in: vote.options },
      }).select("_id title");

      const votationResponse: LimitedVoteResponseType = {
        _id: assembly.currentVotation,
        title: vote.title,
        caseNumber: vote.caseNumber,
        voteText: vote.voteText,
        options: optionList,
        maximumOptions: vote.maximumOptions,
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
  const voteText = req.body.voteText || "";
  const caseNumber = req.body.caseNumber;
  const options: [] = req.body.options;
  const maximumOptions = req.body.maximumOptions || 1;
  const user = await User.findById(req.ntnuiNo);

  if (user) {
    if (
      user.groups.some(
        (membership) => membership.organizer && membership.groupSlug == group
      )
    ) {
      const assembly = await Assembly.findById(group);
      if (!(assembly && title && Number.isFinite(caseNumber))) {
        return res
          .status(400)
          .json({ message: "Error with groupID or case number" });
      }
      if (options) {
        if (!Array.isArray(options)) {
          return res
            .status(400)
            .json({ message: "Options is not on correct format" });
        }

        const newOptions = options.map((title) => ({
          title: title,
        }));

        // Insert the array of Options and create a new Votation
        try {
          // Insert the array of options and create a new votation
          const options: OptionType[] = await Option.insertMany(newOptions);

          // Extract the _id values from the inserted documents
          const insertedIDs = options.map((option) => option._id);

          // Create the new votation
          const newVotation = await Votation.create({
            title: title,
            caseNumber: caseNumber,
            isFinished: false,
            options: insertedIDs,
            voteText: voteText,
            maximumOptions: maximumOptions,
          });

          // Update the assembly with the new votation ID
          await Assembly.findByIdAndUpdate(group, {
            $push: {
              votes: newVotation._id,
            },
          });

          return res.status(200).json({
            message: "Votation successfully created",
            vote_id: newVotation._id,
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            message: "Error while creating votation",
          });
        }
      }
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
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
      const vote = await Votation.findById(voteId);
      const assembly = await Assembly.findById(group);

      if (!vote) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found " });
      }

      if (!assembly || !assembly.isActive) {
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
          currentVotation: vote._id,
        },
      });

      // Add votaton and options to an element for sending to participants.
      const optionList: LimitedOptionType[] = await Option.find({
        _id: { $in: vote.options },
      }).select("_id title");

      const votationResponse: LimitedVoteResponseType = {
        _id: voteId,
        title: vote.title,
        caseNumber: vote.caseNumber,
        voteText: vote.voteText,
        options: optionList,
        maximumOptions: vote.maximumOptions,
      };

      // Notify all active participants to fetch the activated votation.
      assembly.participants.forEach((member) => {
        notifyOneParticipant(
          member,
          JSON.stringify({
            status: "update",
            group: group,
            votation: votationResponse,
          })
        );
      });

      // Set number of participants to the number of active participants.
      // This is used to store the number of logged in users when the votation was held.
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
          .json({ message: "There are currently no votation ongoing" });
      }

      const voteId = assembly.currentVotation;
      const vote = await Votation.findById(voteId);

      if (!vote) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found" });
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
        notifyOneParticipant(
          member,
          JSON.stringify({ status: "ended", group: group })
        );
      });

      notifyOrganizers(group, JSON.stringify({ voteEnded: true }));

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
        if (assembly.currentVotation.toString() === voteId.toString()) {
          return res.status(400).json({
            message: "One cannot delete the currently active votation",
          });
        }
      }

      await Option.deleteMany({ _id: { $in: vote.options } });
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

      if (
        assembly.currentVotation &&
        assembly.currentVotation.toString() === voteId.toString()
      ) {
        return res.status(400).json({
          message: "Cannot edit the currently active votation",
        });
      }

      if (vote.isFinished) {
        return res.status(400).json({
          message: "Cannot edit a finished votation",
        });
      }

      await Option.deleteMany({ _id: { $in: vote.options } });

      let insertedOptionIDs: string[] = [];
      if (options) {
        if (!Array.isArray(options)) {
          return res
            .status(400)
            .json({ message: "Options is not on correct format" });
        }

        const newOptions = (await Option.insertMany(
          options.map((title) => ({
            title: title,
          }))
        )) as OptionType[];

        // Extract the _id values from the inserted documents
        insertedOptionIDs = newOptions.map((option) => option._id) as string[];
      }

      await Votation.findByIdAndUpdate(voteId, {
        $set: {
          title: !title ? vote.title : title,
          voteText: !voteText ? vote.voteText : voteText,
          options: !options ? vote.options : insertedOptionIDs,
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
  let optionIDs: string[] = req.body.optionIDs;

  if (user) {
    if (user.groups.some((membership) => membership.groupSlug == group)) {
      if (!Types.ObjectId.isValid(voteId)) {
        return res
          .status(400)
          .json({ message: "No votation with the given ID found" });
      }

      if (optionIDs) {
        if (!Array.isArray(optionIDs)) {
          return res
            .status(400)
            .json({ message: "Options is not on correct format" });
        }
      } else {
        return res.status(400).json({ message: "No vote provided" });
      }

      // Remove duplicates (maximum one vote per option)
      optionIDs = [...new Set(optionIDs)];

      const vote = await Votation.findById(voteId);
      const assembly = await Assembly.findById(group);

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

      if (vote.maximumOptions < optionIDs.length) {
        return res
          .status(400)
          .json({ message: "You have selected too many options" });
      }

      if (!assembly.currentVotation.toString() === voteId.toString()) {
        return res
          .status(400)
          .json({ message: "You can not vote on this votation" });
      }

      if (!assembly.participants.includes(user._id)) {
        return res
          .status(400)
          .json({ message: "This user is not a part of the assembly" });
      }

      if (vote.voted.includes(user._id)) {
        return res
          .status(400)
          .json({ message: "This user have already voted" });
      } else {
        await Votation.findByIdAndUpdate(voteId, {
          $push: {
            voted: user._id,
          },
        });

        await Option.updateMany(
          { _id: { $in: optionIDs } },
          { $inc: { voteCount: 1 } }
        );
      }

      // Notify organizers of new vote
      notifyOrganizers(group, JSON.stringify({ voteSubmitted: 1 }));

      return res.status(200).json({ message: "Successfully submitted vote" });
    }
  }

  return res.status(401).json({
    message: "Unauthorized",
  });
}
