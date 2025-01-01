import { Log } from "../models/log";
import { RequestWithNtnuiNo } from "../utils/request";
import { Response } from "express";

export const getLogsForAssembly = async (
  req: RequestWithNtnuiNo,
  res: Response
): Promise<Response> => {
  const assemblyID = req.params.groupSlug;

  try {
    const logs = await Log.find({ assemblyID: assemblyID }).sort({
      createdAt: -1,
    });
    return res.status(200).json(logs);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while fetching logs for the assembly" });
  }
};
