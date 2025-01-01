import axios from "axios";
import { LimitedVoteType, VoteType } from "../types/votes";

export const createVotation = async (
  group: string,
  title: string,
  caseNumber: number,
  voteText: string,
  options: string[],
  maximumOptions: number
): Promise<{ message: string; vote_id: string }> => {
  const res = (
    await axios.post(
      `/votation/${group}`,
      {
        title: title,
        caseNumber: caseNumber,
        description: voteText,
        options: options,
        maximumOptions: maximumOptions,
      },
      { withCredentials: true }
    )
  ).data;
  return res;
};

export const activateVotation = async (
  group: string,
  voteId: string,
  numberParticipants: number
) => {
  return axios.post(
    `votation/${group}/activate`,
    {
      voteId: voteId,
      numberParticipants: numberParticipants,
    },
    { withCredentials: true }
  );
};

export const deactivateVotation = async (group: string, voteId: string) => {
  return axios.post(
    `votation/${group}/current/deactivate`,
    {
      groupSlug: group,
      voteId: voteId,
    },
    { withCredentials: true }
  );
};

export const deleteVotation = async (group: string, voteId: string) => {
  return axios.delete(`/votation/${group}`, {
    data: {
      voteId: voteId,
    },
  });
};

export const editVotation = async (
  group: string,
  voteId: string,
  title: string,
  caseNumber: number,
  voteText: string,
  options: string[]
): Promise<VoteType> => {
  return axios.put(
    `/votation/${group}`,
    {
      voteId: voteId,
      title: title,
      caseNumber: caseNumber,
      description: voteText,
      options: options,
    },
    { withCredentials: true }
  );
};

export const getVotations = async (group: string): Promise<VoteType[]> => {
  return (await axios.get(`/votation/${group}/all`)).data;
};

export const getCurrentVotationByGroup = async (
  groupSlug: string
): Promise<LimitedVoteType> => {
  return (await axios.get(`/votation/${groupSlug}/current`)).data;
};

export const submitVote = async (
  groupSlug: string,
  voteId: string,
  optionId: string[]
) => {
  return (
    await axios.post(`/votation/${groupSlug}/submit`, {
      voteId: voteId,
      optionIDs: optionId,
    })
  ).data;
};
