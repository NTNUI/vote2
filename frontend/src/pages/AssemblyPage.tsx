import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { QrCode } from "../components/QrCode";
import useWebSocket from "react-use-websocket";
import { WaitingRoom } from "../components/WaitingRoom";
import { VotationBox } from "../components/VotationBox";
import { isUserInAssembly } from "../services/assembly";

export function AssemblyLobby() {
  const { state } = useLocation();
  const [kickedOut, setKickedOut] = useState<boolean>(false);
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [activeVotation, setActiveVotation] = useState<boolean>(false);
  const [voted, setVoted] = useState<boolean>(false);
  const { lastMessage } = useWebSocket("ws://localhost:3000/status");

  useEffect(() => {
    // Redirect to waiting room if already checked in
    const isChekedIn = async () => {
      if (await isUserInAssembly(state.groupSlug)) {
        setCheckedIn(true);
      }
    };
    isChekedIn();
  }, []);

  useEffect(() => {
    // Update state every time the websocket receive a message.
    if (lastMessage) {
      const decodedMessage = JSON.parse(lastMessage.data);
      // User is is removed from current lobby if logged in on another device.
      if (decodedMessage.status == "removed") {
        setKickedOut(true);
      }
      // Redirect only if user is checked in on the right group.
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
