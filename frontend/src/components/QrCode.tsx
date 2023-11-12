import { Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getQrData } from "../services/qr";
import logo from "../assets/ntnuiColor.svg";
import { useParams } from "react-router-dom";

export function QrCode() {
  const { groupSlug } = useParams() as { groupSlug: string };
  const [QRData, setQRData] = useState<string>();
  const updateQR = async () => {
    setQRData((await getQrData()).QRData);
  };

  // Update QR every 10 seconds
  useEffect(() => {
    updateQR();
    const interval = setInterval(() => updateQR(), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return !QRData ? (
    <Loader />
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
