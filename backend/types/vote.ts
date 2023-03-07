import { Document } from "mongoose";

export interface VoteType extends Document {
  title: string;
  caseNumber: number;
  voteText: string;
  voted: number[];
  options: OptionType[];
  isFinished: boolean;
}

export type OptionType = {
  title: string;
  voteCount: number;
};
