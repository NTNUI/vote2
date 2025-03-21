import {
  Accordion,
  Container,
  Card,
  Progress,
  Text,
  Button,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { VoteType } from "../types/votes";
import { useEffect, useState } from "react";

export function Results({
  votation,
  addCase,
}: {
  votation: VoteType;
  addCase: (votation: VoteType) => void;
}) {
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
        styles={{
          item: {
            borderColor: "var(--mantine-color-ntnui-yellow-0)",
            borderBottomLeftRadius: "2px",
          },
        }}
      >
        <Accordion.Control
          onClick={() => setIsOpen(!isOpen)}
          styles={{
            control: {
              color: "white",
              "&:hover": {
                backgroundColor: "var(--mantine-color-ntnui-background-0)",
              },
            },
          }}
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
          <Text fw="bold" c="white">
            {votation.title}
          </Text>
          <Text c="white">{votation.voteText}</Text>
          <Card
            radius="md"
            styles={{
              root: {
                backgroundColor: "var(--mantine-color-ntnui-background-0)",
              },
            }}
          >
            {votation.options.map((option, index) => {
              return (
                <Container key={index}>
                  <Text ta="left" c="white" fw="200">
                    {option.title}
                  </Text>
                  <div style={{ position: "relative" }}>
                    <Text
                      style={{
                        position: "absolute",
                        left: "1em",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                        color: "black",
                      }}
                    >
                      {`${option.voteCount}/${votation.voted} (${Number(
                        100 * (option.voteCount / votation.voted || 0)
                      ).toFixed(2)}%)`}
                    </Text>
                    <Progress
                      value={100 * (option.voteCount / votation.voted)}
                      my="xs"
                      size="xl"
                      radius="md"
                      h="35px"
                      color="#47b550"
                    />
                  </div>
                </Container>
              );
            })}
            <Text c="white">
              {" "}
              {(votation.numberParticipants || 0) - votation.voted} of{" "}
              {votation.numberParticipants || 0} participants did not vote
            </Text>
            <Button mt={15} onClick={() => addCase(votation)}>
              Duplicate votation
            </Button>
          </Card>
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
}
