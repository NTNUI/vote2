import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QrCode } from "../components/QrCode";
import useWebSocket from "react-use-websocket";
import { WaitingRoom } from "../components/WaitingRoom";
import { VotationBox } from "../components/VotationBox";
import { isUserInAssembly } from "../services/assembly";
import { checkedInState, checkedInType } from "../utils/Context";
import { Box, Image, Text } from "@mantine/core";
import Arrow from "../assets/Arrow.svg";
import { getCurrentVotationByGroup } from "../services/votation";
import { LimitedVoteType } from "../types/votes";
import { getUserData } from "../services/organizer";
import { NotFound } from "./NotFound";

export function AssemblyLobby() {
  let navigate = useNavigate();
  const { groupSlug } = useParams() as { groupSlug: string };
  const [groupName, setGroupName] = useState<string | undefined>(undefined);
  const [groupNotFound, setGroupNotFound] = useState<boolean>(false);

  const [kickedOut, setKickedOut] = useState<boolean>(false);
  const [activeVotation, setActiveVotation] = useState<boolean>(false);
  const [currentVotation, setCurrentVotation] = useState<
    LimitedVoteType | undefined
  >(undefined);
  const [voted, setVoted] = useState<boolean>(false);
  const { lastMessage, getWebSocket } = useWebSocket(
    import.meta.env.VITE_SOCKET_URL + "/lobby",
    {
      //Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: () => !kickedOut,
      // Try to reconnect 300 times before giving up.
      // Also possible to change interval (default is 5000ms)
      reconnectAttempts: 300,
    }
  );
  const { checkedIn, setCheckedIn } = useContext(
    checkedInState
  ) as checkedInType;

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
      }
    };
    const getGroupName = async () => {
      const userData = await getUserData();

      userData.groups.forEach((group) => {
        if (group.groupSlug == groupSlug) {
          setGroupName(group.groupName);
        }
      });

      if (!userData.groups.some((group) => group.groupSlug == groupSlug)) {
        setGroupNotFound(true);
      }
    };
    getGroupName();
    isCheckedIn();
  }, []);

  useEffect(() => {
    // Update state every time the websocket receive a message.
    if (lastMessage) {
      const decodedMessage = JSON.parse(lastMessage.data);
      // User is is removed from current lobby if logged in on another device.
      if (decodedMessage.status == "removed") {
        setKickedOut(true);
        getWebSocket()?.close();
      }
      // Redirect only if user is checked in on the right group.
      if (decodedMessage.group == groupSlug) {
        if (decodedMessage.status == "verified") {
          setCheckedIn(true);
        }
        if (decodedMessage.status == "update") {
          setCurrentVotation(decodedMessage.votation);
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

  return groupNotFound ? (
    // Render 404 not found component if group is not found
    <NotFound />
  ) : (
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
        {groupName && <>{groupName} assembly</>}
      </Text>

      {kickedOut ? (
        <WaitingRoom
          message={
            "You have logged in on another device/tab, this tab is therefore disconnected."
          }
        />
      ) : checkedIn && groupSlug && voted ? (
        <WaitingRoom message={"Your vote is submitted!"} />
      ) : checkedIn && groupSlug && activeVotation ? (
        <VotationBox
          groupSlug={groupSlug}
          currentVotation={currentVotation}
          userHasVoted={() => userHasVoted()}
        />
      ) : checkedIn && groupSlug && !activeVotation ? (
        <WaitingRoom message={"There are currently no active vote, look up!"} />
      ) : (
        <>
          {groupName && <Text size={"xl"}>Check-in</Text>}
          {groupName && (
            <Text size={"sm"} mb={10}>
              Please present this QR-code to the secretary when entering.
            </Text>
          )}
          <QrCode />
        </>
      )}
    </>
  );
}
