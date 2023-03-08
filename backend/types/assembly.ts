import { ObjectId } from "mongoose";
import { VoteType } from "./vote";

export type AssemblyType = {
  _id: string;
  votes: ObjectId[];
  currentVotation: VoteType;
  isActive: boolean;
  participants: number[];
  createdBy: number | null;
};
