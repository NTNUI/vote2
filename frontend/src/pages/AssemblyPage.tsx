import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { QrCode } from "../components/QrCode";
import useWebSocket from "react-use-websocket";
import { WaitingRoom } from "../components/WaitingRoom";
import { VotationBox } from "../components/VotationBox";
import { isUserInAssembly } from "../services/assembly";
import { SimpleGrid, Text } from "@mantine/core";
import CheckoutButton from "../components/CheckoutButton";

export function AssemblyLobby(props: {
  setCheckedIn: (checkin: boolean) => void;
  checkedIn: boolean;
}) {
  const { state } = useLocation();
  const [kickedOut, setKickedOut] = useState<boolean>(false);
  const [activeVotation, setActiveVotation] = useState<boolean>(false);
  const [voted, setVoted] = useState<boolean>(false);
  const { lastMessage } = useWebSocket(import.meta.env.VITE_SOCKET_URL);

  useEffect(() => {
    // Redirect to waiting room if already checked in
    const isChekedIn = async () => {
      if (await isUserInAssembly(state.groupSlug)) {
        props.setCheckedIn(true);
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
          props.setCheckedIn(true);
        }
        if (decodedMessage.status == "update") {
          props.setCheckedIn(true);
          setActiveVotation(true);
        }
        if (decodedMessage.status == "ended") {
          setActiveVotation(false);
          setVoted(false);
        }
        if (decodedMessage.status == "checkout") {
          props.setCheckedIn(false);
        }
      }
    }
  }, [lastMessage]);

  const userHasVoted = () => {
    setVoted(true);
  };

  return (
    <>
      <Text>{state.groupName} assembly</Text>

      {kickedOut ? (
        <WaitingRoom
          groupName={state.groupName}
          message={
            "You have logged in on another device, or you are kicked from this assembly."
          }
        />
      ) : !props.checkedIn ? (
        <>
          <Text size={"xl"}>Check-in for {state.groupName.toUpperCase()}</Text>
          <QrCode {...state}></QrCode>
        </>
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
      )}
    </>
  );
}
