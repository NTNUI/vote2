import axios from "axios";
import { Group } from "../types/group";

export const getGroups = async (category?: string): Promise<Group[]> => {
  try {
    const response = await axios.post(
      "/groups",
      { category },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw new Error("Failed to fetch groups");
  }
};
