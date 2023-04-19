import { Image, Container } from "@mantine/core";
import { LoginForm } from "../components/LoginForm";
import logo from "../assets/ntnuiLogo.svg";

export function Login() {
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
    </>
  );
}
