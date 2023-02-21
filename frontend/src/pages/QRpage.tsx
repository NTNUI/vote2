import React from "react";
import { useLocation } from "react-router-dom";
import { QrCode } from "../components/QrCode";

export function QR() {
  const { state } = useLocation();
  return (
    <p>
      <QrCode {...state}></QrCode>
    </p>
  );
}
