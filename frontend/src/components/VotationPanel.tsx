import {
  Accordion,
  Button,
  MultiSelect,
  TextInput,
  Text,
  Box,
  Flex,
  NumberInput,
  Menu,
  rem,
  ComboboxItem,
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
import { styles } from "../styles/EditAssemblyStyles";
import { VoteType } from "../types/votes";
import { getNumberOfParticipantsInAssembly } from "../services/assembly";
import { notifications } from "@mantine/notifications";
import { getGroups } from "../services/groups";

export interface CaseType {
  caseNumber: number;
  title: string;
  voteText: string;
  options: string[];
  maximumOptions: number;
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
      maximumOptions: votation.maximumOptions,
      voteText: votation.voteText,
      isActive: votation.isActive,
      numberParticipants: votation.numberParticipants,
    },
  });

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
        }),
        vote.maximumOptions
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

  const handleImportGroupOptions = async (category: string) => {
    const groups = await getGroups(category);
    if (Array.isArray(groups)) {
      const groupNames = groups.map((group) => group.name);

      const newGroupNames = groupNames.filter(
        (name) => !options.includes(name)
      );
      setOptions([...options, ...newGroupNames]);

      form.setFieldValue("options", [...form.values.options, ...newGroupNames]);
    }
  };

  async function activateVote(votation: VoteType) {
    if (!votation.isFinished) {
      await activateVotation(
        groupSlug,
        votation._id,
        await getNumberOfParticipantsInAssembly(groupSlug)
      ).catch(function (error) {
        if (error) {
          console.error(error);
          notifications.show({
            title: "Error",
            message: error.response.data.message,
            color: "red",
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
      notifications.show({
        title: "Error",
        message: error.response.data.message,
        color: "red",
      });
    });
    setIsChanged(!isChanged);
  }

  return (
    <Accordion.Item
      key={votation._id}
      value={String(votation._id)}
      styles={{
        item: {
          borderColor: "var(--mantine-color-ntnui-yellow-0)",
          borderBottomLeftRadius: rem(2),
        },
      }}
    >
      <Accordion.Control
        styles={{
          control: {
            color: "white",
            "&:hover": {
              backgroundColor: "var(--mantine-color-ntnui-background-0)",
            },
          },
        }}
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
          styles={{
            content: {
              color: "white",
            },
          }}
        >
          <Box
            component="form"
            onSubmit={form.onSubmit((values) => {
              if (form.getInputProps("options").value.length > 0) {
                handleSubmit(values, votation._id);
              }
            })}
          >
            <NumberInput
              data-testid="caseNumberInput"
              hideControls
              min={0}
              step={0.01}
              required
              withAsterisk
              label="Case number"
              styles={{ root: styles.inputStyle }}
              placeholder="Case number"
              {...form.getInputProps("caseNumber")}
            />
            <TextInput
              data-testid="titleInput"
              withAsterisk
              required
              label="Title"
              styles={{ root: styles.inputStyle }}
              placeholder="Title"
              {...form.getInputProps("title")}
            />
            <TextInput
              data-testid="descriptionEdit"
              label="Description"
              styles={{ root: styles.inputStyle }}
              placeholder="Description"
              {...form.getInputProps("voteText")}
            />
            <MultiSelect
              data-testid="multiselectOptions"
              label="Options"
              styles={{ root: styles.inputStyle }}
              data={[...new Set(options.concat(defaultOptions))].map((option) => ({
                value: option,
                label: option,
              }))}
              placeholder="Select items"
              searchable
              required
              comboboxProps={{
                onOptionSubmit: (val: string) => {
                  const item = { value: val, label: val };
                  setOptions([...options, val]);
                  const currentValues = form.getInputProps("options").value || [];
                  form.setFieldValue("options", [...currentValues, val]);
                },
              }}
              {...form.getInputProps("options")}
            />
            <Menu>
              <Menu.Target>
                <Button
                  variant="filled"
                  mt="md"
                  styles={{
                    root: {
                      backgroundColor: "var(--mantine-color-ntnui-blue-0)",
                      "&:hover": {
                        backgroundColor: "var(--mantine-color-ntnui-blue-1)",
                      },
                    },
                  }}
                >
                  Import group options
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => handleImportGroupOptions("groups")}>
                  Groups
                </Menu.Item>
                <Menu.Item onClick={() => handleImportGroupOptions("sports")}>
                  Sports
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Flex gap="md" mt="md">
              <Button
                type="submit"
                variant="filled"
                styles={{
                  root: {
                    backgroundColor: "var(--mantine-color-ntnui-blue-0)",
                    "&:hover": {
                      backgroundColor: "var(--mantine-color-ntnui-blue-1)",
                    },
                  },
                }}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setEditable(false);
                  if (initEditable) {
                    deleteVote(votation);
                  }
                }}
                variant="filled"
                styles={{
                  root: {
                    backgroundColor: "var(--mantine-color-ntnui-red-0)",
                    "&:hover": {
                      backgroundColor: "var(--mantine-color-ntnui-red-1)",
                    },
                  },
                }}
              >
                Cancel
              </Button>
            </Flex>
          </Box>
        </Accordion.Panel>
      ) : (
        <Accordion.Panel
          styles={{
            content: {
              color: "white",
            },
          }}
        >
          <Text size="sm" mb="xs">
            {votation.voteText}
          </Text>
          <Flex gap="md">
            {!votation.isActive && !votation.isFinished && (
              <Button
                onClick={() => activateVote(votation)}
                variant="filled"
                styles={{
                  root: {
                    backgroundColor: "var(--mantine-color-ntnui-blue-0)",
                    "&:hover": {
                      backgroundColor: "var(--mantine-color-ntnui-blue-1)",
                    },
                  },
                }}
              >
                Activate
              </Button>
            )}
            {votation.isActive && !votation.isFinished && (
              <Button
                onClick={() => deactivateVote(votation)}
                variant="filled"
                styles={{
                  root: {
                    backgroundColor: "var(--mantine-color-ntnui-red-0)",
                    "&:hover": {
                      backgroundColor: "var(--mantine-color-ntnui-red-1)",
                    },
                  },
                }}
              >
                Deactivate
              </Button>
            )}
            {!votation.isActive && !votation.isFinished && (
              <Button
                onClick={() => setEditable(true)}
                variant="filled"
                styles={{
                  root: {
                    backgroundColor: "var(--mantine-color-ntnui-yellow-0)",
                    "&:hover": {
                      backgroundColor: "var(--mantine-color-ntnui-yellow-1)",
                    },
                  },
                }}
              >
                Edit
              </Button>
            )}
            {!votation.isActive && !votation.isFinished && (
              <Button
                onClick={() => deleteVote(votation)}
                variant="filled"
                styles={{
                  root: {
                    backgroundColor: "var(--mantine-color-ntnui-red-0)",
                    "&:hover": {
                      backgroundColor: "var(--mantine-color-ntnui-red-1)",
                    },
                  },
                }}
              >
                Delete
              </Button>
            )}
          </Flex>
        </Accordion.Panel>
      )}
    </Accordion.Item>
  );
}

export default VotationPanel;
