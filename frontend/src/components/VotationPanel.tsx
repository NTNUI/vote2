import {
  Accordion,
  Button,
  MultiSelect,
  TextInput,
  Text,
  Box,
  Flex,
  NumberInput,
  SimpleGrid,
} from "@mantine/core";
import {
  activateVotation,
  deactivateVotation,
  deleteVotation,
  editVotation,
} from "../services/votation";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useStyles } from "../styles/EditAssemblyStyles";
import { VoteType } from "../types/votes";
import {
  getAssemblyByName,
  getNumberOfParticipantsInAssembly,
} from "../services/assembly";
import { AssemblyType } from "../types/assembly";

function VotationPanel({
  groupSlug,
  votation,
  isChanged,
  setIsChanged,
}: {
  groupSlug: string;
  votation: VoteType;
  isChanged: boolean;
  setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [editable, setEditable] = useState(false);
  const form = useForm<VoteType>({
    initialValues: {
      _id: votation._id,
      caseNumber: votation.caseNumber,
      title: "",
      isFinished: votation.isFinished,
      options: votation.options,
      voted: votation.voted,
      voteText: votation.voteText,
    },
  });
  const { classes } = useStyles();
  const matches = useMediaQuery("(min-width: 400px)");
  const [options, setOptions] = useState<string[]>(["Yes", "No", "Blank"]);
  const [isActive, setIsActive] = useState(false);
  const [participants, setParticipants] = useState<number>();

  useEffect(() => {
    const fetch = async () => {
      const numberOfParticipants = await getNumberOfParticipantsInAssembly(
        groupSlug
      );
      setParticipants(numberOfParticipants.participants);
    };

    fetch().catch(console.error);
  }, [isActive]);

  async function handleSubmit(vote: VoteType, votationId: string) {
    await editVotation(
      groupSlug,
      votationId,
      vote.title,
      vote.caseNumber,
      vote.voteText,
      vote.options
    ).catch(console.error);
    setEditable(false);
    setIsChanged(!isChanged);
  }

  async function activateVote(votation: VoteType) {
    if (!votation.isFinished) {
      await activateVotation(groupSlug, votation._id).catch(console.error);
      setIsActive(true);
      setIsChanged(!isChanged);
    }
  }

  async function deactivateVote(votation: VoteType) {
    votation.isFinished = true;
    await deactivateVotation(groupSlug, votation._id).catch(console.error);
    setIsActive(false);
    setIsChanged(!isChanged);
  }

  async function deleteVote(votation: VoteType) {
    await deleteVotation(groupSlug, votation._id).catch(console.error);
    setIsChanged(!isChanged);
  }

  return (
    <Accordion.Item
      key={votation._id}
      value={String(votation._id)}
      sx={(theme) => ({
        borderColor: theme.colors.ntnui_yellow[0],
        borderBottomLeftRadius: "2px",
      })}
    >
      <Accordion.Control
        sx={(theme) => ({
          color: "white",
          "&:hover": {
            backgroundColor: theme.colors.ntnui_background[0],
          },
        })}
      >
        <Text>
          Case{" "}
          {matches
            ? votation.caseNumber + " - " + votation.title
            : votation.caseNumber}
        </Text>
      </Accordion.Control>
      {editable ? (
        <Accordion.Panel
          sx={() => ({
            color: "white",
          })}
        >
          <form
            onSubmit={form.onSubmit((values) =>
              handleSubmit(values, votation._id)
            )}
          >
            <NumberInput
              type="number"
              precision={2}
              min={0}
              step={0.01}
              required
              withAsterisk
              label="Case number"
              className={classes.inputStyle}
              placeholder="Case number"
              {...form.getInputProps("caseNumber")}
            />
            <TextInput
              withAsterisk
              required
              label="Title"
              className={classes.inputStyle}
              placeholder="Title"
              {...form.getInputProps("title")}
            />
            <TextInput
              withAsterisk
              required
              label="Description"
              className={classes.inputStyle}
              placeholder="Description"
              {...form.getInputProps("voteText")}
            />
            <MultiSelect
              label="Creatable MultiSelect"
              className={classes.inputStyle}
              data={options}
              placeholder="Select items"
              searchable
              required
              creatable
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => {
                setOptions([...options, query]);
                return query;
              }}
              {...form.getInputProps("options")}
            />

            <Button type="submit" mt={10}>
              Save current vote
            </Button>
          </form>
        </Accordion.Panel>
      ) : (
        <Accordion.Panel
          sx={{
            color: "white",
          }}
        >
          <Box pl={10} pb={10} ta={"left"}>
            <Text fw={"700"}>Title:</Text>
            <Text>{votation.title}</Text>
            <Text fw={"700"}>Description:</Text>
            <Text>{votation.voteText}</Text>
            <Text fw={"700"}>Options:</Text>
            <Text>
              {votation.options.map((option, index) =>
                index != votation.options.length - 1
                  ? option.title + ", "
                  : option.title + ""
              )}
            </Text>
          </Box>
          <Flex
            direction={matches ? "row" : "column"}
            justify={matches ? "space-between" : "center"}
          >
            <SimpleGrid cols={2}>
              {isActive ? (
                <>
                  <SimpleGrid>
                    <Box>
                      <Text>
                        There are {participants} eligible participants in this
                        vote.
                      </Text>
                      <Button
                        color={"red"}
                        m={matches ? 10 : 5}
                        onClick={() => deactivateVote(votation)}
                      >
                        Finish
                      </Button>
                    </Box>
                  </SimpleGrid>
                </>
              ) : (
                <Button
                  color={"green"}
                  disabled={votation.isFinished}
                  m={matches ? 10 : 5}
                  onClick={() => activateVote(votation)}
                >
                  Activate
                </Button>
              )}
              <SimpleGrid>
                <Box>
                  <Button
                    onClick={() => {
                      setEditable(true);
                    }}
                    w={matches ? "auto" : "30%"}
                    m={5}
                    color={"gray"}
                    disabled={votation.isFinished}
                  >
                    Edit
                  </Button>
                  <Button
                    w={matches ? "auto" : "60%"}
                    color={"red"}
                    m={matches ? 10 : 5}
                    onClick={() => deleteVote(votation)}
                  >
                    Delete
                  </Button>
                </Box>
              </SimpleGrid>
            </SimpleGrid>
          </Flex>
        </Accordion.Panel>
      )}
    </Accordion.Item>
  );
}

export default VotationPanel;
