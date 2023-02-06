import { Button } from "@mantine/core";
import { LoginForm } from "../components/LoginForm";
import logo from "../assets/ntnuiLogo.svg";

export function Login() {
  return (
    <>
      <img src={logo} alt="NTNUI logo" width="200px"></img>
      <LoginForm />
    </>
  );
}
