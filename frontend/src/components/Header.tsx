import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logoHeader.svg";
import logoSmall from "../assets/ntnuiLogo.svg";
import { Header, Container, Group, Text, Image, Modal } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useStyles } from "../styles/headerStyles";
import { QrCode } from "./QrCode";

export function HeaderAction(props: { checkedIn: boolean }) {
  const [opened, { open, close }] = useDisclosure(false);
  const matches = useMediaQuery("(min-width: 400px)");
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { state } = useLocation();

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
        {props.checkedIn && state ? (
          <QrCode groupSlug={state.groupSlug} groupName={state.groupName} />
        ) : (
          <Text>Check out successfull. You can now leave the room</Text>
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
                sx={{ cursor: "pointer" }}
                src={logo}
                onClick={() => !props.checkedIn && navigate("/start")}
                alt="NTNUI logo"
                width="200px"
              ></Image>
            ) : (
              <Image
                sx={{ cursor: "pointer" }}
                src={logoSmall}
                onClick={() => !props.checkedIn && navigate("/start")}
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
