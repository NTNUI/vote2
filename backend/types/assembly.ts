import { ObjectId } from "mongoose";
import { VoteType } from "./vote";

export type AssemblyType = {
  _id: string;
  votes: ObjectId[];
  currentVotation: ObjectId;
  isActive: boolean;
  participants: number[];
  createdBy: number | null;
};

export type AssemblyResponseType = {
  _id: string;
  votes: ObjectId[];
  currentVotation: VoteType | null;
  isActive: boolean;
  participants: number[];
  createdBy: number | null;
  isExtraOrganizer: boolean;
};
