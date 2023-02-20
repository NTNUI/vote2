import { Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getQrInfo } from "../services/qr";
import logo from "../assets/ntnuiColor.svg";

export function QrCode(state: { group: string }) {
  let [access, setAccess] = useState<string>();
  let [time, setTime] = useState<number>(Date.now());
  const getCredentials = async () => {
    setAccess(await (await getQrInfo()).access);
  };

  //Missing refresh token update
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    getCredentials();
  }, []);

  return !access ? (
    <Loader></Loader>
  ) : (
    <>
      <Text size={"xl"}>Check-in for {state.group.toUpperCase()}</Text>
      <QRCodeSVG
        fgColor="#ffffff"
        bgColor="#1b202c"
        imageSettings={{ src: logo, height: 50, width: 120, excavate: true }}
        includeMargin={true}
        size={500}
        value={JSON.stringify({
          access: access,
          timestamp: time,
          group: state.group,
        })}
      />
    </>
  );
}
