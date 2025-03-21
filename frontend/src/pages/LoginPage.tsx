import { Image, Container, Text, Anchor } from "@mantine/core";
import { LoginForm } from "../components/LoginForm";
import logo from "../assets/ntnuiLogo.svg";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  return (
    <>
      <Image
        style={{
          marginLeft: "auto",
          marginRight: "auto",
        }}
        src={logo}
        alt="NTNUI logo"
        width="200px"
      ></Image>
      <Container style={{ width: "90%" }}>
        <LoginForm />
      </Container>

      <Text
        style={{ cursor: "pointer" }}
        mt={10}
        size="sm"
        c="white"
        sx={{
          "&:hover": {
            textDecoration: "underline",
          },
        }}
        onClick={() => navigate("/faq")}
      >
        Questions about using Vote? Check out the FAQ
      </Text>

      <Text mt="sm" size="sm" c="white">
        <Anchor
          href="https://ntnui.slab.com/posts/ntnui-vote-how-to-zvrydrgc?shr=PB0gdHKZk8fxbs5AFpAqHsJH"
          target="_blank"
          rel="noopener noreferrer"
          c="white"
        >
          Do you want to use Vote for your own group assembly?
          <br />
          Check out this guide
        </Anchor>
      </Text>
    </>
  );
}
