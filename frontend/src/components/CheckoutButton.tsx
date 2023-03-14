import { Button } from "@mantine/core";
import { assemblyCheckout } from "../services/qr";

export default function CheckoutButton(state: { groupName: string }) {
  const checkOut = async () => {
    await assemblyCheckout({ group: state.groupName });
    console.log(await assemblyCheckout({ group: state.groupName }));
  };
  return (
    <Button onClick={checkOut}>
      Checkout from {state.groupName}s assembly
    </Button>
  );
}
