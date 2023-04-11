export interface VoteType {
  numberParticipants: number;
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
  title: string;
  voteCount: number;
};

export type LimitedVoteType = {
  _id: string;
  title: string;
  caseNumber: number;
  voteText: string;
  options: LimitedOptionType[];
};

export type LimitedOptionType = {
  _id: string;
  title: string;
};
