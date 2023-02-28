import { Image } from "@mantine/core";
import { LoginForm } from "../components/LoginForm";
import logo from "../assets/ntnuiLogo.svg";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  return (
    <>
      <Image
        sx={{ position: "absolute", top: 0, left: 0 }}
        src={logo}
        alt="NTNUI logo"
        width="200px"
      ></Image>
      <LoginForm />
    </>
  );
}
