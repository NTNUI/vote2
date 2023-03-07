export type VoteType = {
  caseNumber: number;
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
