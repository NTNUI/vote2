import { Loader } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getQrData } from "../services/qr";
import logo from "../assets/ntnuiColor.svg";
import { useNavigate } from "react-router-dom";
import { checkedInState, checkedInType } from "../utils/Context";

export function QrCode() {
  const { groupSlug } = useContext(checkedInState) as checkedInType;
  const navigate = useNavigate();
  const [QRData, setQRData] = useState<string>();
  const getCredentials = async () => {
    setQRData((await getQrData()).QRData);
  };

  // Update QR every 10 seconds
  useEffect(() => {
    if (!groupSlug) {
      navigate("/start");
    }

    getCredentials();
    const interval = setInterval(() => getCredentials(), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return !QRData ? (
    <Loader></Loader>
  ) : (
    <QRCodeSVG
      bgColor="#ffffff"
      fgColor="#1b202c"
      imageSettings={{ src: logo, height: 15, width: 40, excavate: false }}
      includeMargin={true}
      size={350}
      value={JSON.stringify({
        QRData: QRData,
        group: groupSlug,
      })}
    />
  );
}
