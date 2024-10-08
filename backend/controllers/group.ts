import { Response } from "express";
import { getAllGroups } from "ntnui-tools";
import { RequestWithNtnuiNo } from "../utils/request";

export const getGroups = async (
  req: RequestWithNtnuiNo,
  res: Response
): Promise<Response> => {
  try {
    const groups = await getAllGroups(req.body.category);
    return res.status(200).json(groups);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while fetching groups from medlem" });
  }
};
