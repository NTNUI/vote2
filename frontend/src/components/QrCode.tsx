import { Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getQrInfo } from "../services/qr";
import logo from "../assets/ntnuiColor.svg";

export function QrCode(state: { groupName: string; groupSlug: string }) {
  let [access, setAccess] = useState<string>();
  let [time, setTime] = useState<number>(Date.now());
  const getCredentials = async () => {
    setAccess((await getQrInfo()).access);
  };

  // Update timestamp every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Set token on mount and update every 5 minutes.
  useEffect(() => {
    getCredentials();
    const interval = setInterval(() => getCredentials(), 300000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return !access ? (
    <Loader></Loader>
  ) : (
    <>
      <Text size={"xl"}>Check-in for {state.groupName.toUpperCase()}</Text>
      <QRCodeSVG
        fgColor="#ffffff"
        bgColor="#1b202c"
        imageSettings={{ src: logo, height: 15, width: 40, excavate: false }}
        includeMargin={true}
        size={350}
        value={JSON.stringify({
          access: access,
          timestamp: time,
          group: state.groupSlug,
        })}
      />
    </>
  );
}
