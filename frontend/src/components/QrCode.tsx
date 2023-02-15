import { Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getQrInfo } from "../services/qr";

export function QrCode(groupName: string) {
  let [access, setAccess] = useState<string>();
  let [time, setTime] = useState<number>(Date.now());
  const fetchData = async () => {
    const token = await getQrInfo();
    console.log(token);
    setAccess(token.access);
  };

  //Missing refreshing token
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return !access ? (
    <Loader></Loader>
  ) : (
    <QRCodeSVG
      includeMargin={true}
      size={500}
      value={JSON.stringify({
        access: access,
        timestamp: time,
        group: "groupName",
      })}
    />
  );
}
