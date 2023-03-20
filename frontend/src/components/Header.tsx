import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logoHeader.svg";
import logoSmall from "../assets/ntnuiLogo.svg";
import { Header, Container, Group, Text, Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useStyles } from "../styles/headerStyles";

export function HeaderAction() {
  const matches = useMediaQuery("(min-width: 400px)");
  const { classes } = useStyles();
  const navigate = useNavigate();

  const logOut = async () => {
    await axios
      .get("/auth/logout")
      .then(() => {
        navigate("/");
        localStorage.setItem("isLoggedIn", "false");
      })
      .catch((err) => {
        console.log("Something went wrong while logging out");
        console.log(err);
        navigate("/");
      });
  };

  return (
    <>
      <Header className={classes.header} sx={{ borderBottom: 0 }} height={60}>
        <Container className={classes.inner} fluid>
          <Group>
            {matches ? (
              <Image
                sx={{ cursor: "pointer" }}
                src={logo}
                onClick={() => navigate("/start")}
                alt="NTNUI logo"
                width="200px"
              ></Image>
            ) : (
              <Image
                sx={{ cursor: "pointer" }}
                src={logoSmall}
                onClick={() => navigate("/start")}
                alt="NTNUI logo"
                width="100px"
              ></Image>
            )}
          </Group>
          {localStorage.getItem("isLoggedIn") == "true" ? (
            <Text className={classes.button} onClick={logOut}>
              LOG OUT
            </Text>
          ) : (
            <></>
          )}
        </Container>
      </Header>
    </>
  );
}
