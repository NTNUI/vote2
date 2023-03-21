import axios from "axios";
import { QRType } from "../types/checkin";

export const getQrInfo = async (): Promise<{ access: string }> => {
  return (await axios.get("/qr")).data;
};

export const assemblyCheckin = async (
  qrScan: QRType
): Promise<{ title: string; message: string }> => {
  try {
    const res = await axios.post("/qr/checkin", {
      group: qrScan.group,
      token: qrScan.access,
      timestamp: qrScan.timestamp,
    });
    if (res.status == 200) {
      return {
        title: "Success",
        message: res.data.message,
      };
    }
    return {
      title: "Error",
      message: "Failed to check in user",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        title: "Error",
        message: error.response?.data.message,
      };
    }
    return {
      title: "Error",
      message: "Failed to check in user",
    };
  }
};
