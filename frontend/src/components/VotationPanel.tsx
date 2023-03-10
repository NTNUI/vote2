import {
  Accordion,
  Button,
  MultiSelect,
  TextInput,
  Text,
  Box,
  Flex,
  Loader,
  Container,
} from "@mantine/core";
import {
  activateVotation,
  deactivateVotation,
  deleteVotation,
  editVotation,
  getVotations,
} from "../services/votation";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useStyles } from "../styles/EditAssemblyStyles";
import { VoteType } from "../types/votes";

export interface VoteTypeExample {
  _id: string;
  title: string;
  voteText: string;
  voted: number[];
  options: OptionType[];
  isFinished: boolean;
  caseNumber: number;
  isEditable: boolean;
  isActive: boolean;
}

export type OptionType = {
  title: string;
  voteCount: number;
};

function VotationPanel({ groupSlug }: { groupSlug: string }) {
  const [editable, setEditable] = useState(false);
  const form = useForm<VoteType>();
  const { classes } = useStyles();
  const matches = useMediaQuery("(min-width: 400px)");
  const defaultOptions = ["Yes", "No", "Blank"];
  const [isActive, setIsActive] = useState(false);
  const [votations, setVotations] = useState<VoteType[]>();

  useEffect(() => {
    const getVotationsList = async () => {
      setVotations(await getVotations(groupSlug));
    };
    getVotationsList().catch(console.error);
  }, [votations]);

  function handleSubmit(vote: VoteType, votationId: string) {
    try {
      console.log("Vote: ", vote);
      editVotation(
        groupSlug,
        votationId,
        vote.title,
        vote.caseNumber,
        vote.voteText,
        vote.options
      );
      setEditable(false);
    } catch (error) {
      console.log(error);
    }
  }

  function activateVote(votation: VoteType) {
    try {
      activateVotation(groupSlug, votation._id);
      setIsActive(true);
    } catch (error) {
      console.log(error);
    }
  }

  function deactivateVote(votation: VoteType) {
    try {
      deactivateVotation(groupSlug, votation._id);
      setIsActive(false);
    } catch (error) {
      console.log(error);
    }
  }

  function deleteVote(votation: VoteType) {
    try {
      deleteVotation(groupSlug, votation._id);
    } catch (error) {
      console.log(error);
    }
  }

  return !votations || votations?.length == 0 ? (
    <Container>There are currently no cases for this assembly.</Container>
  ) : (
    <Accordion
      sx={(theme) => ({
        height: "fit-content",
        backgroundColor: theme.colors.ntnui_background[0],
        border: "solid",
        borderColor: theme.colors.ntnui_yellow[0],
        borderRadius: "5px",
        borderBottomRightRadius: "0px",
        borderBottomWidth: 0.5,
        maxWidth: 780,
      })}
    >
      {votations
        .sort((a: VoteType, b: VoteType) => {
          return a.caseNumber - b.caseNumber;
        })
        .map((votation: VoteType, index) => (
          <Accordion.Item
            key={index}
            value={String(index)}
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
                Case {votation.caseNumber} - {votation.title}
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
                  <TextInput
                    type="number"
                    required
                    withAsterisk
                    pattern="[0-9.0-9]*"
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
                    data={defaultOptions}
                    placeholder="Select items"
                    searchable
                    required
                    creatable
                    getCreateLabel={(query) => `+ Create ${query}`}
                    onCreate={(query) => {
                      const item = { value: query, label: query };
                      return item;
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
                  {isActive ? (
                    <Button
                      color={"red"}
                      m={matches ? 10 : 5}
                      onClick={() => deactivateVote(votation)}
                    >
                      Finish votation
                    </Button>
                  ) : (
                    <Button
                      color={"green"}
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
                </Flex>
              </Accordion.Panel>
            )}
          </Accordion.Item>
        ))}
    </Accordion>
  );
}

export default VotationPanel;
