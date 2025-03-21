import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logoHeader.svg";
import logoSmall from "../assets/ntnuiLogo.svg";
import { AppShell, Container, Group, Text, Image, Modal, rem, Box } from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { QrCode } from "./QrCode";
import { useContext } from "react";
import { checkedInState, checkedInType } from "../utils/Context";

export function HeaderAction() {
  const [opened, { open, close }] = useDisclosure(false);
  const matches = useMediaQuery("(min-width: 400px)");
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

      <AppShell.Header
        pos="absolute"
        bg="transparent"
        withBorder={false}
        zIndex={1}
      >
        <Container fluid>
          <Box p="xs" display="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Group>
              {matches ? (
                <Image
                  style={{ cursor: !checkedIn ? "pointer" : "default" }}
                  src={logo}
                  onClick={() => !checkedIn && navigate("/start")}
                  alt="NTNUI logo"
                  w={rem(200)}
                />
              ) : (
                <Image
                  style={{ cursor: !checkedIn ? "pointer" : "default" }}
                  src={logoSmall}
                  onClick={() => !checkedIn && navigate("/start")}
                  alt="NTNUI logo"
                  w={rem(100)}
                />
              )}
            </Group>
            <Box
              component="span"
              style={{ cursor: "pointer" }}
              onClick={checkedIn ? open : logOut}
              data-testid={checkedIn ? "leave-assembly-button" : "logout-button"}
            >
              <Text>{checkedIn ? "LEAVE ASSEMBLY" : "LOG OUT"}</Text>
            </Box>
          </Box>
        </Container>
      </AppShell.Header>
    </>
  );
}
