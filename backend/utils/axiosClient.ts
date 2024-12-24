import axios from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.NTNUI_TOOLS_API_URL,
});
