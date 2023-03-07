import { ObjectId } from "mongoose";

export type VoteType = {
  _id: ObjectId; 
  title: string;
  voteText: string;
  voted: number[];
  options: OptionType[];
  isFinished: boolean;
};

export type OptionType = {
  title: string;
  voteCount: number;
};
