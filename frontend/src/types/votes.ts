export interface VoteType {
  _id: string;
  title: string;
  voteText: string;
  voted: number[];
  options: OptionType[];
  isFinished: boolean;
  caseNumber: number;
}

export type OptionType = {
  title: string;
  voteCount: number;
};
