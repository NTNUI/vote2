import { VoteType } from "./vote";

export type AssemblyType = {
  _id: string;
  votes: VoteType[];
  isActive: boolean;
  participants: number;
};
