import axios from "axios";
import { QRType } from "../types/checkin";

export const getQrInfo = async (): Promise<{ access: string }> => {
  return (await axios.get("/qr")).data;
};

export const assemblyCheckin = async (qrScan: QRType): Promise<boolean> => {
  try {
    const res = await axios.post("/qr/checkin", {
      group: qrScan.group,
      token: qrScan.access,
      timestamp: qrScan.timestamp,
    });
    if (res.status == 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
