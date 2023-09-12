import {
  Container,
  Title,
  Accordion,
  createStyles,
  Image,
  Box,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import Arrow from "../assets/arrow.svg";

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    minHeight: 650,
  },

  title: {
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },

  item: {
    maxWidth: 750,
    textAlign: "left",
    color: "black",
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    border: `1 solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export function FAQ() {
  const breakpoint = useMediaQuery("(min-width: 800px)");
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <>
      <Box
        style={{
          position: "absolute",
          top: 70,
          left: 30,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Text fz={"sm"} fw={500} onClick={() => navigate("/")}>
          LOGIN
        </Text>
        <Image width={15} m={10} src={Arrow}></Image>
        <Text fw={600} fz={"sm"}>
          FAQ
        </Text>
      </Box>

      <Container miw={breakpoint ? 750 : 0}>
        <Title align="center" size={25} mb={30} className={classes.title}>
          Frequently Asked Questions
        </Title>

        <Accordion variant="separated">
          <Accordion.Item className={classes.item} value="reset-password">
            <Accordion.Control>How can I reset my password?</Accordion.Control>
            <Accordion.Panel>
              {"NTNUI Vote uses user data from"}{" "}
              <a href="https://medlem.ntnui.no/" target="blank">
                medlem
              </a>
              {", if you have forgotten your password you can reset it there."}
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="who-can-use">
            <Accordion.Control>Who can use NTNUI Vote?</Accordion.Control>
            <Accordion.Panel>
              {
                "All groups in NTNUI can use NTNUI Vote. Board members automatically get access to manage their group, while both group members and board members can vote in an ongoing assembly."
              }
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="qr-code">
            <Accordion.Control>
              What is the purpose of the QR-code?
            </Accordion.Control>
            <Accordion.Panel>
              {
                "In order to vote in an assembly, the member must be physically present at the assembly. The QR-code is used to verify that the member is present at the assembly by an organizer scanning the QR-code at entrance. If you need a break or leaving when the assembly are still ongoing, you also need to scan the QR-code when leaving and entering the assembly again."
              }
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="expired-membership">
            <Accordion.Control>
              I type the correct password, but i still cannot log in
            </Accordion.Control>
            <Accordion.Panel>
              {
                "In order to log in, you need to have a valid membership in NTNUI. If you have not paid your membership fee, you will not be able to log in. You can check your membership status at "
              }
              <a href="https://medlem.ntnui.no/" target="blank">
                medlem
              </a>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
    </>
  );
}
