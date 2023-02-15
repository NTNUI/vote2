import { Button } from "@mantine/core";
import { LoginForm } from "../components/LoginForm";
import logo from "../assets/ntnuiLogo.svg";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  return (
    <>
      <img src={logo} alt="NTNUI logo" width="200px"></img>
      <LoginForm />
    </>
  );
}
