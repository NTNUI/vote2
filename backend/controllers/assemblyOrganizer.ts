import { Response } from "express";
import { User } from "../models/user";
import { RequestWithNtnuiNo } from "../utils/request";
import { Organizer } from "../models/organizer";
import { axiosClient } from "../utils/axiosClient";

export async function addExternalOrganizerToAssembly(
  req: RequestWithNtnuiNo,
  res: Response
) {
  const group = req.body.groupSlug;
  const newOrganizer = req.body.newOrganizer_ntnui_no;
  const newOrganizerName = req.body.newOrganizer_name;

  try {
    await Organizer.findOneAndUpdate(
      { assembly_id: group, ntnui_no: newOrganizer }, // Filter
      {
        assembly_id: group,
        ntnui_no: newOrganizer,
        name: newOrganizerName,
      }, // Inserted or updated data
      { upsert: true } // Add if not exists (ensures no duplicates)
    );
    return res.status(200).json({ message: "Organizer successfully added" });
  } catch (err) {
    return res.status(500).json({ message: "Could not add organizer" });
  }
}

export async function removeExternalOrganizerFromAssembly(
  req: RequestWithNtnuiNo,
  res: Response
) {
  const group = req.body.groupSlug;
  const organizer = req.body.organizer_ntnui_no;

  try {
    await Organizer.findOneAndDelete({
      assembly_id: group,
      ntnui_no: organizer,
    });
    return res.status(200).json({ message: "Organizer successfully removed" });
  } catch (err) {
    return res.status(500).json({ message: "Could not remove organizer" });
  }
}

export async function getExternalOrganizersInAssembly(
  req: RequestWithNtnuiNo,
  res: Response
) {
  const group = req.body.groupSlug;

  try {
    const organizers = await Organizer.find({ assembly_id: group });
    return res.status(200).json(organizers);
  } catch (err) {
    return res.status(500).json({ message: "Could not get organizers" });
  }
}

export async function searchForGroupMember(
  req: RequestWithNtnuiNo,
  res: Response
) {
  const group = req.body.groupSlug;
  const search = req.body.search;

  try {
    const data = await axiosClient.get(
      `/groups/${group}/memberships?page_size=7&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.status(200).json(data.data.results);
  } catch (err) {
    return res.status(500).json({ message: "Could not search for members" });
  }
}
