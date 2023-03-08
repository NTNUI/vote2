import { Container, Text } from "@mantine/core";

export function WaitingRoom({
  status,
  infoText,
}: {
  status: string;
  infoText: string;
}) {
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
