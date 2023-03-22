import {
  Accordion,
  Container,
  Card,
  Flex,
  Progress,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { VoteType } from "../types/votes";
import { IconChartBar } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function Results({ votation }: { votation: VoteType }) {
  const matches = useMediaQuery("(min-width: 400px)");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(!isOpen);
  }, []);

  return (
    <>
      <Accordion.Item
        onChange={() => setIsOpen(!isOpen)}
        key={votation._id}
        value={String(votation._id)}
        sx={(theme) => ({
          borderColor: theme.colors.ntnui_yellow[0],
          borderBottomLeftRadius: "2px",
        })}
      >
        <Accordion.Control
          onClick={() => setIsOpen(!isOpen)}
          sx={(theme) => ({
            color: "white",
            "&:hover": {
              backgroundColor: theme.colors.ntnui_background[0],
            },
          })}
        >
          <Container
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 0,
            }}
          >
            <Text>
              {" "}
              Case{" "}
              {matches
                ? votation.caseNumber + " - " + votation.title
                : votation.caseNumber}
            </Text>
            <Text>Results</Text>
          </Container>
        </Accordion.Control>
        <Accordion.Panel>
          <Text color={"white"}>{votation.title}</Text>
          <Card
            radius="md"
            sx={(theme) => ({
              backgroundColor: theme.colors.ntnui_background[0],
            })}
          >
            {votation.options.map((option, index) => {
              return (
                <Container key={index}>
                  <Text ta={"left"} color={"white"} fw={"200"}>
                    {option.title}
                  </Text>
                  {/* Lag prosentregning i value feltet */}
                  <Progress
                    value={70}
                    my="xs"
                    size="xl"
                    radius="md"
                    h={"35px"}
                    label={option.voteCount + "/" + 180}
                  />
                </Container>
              );
            })}
          </Card>
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
}
