import axios from "axios";

export const getQrInfo = async (): Promise<{ access: string }> => {
  return (await axios.get("/qr", { withCredentials: true })).data;
};
