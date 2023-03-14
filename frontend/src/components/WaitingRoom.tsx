import { Badge, Container, Text } from "@mantine/core";
import CheckoutButton from "./CheckoutButton";

export function WaitingRoom(state: { groupName: string; message: string }) {
  return (
    <>
      <CheckoutButton groupName={state.groupName}></CheckoutButton>
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
        <Badge mb={20} variant="outline">
          {state.groupName} assembly
        </Badge>
        <Text ta={"center"} fz={"lg"} fw={300}>
          {state.message}
        </Text>
      </Container>
    </>
  );
}
