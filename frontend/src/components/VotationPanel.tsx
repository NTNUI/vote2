import {
  Accordion,
  Button,
  MultiSelect,
  TextInput,
  Text,
  Box,
  Flex,
  NumberInput,
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
import { getNumberOfParticipantsInAssembly } from "../services/assembly";
import { showNotification } from "@mantine/notifications";

export interface CaseType {
  caseNumber: number;
  title: string;
  voteText: string;
  options: string[];
}

function VotationPanel({
  groupSlug,
  votation,
  isChanged,
  setIsChanged,
  assemblyStatus,
}: {
  groupSlug: string;
  votation: VoteType;
  isChanged: boolean;
  setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  assemblyStatus: boolean;
}) {
  const [editable, setEditable] = useState(false);
  const [isFinishChecked, setIsFinishChecked] = useState<boolean>(false);
  const [isEndChecked, setIsEndChecked] = useState<boolean>(false);

  const form = useForm<CaseType>({
    initialValues: {
      caseNumber: votation.caseNumber,
      title: votation.title,
      options: votation.options.map((option) => {
        return option.title;
      }),
      voteText: votation.voteText,
    },
  });
  const { classes } = useStyles();
  const matches = useMediaQuery("(min-width: 400px)");
  const participantMatch = useMediaQuery("(min-width: 500px)");
  const [defaultOptions] = useState<string[]>(["yes", "no", "blank"]);
  const [options, setOptions] = useState<string[]>(
    votation.options.map((option) => {
      return option.title;
    })
  );
  const [isActive, setIsActive] = useState(false);
  const [participants, setParticipants] = useState<number>();

  useEffect(() => {
    const fetch = async () => {
      const numberOfParticipants = await getNumberOfParticipantsInAssembly(
        groupSlug
      );
      setParticipants(numberOfParticipants);
    };

    fetch().catch(console.error);
  }, [isActive]);

  async function handleSubmit(vote: CaseType, votationId: string) {
    await editVotation(
      groupSlug,
      votationId,
      vote.title,
      vote.caseNumber,
      vote.voteText,
      vote.options.map((option) => {
        return option;
      })
    ).catch(console.error);
    setEditable(false);
    setIsChanged(!isChanged);
  }

  async function activateVote(votation: VoteType) {
    if (!votation.isFinished) {
      await activateVotation(groupSlug, votation._id).catch(console.error);
      setIsActive(true);
      setIsChanged(!isChanged);
      if (!assemblyStatus) {
        showNotification({ title: "Error", message: "Start assembly first" });
      }
    }
  }

  async function deactivateVote(votation: VoteType) {
    votation.isFinished = true;
    await deactivateVotation(groupSlug, votation._id).catch(console.error);
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
            onSubmit={form.onSubmit(
              (values) =>
                form.getInputProps("options").value.length > 0 &&
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
              data={options.length < 1 ? defaultOptions : options}
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
          <Flex
            style={{
              justifyContent: "space-between",
              flexDirection: "column",
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
            <Text
              fz={"sm"}
              style={{ minWidth: "fit-content", marginRight: "4px" }}
            >
              {participants} eligible participants
            </Text>
          </Flex>
          <Flex
            direction={matches ? "row" : "column"}
            justify={matches ? "space-between" : "center"}
          >
            {votation.isActive ? (
              <Button
                color={"red"}
                m={matches ? 10 : 5}
                onClick={
                  !isFinishChecked
                    ? () => setIsFinishChecked(true)
                    : () => deactivateVote(votation)
                }
              >
                {isFinishChecked ? (
                  <Text>Yes - Finish votation</Text>
                ) : (
                  <Text>Finish</Text>
                )}
              </Button>
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

            <Box>
              <Button
                onClick={() => {
                  setEditable(true);
                }}
                w={matches ? "auto" : "30%"}
                m={5}
                color={"gray"}
                disabled={votation.isFinished || votation.isActive}
              >
                Edit
              </Button>
              <Button
                w={matches ? "auto" : "60%"}
                color={"red"}
                m={matches ? 10 : 5}
                onClick={
                  !isEndChecked
                    ? () => setIsEndChecked(true)
                    : () => deleteVote(votation)
                }
              >
                {isEndChecked ? <Text>Yes - delete</Text> : <Text>Delete</Text>}
              </Button>
            </Box>
          </Flex>
        </Accordion.Panel>
      )}
    </Accordion.Item>
  );
}

export default VotationPanel;
