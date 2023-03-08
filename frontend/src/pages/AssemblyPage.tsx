import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QrCode } from "../components/QrCode";
import useWebSocket from "react-use-websocket";
import { WaitingRoom } from "../components/WaitingRoom";
import { VotationBox } from "../components/VotationBox";

export function AssemblyLobby() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [activeVotation, setActiveVotation] = useState<boolean>(false);
  const { lastMessage } = useWebSocket("ws://localhost:3000/status");

  useEffect(() => {
    // TODO: Check if user is already checked in
    // Missing endpoint
    // If checked in
    // setCheckedIn(true);
  }, []);

  useEffect(() => {
    if (lastMessage) {
      const decodedMessage = JSON.parse(lastMessage.data);
      if (decodedMessage.status == "verified") {
        setCheckedIn(true);
      }
      if (decodedMessage.status == "update") {
        setActiveVotation(true);
      }
      if (decodedMessage.status == "removed") {
        navigate("start");
      }
    }
  }, [lastMessage]);

  const voteFinished = () => {
    setActiveVotation(false);
  };

  return !checkedIn ? (
    <QrCode {...state}></QrCode>
  ) : activeVotation ? (
    <VotationBox
      groupSlug={state.groupSlug}
      voteFinished={() => voteFinished()}
    ></VotationBox>
  ) : (
    <WaitingRoom groupName={state.groupName} />
  );
}
