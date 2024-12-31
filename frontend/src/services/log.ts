import axios from "axios";
import { LogType } from "../types/log";

export const fetchAssemblyLogs = async (
  groupSlug: string
): Promise<LogType[]> => {
  try {
    const response = await axios.get(`/logs/${groupSlug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw new Error("Failed to fetch logs");
  }
};
