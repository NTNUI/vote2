import { VoteType } from "./votes";

export type AssemblyType = {
  _id: string;
  votes: string[];
  currentVotation: VoteType;
  isActive: boolean;
  participants: number[];
  createdBy: number | null;
};
