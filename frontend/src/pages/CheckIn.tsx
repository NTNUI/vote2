import { Container, Text } from "@mantine/core";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

export function CheckIn() {
  const [result, setResult] = useState("");
  return (
    <>
      <Container>
        <QrScanner
          containerStyle={{ width: 500 }}
          onDecode={(result) => setResult(result)}
          onError={(error) => console.log(error?.message)}
        />
        <Text>{result}</Text>
      </Container>
    </>
  );
}
