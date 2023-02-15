import { VoteType } from "./vote";

export type AssemblyType = {
  _id: string;
  votes: VoteType[];
  currentVotation: VoteType;
  isActive: boolean;
  participants: number;
  createdBy: number | null;
};
