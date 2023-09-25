import { Box, Button, Card, Flex, Loader, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useStyles } from "../styles/VotationStyles";
import { LimitedVoteType } from "../types/votes";
import { getCurrentVotationByGroup, submitVote } from "../services/votation";
import { showNotification } from "@mantine/notifications";

export function VotationBox(state: {
  groupSlug: string;
  userHasVoted: () => void;
  currentVotation: LimitedVoteType | undefined;
}) {
  const [currentVotation, setCurrentVotation] = useState<
    LimitedVoteType | undefined
  >(state.currentVotation);
  const matches = useMediaQuery("(min-width: 501px)");
  const [chosenOption, setChosenOption] = useState<string[]>([]);
  const { classes } = useStyles();

  const updateChosenOption = (optionId: string) => {
    if (currentVotation?.maximumOptions === 1) {
      // If the votation only allows one option, the chosen option is set to the clicked option
      setChosenOption([optionId]);
    } else if (
      currentVotation &&
      chosenOption.length >= currentVotation?.maximumOptions &&
      !chosenOption?.includes(optionId)
    ) {
      showNotification({
        title: "Error",
        message:
          "You can only choose " + currentVotation?.maximumOptions + " options",
      });
    } else if (chosenOption?.includes(optionId)) {
      setChosenOption(chosenOption.filter((id) => id !== optionId));
    } else {
      setChosenOption([...(chosenOption || []), optionId]);
    }
  };

  useEffect(() => {
    // The current votation are initially set by websocket/state from parent component/assemblyPage.
    // Undefined if page is reloaded, and in that case the votation will be fetched again.
    if (!currentVotation) {
      const fetch = async () => {
        const currentVotationData = await getCurrentVotationByGroup(
          state.groupSlug
        );
        setCurrentVotation(currentVotationData);
      };
      fetch().catch(console.error);
    }
  }, []);

  function submit(voteId: string) {
    if (chosenOption) {
      submitVote(state.groupSlug, voteId, chosenOption);
    }
    state.userHasVoted();
  }

  return !currentVotation ? (
    <Loader />
  ) : (
    <>
      <Box
        w={matches ? 400 : 280}
        sx={() => ({
          border: "1px solid",
          padding: "20px 30px 10px 30px",
          borderColor: "white",
          borderRadius: 5,
          borderBottomRightRadius: 0,
        })}
      >
        <Text fz={"lg"} fw={700} ta={"left"}>
          {currentVotation.title}
        </Text>
        <Text fz={"md"} mb={25} ml={10} ta={"left"}>
          {currentVotation.voteText}
        </Text>
        <Flex
          mih={50}
          gap="xs"
          justify="center"
          align="center"
          direction="column"
          wrap="nowrap"
        >
          {currentVotation.options.map((option) => (
            <Card
              withBorder
              className={classes.optionButton}
              sx={
                chosenOption.includes(option._id)
                  ? (theme) => ({
                      backgroundColor: "white",
                      color: theme.colors.ntnui_background[0],
                      borderColor: "white",
                    })
                  : () => ({})
              }
              w={matches ? 400 : 300}
              key={option.title}
              onClick={() => updateChosenOption(option._id)}
            >
              <Text>{option.title}</Text>
            </Card>
          ))}
        </Flex>
        <Button
          m={30}
          size={"md"}
          w={150}
          color={"green"}
          disabled={chosenOption.length < 1}
          onClick={() => submit(currentVotation._id)}
        >
          Confirm
        </Button>
      </Box>
    </>
  );
}
