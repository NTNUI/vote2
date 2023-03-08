import {
  Accordion,
  Button,
  MultiSelect,
  TextInput,
  Text,
  Box,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { useStyles } from "../styles/EditAssemblyStyles";
import { VoteType } from "../types/votes";

function VotationPanel({
  votation,
  index,
}: {
  votation: VoteType;
  index: number;
}) {
  const [editable, setEditable] = useState(false);
  const form = useForm<VoteType>();
  const { classes } = useStyles();
  const matches = useMediaQuery("(min-width: 400px)");
  const defaultOptions = ["Yes", "No", "Blank"];

  function handleSubmit() {}

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
      {!votation.title || editable ? (
        <Accordion.Panel
          sx={() => ({
            color: "white",
          })}
        >
          <form onSubmit={form.onSubmit((values) => handleSubmit())}>
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
              {...form.getInputProps("description")}
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
            <Button color={"green"} m={matches ? 10 : 5}>
              Activate
            </Button>
            <Box>
              <Button
                onClick={() => {
                  setEditable(!editable);
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
