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
import { useEffect, useState } from "react";
import { useStyles } from "../styles/EditAssemblyStyles";
import { VoteType } from "../types/votes";
import { render } from "react-dom";

function VotationPanel({
  votation,
  index,
  groupSlug,
}: {
  votation: VoteType;
  index: number;
  groupSlug: string;
}) {
  const [editable, setEditable] = useState(false);
  const form = useForm<VoteType>();
  const { classes } = useStyles();
  const matches = useMediaQuery("(min-width: 400px)");
  const defaultOptions = ["Yes", "No", "Blank"];
  const [isActive, setIsActive] = useState(false);

  function handleSubmit(vote: VoteType) {
    try {
      editVotation(
        groupSlug,
        votation._id,
        vote.title,
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
  useEffect(() => {}, [
    editable,
    handleSubmit,
    activateVote,
    deactivateVote,
    deleteVote,
  ]);

  return (
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
          Case {index.toPrecision(2)} - {votation.title}
        </Text>
      </Accordion.Control>
      {editable ? (
        <Accordion.Panel
          sx={() => ({
            color: "white",
          })}
        >
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <TextInput
              type="number"
              withAsterisk
              pattern="[0-9]*"
              label="Case number"
              className={classes.inputStyle}
              placeholder="Case number"
              {...form.getInputProps("caseNumber")}
            />
            <TextInput
              withAsterisk
              label="Title"
              className={classes.inputStyle}
              placeholder="Title"
              {...form.getInputProps("title")}
            />
            <TextInput
              withAsterisk
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
                color={"green"}
                m={matches ? 10 : 5}
                onClick={() => deactivateVote(votation)}
              >
                Deactivate
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
  );
}

export default VotationPanel;
