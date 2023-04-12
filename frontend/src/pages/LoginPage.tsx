import { Image } from "@mantine/core";
import { LoginForm } from "../components/LoginForm";
import logo from "../assets/ntnuiLogo.svg";
import { useNavigate } from "react-router-dom";

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
      <LoginForm />
    </>
  );
}
