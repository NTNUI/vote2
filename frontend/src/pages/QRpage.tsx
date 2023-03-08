import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { QrCode } from "../components/QrCode";
import useWebSocket from "react-use-websocket";
import { WaitingRoom } from "../components/WaitingRoom";

export function QR() {
  const { state } = useLocation();
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [activeVotation, setActiveVotation] = useState<boolean>(false);
  const { lastMessage } = useWebSocket("ws://localhost:3000/status");

  useEffect(() => {
    if (lastMessage) {
      const decodedMessage = JSON.parse(lastMessage.data);
      if (decodedMessage.status == "verified") {
        setCheckedIn(true);
      }
    }
  }, [lastMessage]);

  return !checkedIn ? (
    <QrCode {...state}></QrCode>
  ) : (
    <WaitingRoom status={"ok"} infoText={"info"} />
  );
}
