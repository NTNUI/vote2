import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logoHeader.svg";
import logoSmall from "../assets/ntnuiLogo.svg";
import { Header, Container, Group, Text, Image, Modal } from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { useStyles } from "../styles/headerStyles";
import { QrCode } from "./QrCode";
import { useContext } from "react";
import { checkedInState, checkedInType } from "../utils/Context";

export function HeaderAction() {
  const [opened, { open, close }] = useDisclosure(false);
  const matches = useMediaQuery("(min-width: 400px)");
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { checkedIn } = useContext(checkedInState) as checkedInType;

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
  const isMobile = useMediaQuery("(max-width: 375px)");
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Check-out"
        centered
        size="auto"
        fullScreen={isMobile}
        zIndex={2}
      >
        {checkedIn ? (
          <QrCode />
        ) : (
          <Text>Check out successful. You can now leave the room</Text>
        )}
      </Modal>

      <Header
        zIndex={1}
        className={classes.header}
        sx={{ borderBottom: 0 }}
        height={60}
      >
        <Container className={classes.inner} fluid>
          <Group>
            {matches ? (
              <Image
                sx={{ cursor: !checkedIn ? "pointer" : "default" }}
                src={logo}
                onClick={() => !checkedIn && navigate("/start")}
                alt="NTNUI logo"
                width="200px"
              ></Image>
            ) : (
              <Image
                sx={{ cursor: !checkedIn ? "pointer" : "default" }}
                src={logoSmall}
                onClick={() => !checkedIn && navigate("/start")}
                alt="NTNUI logo"
                width="100px"
              ></Image>
            )}
          </Group>
          {checkedIn ? (
            <Text
              className={classes.button}
              onClick={open}
              data-testid="leave-assembly-button"
            >
              LEAVE ASSEMBLY
            </Text>
          ) : (
            <Text
              className={classes.button}
              onClick={logOut}
              data-testid="logout-button"
            >
              LOG OUT
            </Text>
          )}
        </Container>
      </Header>
    </>
  );
}
