import axios from "axios";
import { UserDataResponseType, UserSearchType } from "../types/user";

export const getUserData = async (): Promise<UserDataResponseType> => {
  return (await axios.get("/user/userData", { withCredentials: true })).data;
};

export const searchForGroupMember = async (
  groupSlug: string,
  search: string
): Promise<UserSearchType> => {
  return (
    await axios.post("/assembly/group/members/search", {
      groupSlug: groupSlug,
      search: search,
    })
  ).data;
};

export const addExternalOrganizerToAssembly = async (
  group: string,
  newOrganizer: number,
  name: string
) => {
  return axios.post("/assembly/organizer", {
    group: group,
    newOrganizer_ntnui_no: newOrganizer,
    newOrganizer_name: name,
  });
};

export const removeExternalOrganizerFromAssembly = async (
  group: string,
  organizer: number
) => {
  return axios.delete("/assembly/organizer", {
    data: {
      group: group,
      organizer_ntnui_no: organizer,
    },
  });
};

export const getExternalAssemblyOrganizers = async (
  groupSlug: string
): Promise<{ assembly_id: string; ntnui_no: number; name: string }[]> => {
  return (
    await axios.post("/assembly/organizers", {
      groupSlug: groupSlug,
    })
  ).data;
};
