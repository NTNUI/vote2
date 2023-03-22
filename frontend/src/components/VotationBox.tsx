import { Box, Button, Flex, Loader, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getAssemblyByName } from "../services/assembly";
import { AssemblyType } from "../types/assembly";
import { useStyles } from "../styles/VotationStyles";
import { LimitedOptionType, LimitedVoteType } from "../types/votes";
import { getCurrentVotationByGroup, submitVotation } from "../services/votation";

export function VotationBox(state: {
  groupSlug: string;
  userHasVoted: () => void;
}) {
  const [currentVotation, setCurrentVotation] = useState<LimitedVoteType | undefined>();
  const matches = useMediaQuery("(min-width: 501px)");
  const [chosenOption, setChosenOption] = useState<string>();
  const { classes } = useStyles();

  useEffect(() => {
    const fetch = async () => {
      const currentVotationData = await getCurrentVotationByGroup(state.groupSlug);
      setCurrentVotation(currentVotationData);
    };
    fetch().catch(console.error);
  }, []);

  function submitVote(voteId: string) {
    state.userHasVoted()
    if (chosenOption) {
      submitVotation(state.groupSlug, voteId, chosenOption)
    }
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
            <Button
              variant="outline"
              className={classes.optionButton}
              sx={
                chosenOption == option.title
                  ? (theme) => ({
                      backgroundColor: "white",
                      color: theme.colors.ntnui_background[0],
                      borderColor: "white",
                    })
                  : () => ({})
              }
              size="lg"
              w={matches ? 400 : 300}
              key={option.title}
              onClick={() => setChosenOption(option._id)}
            >
              {option.title}
            </Button>
          ))}
        </Flex>
        <Button
          m={30}
          size={"md"}
          w={150}
          color={"green"}
          disabled={!chosenOption}
          onClick={() => submitVote(currentVotation._id)}
        >
          Confirm
        </Button>
      </Box>
    </>
  );
}
