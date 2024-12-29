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
      "/votation",
      {
        groupSlug: group,
        title: title,
        caseNumber: caseNumber,
        voteText: voteText,
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
  return axios.put(
    "/votation/activate",
    {
      groupSlug: group,
      voteId: voteId,
      numberParticipants: numberParticipants,
    },
    { withCredentials: true }
  );
};

export const deactivateVotation = async (group: string, voteId: string) => {
  return axios.put(
    "/votation/deactivate",
    {
      groupSlug: group,
      voteId: voteId,
    },
    { withCredentials: true }
  );
};

export const deleteVotation = async (group: string, voteId: string) => {
  return axios.delete("/votation", {
    data: {
      groupSlug: group,
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
    "/votation",
    {
      groupSlug: group,
      voteId: voteId,
      title: title,
      caseNumber: caseNumber,
      voteText: voteText,
      options: options,
    },
    { withCredentials: true }
  );
};

export const getVotations = async (group: string): Promise<VoteType[]> => {
  return (
    await axios.post(
      "/votation/allvotations",
      {
        groupSlug: group,
      },
      {
        withCredentials: true,
      }
    )
  ).data;
};

export const getCurrentVotationByGroup = async (
  groupSlug: string
): Promise<LimitedVoteType> => {
  return (
    await axios.post("/votation/currentvotation", {
      groupSlug: groupSlug,
    })
  ).data;
};

export const submitVote = async (
  groupSlug: string,
  voteId: string,
  optionId: string[]
) => {
  return (
    await axios.post("/votation/submit", {
      groupSlug: groupSlug,
      voteId: voteId,
      optionIDs: optionId,
    })
  ).data;
};
