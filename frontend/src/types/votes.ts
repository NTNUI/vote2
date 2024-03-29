export interface VoteType {
  numberParticipants: number;
  _id: string;
  title: string;
  voteText: string;
  voted: number;
  options: OptionType[];
  maximumOptions: number;
  isFinished: boolean;
  caseNumber: number;
  isActive: boolean;
  editable?: boolean;
}

export type OptionType = {
  _id: string;
  title: string;
  voteCount: number;
};

export type LimitedVoteType = {
  _id: string;
  title: string;
  caseNumber: number;
  voteText: string;
  options: LimitedOptionType[];
  maximumOptions: number;
};

export type LimitedOptionType = {
  _id: string;
  title: string;
};
