import axios from "axios";
import { QRType } from "../types/checkin";

export const getQrData = async (): Promise<{ QRData: string }> => {
  return (await axios.get("/qr")).data;
};

export const assemblyCheckin = async (
  qrScan: QRType
): Promise<{ title: string; message: string }> => {
  try {
    const res = await axios.post("/qr/checkin", {
      QRData: qrScan.QRData,
      group: qrScan.group,
      representsGroup: qrScan.representsGroup,
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
