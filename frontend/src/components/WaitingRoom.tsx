import { Container, Text } from "@mantine/core";

export function WaitingRoom(state: { message: string }) {
  return (
    <>
      <Container
        style={{
          border: "1px solid",
          width: "30vw",
          padding: "30px 40px",
          borderColor: "white",
          borderRadius: 5,
          borderBottomRightRadius: 0,
        }}
      >
        <Text ta="center" fz="lg" fw={300}>
          {state.message}
        </Text>
      </Container>
    </>
  );
}
