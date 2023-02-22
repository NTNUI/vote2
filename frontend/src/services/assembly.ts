import axios from "axios";
import { UserDataGroupType } from "../types/user";

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

// export const getAssemblyData = async (group: string) => {
//   return axios.get("/assembly/", { data: { group: group } });
// };

export const getAssemblyByName = (group: UserDataGroupType) => {
  return axios.post(
    "/assembly/",
    {
      group: group,
    },
    { withCredentials: true }
  );
};
