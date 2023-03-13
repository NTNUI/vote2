import axios from "axios";
import { AssemblyType } from "../types/assembly";

export const createAssembly = async (group: string) => {
  return axios.post("/assembly/create", {
    group: group,
  });
};

export const isUserInAssembly = async (groupSlug: string): Promise<Boolean> => {
  const res = await axios.post("/assembly/user/includes", {
    groupSlug: groupSlug,
  });
  if (res.status == 200) {
    return true;
  }
  return false;
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
