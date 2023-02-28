import { Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { VotationBox } from "../components/VotationBox";
import { WaitingRoom } from "../components/WaitingRoom";

export function Vote() {
  const { state } = useLocation();
  const [activeVotation, setActiveVotation] = useState<boolean>(false);
  const text = ["Welcome!", "The voting begins soon"];
  const changeInActiveVotation = () => {
    setActiveVotation(!activeVotation);
  };

  return (
    <>
      <Text fz={"xl"} fw={900} mb={"5vh"}>
        {state.groupName.toUpperCase()} ASSEMBLY{" "}
      </Text>
      {activeVotation ? (
        <VotationBox {...state} />
      ) : (
        <WaitingRoom status={text[0]} infoText={text[1]} />
      )}
    </>
  );
}
