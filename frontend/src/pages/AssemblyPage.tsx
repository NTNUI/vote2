import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { QrCode } from "../components/QrCode";
import useWebSocket from "react-use-websocket";
import { WaitingRoom } from "../components/WaitingRoom";
import { VotationBox } from "../components/VotationBox";

export function AssemblyLobby() {
  const { state } = useLocation();
  const [kickedOut, setKickedOut] = useState<boolean>(false);
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [activeVotation, setActiveVotation] = useState<boolean>(false);
  const [voted, setVoted] = useState<boolean>(false);
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
      if (decodedMessage.status == "removed") {
        setKickedOut(true);
      }
      if (decodedMessage.group == state.groupSlug) {
        if (decodedMessage.status == "verified") {
          setCheckedIn(true);
        }
        if (decodedMessage.status == "update") {
          setCheckedIn(true);
          setActiveVotation(true);
        }
        if (decodedMessage.status == "ended") {
          setActiveVotation(false);
          setVoted(false);
        }
      }
    }
  }, [lastMessage]);

  const userHasVoted = () => {
    setVoted(true);
  };

  return kickedOut ? (
    <WaitingRoom
      groupName={state.groupName}
      message={
        "You have logged in on another device, or you are kicked from this assembly."
      }
    />
  ) : !checkedIn ? (
    <QrCode {...state}></QrCode>
  ) : voted ? (
    <WaitingRoom
      groupName={state.groupName}
      message={"Your vote is submitted!"}
    />
  ) : activeVotation ? (
    <VotationBox
      groupSlug={state.groupSlug}
      userHasVoted={() => userHasVoted()}
    />
  ) : (
    <WaitingRoom
      groupName={state.groupName}
      message={"There are currently no vote active, look up!"}
    />
  );
}
