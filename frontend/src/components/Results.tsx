import { Accordion, Container, Card, Progress, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { VoteType } from "../types/votes";
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
            <Text>Results </Text>
          </Container>
        </Accordion.Control>
        <Accordion.Panel>
          <Text weight={"bold"} color={"white"}>
            {votation.title}
          </Text>
          <Text color={"white"}>{votation.voteText}</Text>
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
                  <Progress
                    value={100 * (option.voteCount / votation.voted.length)}
                    my="xs"
                    size="xl"
                    radius="md"
                    h={"35px"}
                    styles={{
                      label: {
                        color: "black",
                        position: "absolute",
                        left: "1em",
                      },
                    }}
                    color="#47b550"
                    label={
                      option.voteCount +
                      "/" +
                      votation.voted.length +
                      " (" +
                      Number(
                        100 * (option.voteCount / votation.voted.length || 0)
                      ).toFixed(2) +
                      "%)"
                    }
                  />
                </Container>
              );
            })}
            <Text color={"white"}>
              {" "}
              {(votation.numberParticipants || 0) -
                votation.voted.length} of {votation.numberParticipants || 0}{" "}
              participants did not vote
            </Text>
          </Card>
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
}
