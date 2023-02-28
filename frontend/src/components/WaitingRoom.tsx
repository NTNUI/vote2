import { Container, Text } from "@mantine/core";
import { InfoCircle } from "tabler-icons-react";

type props = {
  status: string;
  infoText: string;
};

export function WaitingRoom({ status, infoText }: props) {
  return (
    <Container
      sx={() => ({
        border: "1px solid",
        width: "30vw",
        padding: "30px 40px",
        borderColor: "white",
        borderRadius: 5,
        borderBottomRightRadius: 0,
      })}
    >
      <Text ta={"left"} fz={"lg"} fw={700}>
        {status}
      </Text>
      <Text ta={"left"} fw={300}>
        {infoText}
      </Text>
    </Container>
  );
}
