import React from "react";
import { useLocation } from "react-router-dom";
import { VotationBox } from "../components/VotationBox";

export function Vote() {
  const { state } = useLocation();
  return (
    <>
      <VotationBox {...state}> </VotationBox>
    </>
  );
}
