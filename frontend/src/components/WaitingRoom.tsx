import { Container, Text } from "@mantine/core";

export function WaitingRoom(state: { groupName: string; message: string }) {
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
        {state.groupName + " assembly"}
      </Text>
      <Text ta={"left"} mt={10} fw={300}>
        {state.message}
      </Text>
    </Container>
  );
}
