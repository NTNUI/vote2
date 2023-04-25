import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode } from "../components/QrCode";
import useWebSocket from "react-use-websocket";
import { WaitingRoom } from "../components/WaitingRoom";
import { VotationBox } from "../components/VotationBox";
import { isUserInAssembly } from "../services/assembly";
import { checkedInState, checkedInType } from "../utils/Context";
import { Box, Image, Text } from "@mantine/core";
import Arrow from "../assets/Arrow.svg";
import { getCurrentVotationByGroup } from "../services/votation";

export function AssemblyLobby() {
  const [kickedOut, setKickedOut] = useState<boolean>(false);
  const [activeVotation, setActiveVotation] = useState<boolean>(false);
  const [voted, setVoted] = useState<boolean>(false);
  const { lastMessage } = useWebSocket(import.meta.env.VITE_SOCKET_URL);
  const { checkedIn, setCheckedIn, groupSlug, setGroupSlug, groupName } =
    useContext(checkedInState) as checkedInType;
  let navigate = useNavigate();

  useEffect(() => {
    // Redirect to waiting room if already checked in
    const isCheckedIn = async () => {
      if (await isUserInAssembly(groupSlug)) {
        setCheckedIn(true);
        if ((await getCurrentVotationByGroup(groupSlug)) !== null) {
          setActiveVotation(true);
          setVoted(false);
        } else {
          setActiveVotation(false);
          setVoted(false);
        }
      } else {
        setCheckedIn(false);
        setGroupSlug("");
      }
    };
    isCheckedIn();
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
      if (decodedMessage.group == groupSlug) {
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
        if (decodedMessage.status == "checkout") {
          setCheckedIn(false);
        }
      }
    }
  }, [lastMessage]);

  const userHasVoted = () => {
    setVoted(true);
  };
  function handleBreadcrumbGroupClick() {
    navigate("/start");
  }

  return (
    <>
      {!checkedIn && (
        <Box
          style={{
            position: "absolute",
            top: 70,
            left: 30,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Text fz={"sm"} fw={500} onClick={() => handleBreadcrumbGroupClick()}>
            GROUPS
          </Text>
          <Image width={15} m={10} src={Arrow}></Image>
          <Text fz={"sm"} fw={600}>
            QR-CODE
          </Text>
        </Box>
      )}
      <Text mt={100} mb={20}>
        {groupName} assembly
      </Text>

      {kickedOut ? (
        <WaitingRoom
          message={
            "You have logged in on another device, or you are kicked from this assembly."
          }
        />
      ) : checkedIn && groupSlug && voted ? (
        <WaitingRoom message={"Your vote is submitted!"} />
      ) : checkedIn && groupSlug && activeVotation ? (
        <VotationBox
          groupSlug={groupSlug}
          userHasVoted={() => userHasVoted()}
        />
      ) : checkedIn && groupSlug && !activeVotation ? (
        <WaitingRoom message={"There are currently no active vote, look up!"} />
      ) : (
        <>
          <Text size={"xl"}>Check-in for {groupName.toUpperCase()}</Text>
          <QrCode />
        </>
      )}
    </>
  );
}
