import { Box, Image, Container, Loader, Text } from "@mantine/core";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { assemblyCheckin } from "../services/qr";
import { QRType } from "../types/checkin";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import Arrow from "../assets/Arrow.svg";

export function CheckIn() {
  const [result, setResult] = useState<string>();
  const [processing, setProcessing] = useState<boolean>(false);
  const matches = useMediaQuery("(max-width: 450px)");
  let navigate = useNavigate();

  const checkInUser = async (data: QRType) => {
    setProcessing(true);
    showNotification(await assemblyCheckin(data));
    setProcessing(false);
  };

  useEffect(() => {
    if (result) {
      try {
        const decodedResult = JSON.parse(result);
        const { QRData, group } = decodedResult;
        checkInUser({ QRData, group });
      } catch (error) {
        showNotification({
          title: "Error",
          message: "The given QR code is not valid",
        });
      }
    }
  }, [result]);

  function handleBreadcrumbGroupClick() {
    navigate("/start");
  }
  function handleBreadcrumbOrganizerClick() {
    navigate("/admin");
  }
  return (
    <>
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
        <Text
          fz={"sm"}
          fw={500}
          onClick={() => handleBreadcrumbOrganizerClick()}
        >
          ORGANIZER
        </Text>
        <Image width={15} m={10} src={Arrow}></Image>
        <Text fz={"sm"} fw={600}>
          CHECK-IN-SCANNER
        </Text>
      </Box>
      <Container mt={50}>
        {!processing ? (
          <>
            <QrScanner
              constraints={{ facingMode: "environment" }}
              containerStyle={matches ? { width: "80vw" } : { width: "50vw" }}
              onDecode={(result) => setResult(result)}
              onError={(error) => console.log(error?.message)}
            />
          </>
        ) : (
          <>
            <Text size={"lg"}>Processing</Text>
            <Loader />
          </>
        )}
      </Container>
    </>
  );
}
