import { Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getQrInfo } from "../services/qr";
import logo from "../assets/ntnuiColor.svg";
import useWebSocket from "react-use-websocket";

export function QrCode(state: { groupName: string; groupSlug: string }) {
  let [access, setAccess] = useState<string>();
  let [time, setTime] = useState<number>(Date.now());
  const getCredentials = async () => {
    setAccess((await getQrInfo()).access);
  };
  const { lastMessage } = useWebSocket("ws://localhost:3000/status");

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
      <Text size={"xl"}>Check-in for {state.groupName.toUpperCase()}</Text>
      <Text>Status: {lastMessage?.data}</Text>
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
