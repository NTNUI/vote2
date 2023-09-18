import { Image, Container, Text } from "@mantine/core";
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
        size={"sm"}
        onClick={() => navigate("/faq")}
      >
        Questions about using Vote? Check out the FAQ
      </Text>
    </>
  );
}
