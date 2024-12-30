import { Response } from "express";
import { Assembly } from "../models/assembly";
import { Votation, Option } from "../models/vote";
import { RequestWithNtnuiNo } from "../utils/request";
import { AssemblyResponseType } from "../types/assembly";
import { Organizer } from "../models/organizer";

export async function createAssembly(req: RequestWithNtnuiNo, res: Response) {
  const group = req.body.groupSlug;

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

export async function setAssemblyStatus(
  req: RequestWithNtnuiNo,
  res: Response
) {
  const group = req.body.groupSlug;

  if (req.body.isActive == null || typeof req.body.isActive !== "boolean") {
    return res.status(400).json({ message: "isActive must be a boolean" });
  }

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

export async function deleteAssembly(req: RequestWithNtnuiNo, res: Response) {
  const group = req.body.groupSlug;

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

  await Organizer.deleteMany({ assembly_id: assembly._id });

  await Assembly.deleteOne({ _id: assembly._id });

  return res.status(200).json({ message: "Assembly successfully deleted" });
}

export async function getAssemblyByName(
  req: RequestWithNtnuiNo,
  res: Response
) {
  const groupSlug = req.body.groupSlug;

  const assembly = await Assembly.findById(groupSlug);
  if (assembly == null) {
    return res
      .status(400)
      .json({ message: "No assembly with the given ID found" });
  }

  const isExtraOrganizer = await Organizer.exists({
    ntnui_no: Number(req.ntnuiNo),
    assembly_id: groupSlug,
  });

  const vote = await Votation.findById(assembly.currentVotation);

  const assemblyResponse: AssemblyResponseType = {
    _id: assembly._id,
    votes: assembly.votes,
    currentVotation: vote,
    isActive: assembly.isActive,
    participants: assembly.participants,
    createdBy: assembly.createdBy,
    isExtraOrganizer: isExtraOrganizer ? true : false,
  };

  return res.status(200).json(assemblyResponse);
}

export async function isUserInAssembly(req: RequestWithNtnuiNo, res: Response) {
  const groupSlug = req.body.groupSlug;
  let checkedIn = false;

  const assembly = await Assembly.findById(groupSlug);

  if (assembly == null) {
    return res
      .status(400)
      .json({ message: "No assembly with the given ID found" });
  }

  if (assembly.participants.includes(Number(req.ntnuiNo))) {
    checkedIn = true;
  }

  return res.status(200).json({ checkedIn: checkedIn, assembly: assembly._id });
}

export async function getNumberOfParticipantsInAssembly(
  req: RequestWithNtnuiNo,
  res: Response
) {
  const groupSlug = req.body.groupSlug;

  const assembly = await Assembly.findById(groupSlug);
  if (!assembly) {
    return res
      .status(400)
      .json({ message: "No assembly with the given ID found" });
  }
  return res.status(200).json({ participants: assembly.participants.length });
}
