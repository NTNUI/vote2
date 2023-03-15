import { Document, ObjectId } from "mongoose";

export interface VoteType extends Document {
  title: string;
  caseNumber: number;
  voteText: string;
  voted: number[];
  options: ObjectId[];
  isFinished: boolean;
}

export interface OptionType extends Document {
  title: string;
  voteCount: number;
};


export type VoteResponseType = {
  title: string;
  caseNumber: number;
  voteText: string;
  voted: number[];
  options: OptionType[];
  isFinished: boolean;
}