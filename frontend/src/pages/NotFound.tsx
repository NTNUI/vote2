import { Text, Image, Container } from "@mantine/core";
import { Link } from "react-router-dom";
import notfound from "../assets/404.svg";

export function NotFound() {
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Image src={notfound} alt="404" width="250px" mb={"5vh"}></Image>
      <Text>Oooops! You seem to be lost.</Text>
      <Text>
        Check out the{" "}
        <Link style={{ color: "white" }} to={"/start"}>
          home page
        </Link>{" "}
        instead
      </Text>
    </Container>
  );
}
