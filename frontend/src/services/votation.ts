import axios from "axios";
import { OptionType, VoteType } from "../types/votes";

export const createVotation = async (
  group: string,
  title: string,
  caseNumber: number,
  voteText: string,
  options: OptionType[]
): Promise<VoteType> => {
  return axios.post(
    "/votation/create",
    {
      group: group,
      caseNumber: caseNumber,
      title: title,
      voteText: voteText,
      options: options,
    },
    { withCredentials: true }
  );
};

export const activateVotation = async (group: string, voteId: string) => {
  return axios.put(
    "/votation/activation",
    {
      group: group,
      voteId: voteId,
    },
    { withCredentials: true }
  );
};

export const deactivateVotation = async (group: string, voteId: string) => {
  return axios.put(
    "/votation/deactivation",
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
  voteText: string,
  options: OptionType[]
): Promise<VoteType> => {
  return axios.put(
    "/votation/",
    {
      group: group,
      voteId: voteId,
      title: title,
      voteText: voteText,
      options: options,
    },
    { withCredentials: true }
  );
};

export const getVotations = async (group: string): Promise<VoteType[]> => {
  return (
    await axios.post(
      "/votation/",
      {
        group: group,
      },
      {
        withCredentials: true,
      }
    )
  ).data;
};
