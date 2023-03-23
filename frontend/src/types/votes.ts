export interface VoteType {
  _id: string;
  title: string;
  voteText: string;
  voted: number[];
  options: OptionType[];
  isFinished: boolean;
  caseNumber: number;
  isActive: boolean;
}

export type OptionType = {
  _id: string;
  title: string;
  voteCount: number;
};
