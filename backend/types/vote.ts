import { Document, ObjectId } from "mongoose";

export interface VoteType extends Document {
  title: string;
  caseNumber: number;
  voteText: string;
  voted: number[];
  options: ObjectId[];
  isFinished: boolean;
  numberParticipants: number;
}

export interface OptionType extends Document {
  title: string;
  voteCount: number;
}

export type VoteResponseType = {
  _id: ObjectId;
  title: string;
  caseNumber: number;
  voteText: string;
  voted: number[];
  options: OptionType[];
  isActive: boolean;
  isFinished: boolean;
  numberParticipants: number;
};

export type LimitedOptionType = {
  _id: ObjectId;
  title: string;
};

export type LimitedVoteResponseType = {
  _id: ObjectId;
  title: string;
  caseNumber: number;
  voteText: string;
  options: LimitedOptionType[];
};
