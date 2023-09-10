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
  createVotation,
  deactivateVotation,
  deleteVotation,
  editVotation,
} from "../services/votation";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { useStyles } from "../styles/EditAssemblyStyles";
import { VoteType } from "../types/votes";
import { getNumberOfParticipantsInAssembly } from "../services/assembly";
import { showNotification } from "@mantine/notifications";

export interface CaseType {
  caseNumber: number;
  title: string;
  voteText: string;
  options: string[];
  isActive: boolean;
  numberParticipants: number;
}

function VotationPanel({
  accordionActiveTabs,
  setAccordionActiveTabs,
  groupSlug,
  votation,
  isChanged,
  setIsChanged,
  assemblyStatus,
  initEditable,
  addCase,
}: {
  accordionActiveTabs: string[];
  setAccordionActiveTabs: (tabs: string[]) => void;
  groupSlug: string;
  votation: VoteType;
  isChanged: boolean;
  setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  assemblyStatus: boolean;
  initEditable: boolean;
  addCase: (votation: VoteType) => void;
}) {
  const [editable, setEditable] = useState(initEditable);
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
      isActive: votation.isActive,
      numberParticipants: votation.numberParticipants,
    },
  });
  const { classes } = useStyles();
  const matches = useMediaQuery("(min-width: 400px)");
  const [defaultOptions] = useState<string[]>(["Yes", "No", "Blank"]);
  const [options, setOptions] = useState<string[]>(
    votation.options.map((option) => {
      return option.title;
    })
  );

  async function handleSubmit(vote: CaseType, votationId: string) {
    if (initEditable) {
      const createdVotation = await createVotation(
        groupSlug,
        vote.title,
        vote.caseNumber,
        vote.voteText,
        vote.options.map((option) => {
          return option;
        })
      );
      setAccordionActiveTabs([...accordionActiveTabs, createdVotation.vote_id]);
    } else {
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
    }
    setEditable(false);
    setIsChanged(!isChanged);
  }

  async function activateVote(votation: VoteType) {
    if (!votation.isFinished) {
      await activateVotation(
        groupSlug,
        votation._id,
        await getNumberOfParticipantsInAssembly(groupSlug)
      ).catch(function (error) {
        if (error) {
          console.error(error);
          showNotification({
            title: "Error",
            message: error.response.data.message,
          });
        }
      });
      setIsChanged(!isChanged);
    }
  }

  async function deactivateVote(votation: VoteType) {
    votation.isFinished = true;
    await deactivateVotation(groupSlug, votation._id).catch(console.error);
    setIsChanged(!isChanged);
  }

  async function deleteVote(votation: VoteType) {
    await deleteVotation(groupSlug, votation._id).catch(function (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: error.response.data.message,
      });
    });
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
              data-testid="caseNumberInput"
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
              data-testid="titleInput"
              withAsterisk
              required
              label="Title"
              className={classes.inputStyle}
              placeholder="Title"
              {...form.getInputProps("title")}
            />
            <TextInput
              data-testid="descriptionEdit"
              withAsterisk
              required
              label="Description"
              className={classes.inputStyle}
              placeholder="Description"
              {...form.getInputProps("voteText")}
            />
            <MultiSelect
              data-testid="multiselectOptions"
              label="Options"
              className={classes.inputStyle}
              data={[...new Set(options.concat(defaultOptions))]}
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

            <Button type="submit" mt={10} data-testid="submitButton">
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
              <Text data-testid="title-field">{votation.title}</Text>
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
                m={5}
                ml={10}
                onClick={() => {
                  activateVote(votation);
                  setIsEndChecked(false);
                }}
              >
                Activate
              </Button>
            )}

            <Box>
              <Button
                onClick={() => {
                  setEditable(true);
                }}
                m={5}
                disabled={votation.isFinished || votation.isActive}
                data-testid="edit-case-button"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  addCase(votation);
                }}
                m={5}
                disabled={votation.isFinished || votation.isActive}
                data-testid="edit-case-button"
              >
                Duplicate
              </Button>
              <Button
                color={"red"}
                m={5}
                disabled={votation.isFinished || votation.isActive}
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
