import { Container, Loader, Text } from "@mantine/core";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { assemblyCheckin } from "../services/qr";
import { QRType } from "../types/checkin";

export function CheckIn() {
  const [result, setResult] = useState<string>();
  const [processing, setProcessing] = useState<boolean>(false);

  const checkInUser = async (data: QRType) => {
    setProcessing(true);
    if (await assemblyCheckin(data)) {
      showNotification({
        title: "Success",
        message: "User is checked-in",
      });
    } else {
      showNotification({
        title: "Error",
        message: "Failed to check in user",
      });
    }
    setProcessing(false);
  };

  useEffect(() => {
    if (result) {
      try {
        const decodedResult = JSON.parse(result);
        const { access, group, timestamp } = decodedResult;
        checkInUser({ access, group, timestamp });
      } catch (error) {
        showNotification({
          title: "Error",
          message: "The given QR code is not valid",
        });
      }
    }
  }, [result]);

  return (
    <>
      <Container>
        {!processing ? (
          <>
            <QrScanner
              constraints={{ facingMode: "environment" }}
              containerStyle={{ width: 800 }}
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
