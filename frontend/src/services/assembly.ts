import axios from "axios";
import { AssemblyType } from "../types/assembly";

export const createAssembly = async (group: string) => {
  return axios.post(
    "/assembly/create",
    {
      group: group,
    },
    { withCredentials: true }
  );
};

export const activateAssembly = async (group: string, isActive: boolean) => {
  return axios.put(
    "/assembly/activation",
    {
      group: group,
      isActive: isActive,
    },
    { withCredentials: true }
  );
};

export const deleteAssembly = async (group: string) => {
  return axios.delete("/assembly/", {
    data: {
      group: group,
    },
  });
};

export const getAssemblyByName = async (
  group: string
): Promise<AssemblyType> => {
  return (
    await axios.post("/assembly/", {
      groupName: group,

    })
  ).data;
};
