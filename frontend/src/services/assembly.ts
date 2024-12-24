import axios from "axios";
import { AssemblyType } from "../types/assembly";

export const createAssembly = async (group: string) => {
  return axios.post("/assembly/create", {
    group: group,
  });
};

export const isUserInAssembly = async (groupSlug: string): Promise<boolean> => {
  const res = await axios.post("/assembly/user/includes", {
    groupSlug: groupSlug,
  });
  return res.data.checkedIn;
};

export const activateAssembly = async (group: string, isActive: boolean) => {
  return axios.put("/assembly/activation", {
    group: group,
    isActive: isActive,
  });
};

export const deleteAssembly = async (group: string) => {
  return axios.delete("/assembly/", {
    data: {
      group: group,
    },
  });
};

export const getAssemblyByName = async (
  groupSlug: string
): Promise<AssemblyType> => {
  return (
    await axios.post("/assembly/", {
      groupSlug: groupSlug,
    })
  ).data;
};

export const getNumberOfParticipantsInAssembly = async (
  groupSlug: string
): Promise<number> => {
  return (
    await axios.post("/assembly/participants", {
      groupSlug: groupSlug,
    })
  ).data.participants;
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

export const searchForGroupMember = async (
  groupSlug: string,
  search: string
): Promise<any[]> => {
  return (
    await axios.post("/assembly/group/members/search", {
      groupSlug: groupSlug,
      search: search,
    })
  ).data;
};
