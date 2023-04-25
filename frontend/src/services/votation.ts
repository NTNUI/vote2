import axios from "axios";
import { LimitedVoteType, VoteType } from "../types/votes";

export const createVotation = async (
  group: string,
  title: string,
  caseNumber: number,
  voteText: string,
  options: string[]
): Promise<{ message: string; vote_id: string }> => {
  const res = (
    await axios.post(
      "/votation/create/",
      {
        group: group,
        title: title,
        caseNumber: caseNumber,
        voteText: voteText,
        options: options,
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
    "/votation/activate/",
    {
      group: group,
      voteId: voteId,
      numberParticipants: numberParticipants,
    },
    { withCredentials: true }
  );
};

export const deactivateVotation = async (group: string, voteId: string) => {
  return axios.put(
    "/votation/deactivate/",
    {
      group: group,
      voteId: voteId,
    },
    { withCredentials: true }
  );
};

export const deleteVotation = async (group: string, voteId: string) => {
  return axios.delete("/votation/", {
    data: {
      group: group,
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
    "/votation/",
    {
      group: group,
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
      "/votation/allvotations/",
      {
        group: group,
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
      group: groupSlug,
    })
  ).data;
};

export const submitVote = async (
  groupSlug: string,
  voteId: string,
  optionId: string
) => {
  return (
    await axios.post("/votation/submit", {
      group: groupSlug,
      voteId: voteId,
      optionId: optionId,
    })
  ).data;
};
