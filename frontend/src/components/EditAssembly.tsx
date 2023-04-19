import {
  Accordion,
  Box,
  Button,
  Container,
  Flex,
  Image,
  Loader,
  Modal,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Arrow from "../assets/Arrow.svg";
import { UserDataGroupType } from "../types/user";
import {
  activateAssembly,
  deleteAssembly,
  getAssemblyByName,
  getNumberOfParticipantsInAssembly,
} from "../services/assembly";
import { getVotations } from "../services/votation";
import { AssemblyType } from "../types/assembly";
import VotationPanel from "./VotationPanel";
import { VoteType } from "../types/votes";
import { Results } from "./Results";
import { IconRefresh } from "@tabler/icons-react";

export function EditAssembly(state: { group: UserDataGroupType }) {
  const [group, setGroup] = useState<UserDataGroupType>(state.group);
  const [votations, setVotations] = useState<VoteType[]>([]);
  const theme = useMantineTheme();
  const [startCase] = useState<VoteType>({
    _id: "",
    title: "placeholder",
    caseNumber: 0.1,
    voteText: "",
    voted: [],
    options: [],
    isFinished: true,
    isActive: false,
    numberParticipants: 0,
  });
  const [assembly, setAssembly] = useState<AssemblyType | undefined>();
  const [participants, setParticipants] = useState<number>();
  const [isChanged, setIsChanged] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [statusChanges, setStatusChanges] = useState(assembly?.isActive);
  const [loadParticipans, setParticipantsLoading] = useState(false);
  const [accordionActiveTabs, setAccordionActiveTabs] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const assemblyData = await getAssemblyByName(group.groupSlug);
      setAssembly(assemblyData);
      setParticipants(assemblyData.participants.length);
    };

    fetch().catch(console.error);
  }, [statusChanges]);

  useEffect(() => {
    const fetch = async () => {
      const votes = await getVotations(group.groupSlug);
      setVotations(votes);
    };

    fetch().catch(console.error);
  }, [isChanged]);

  let navigate = useNavigate();

  function handleBreadcrumbGroupClick() {
    navigate("/start");
  }

  function handleBreadcrumbOrganizerClick() {
    navigate("/admin");
  }

  async function refreshParticipants() {
    setParticipantsLoading(true);
    setParticipants(await getNumberOfParticipantsInAssembly(group.groupSlug));
    setParticipantsLoading(false);
  }

  async function addCase() {
    // Creates a temporary case to the votation list, this is not saved as a votation in the database before the required values are provided.
    // Only one element can exist at the same time, the user therefore has to finish editing the current temporary element before creating another one.
    if (!votations.some((votation) => votation._id == "temp")) {
      setAccordionActiveTabs([...accordionActiveTabs, "temp"]);
      setVotations([
        ...votations,
        {
          _id: "temp",
          title: "Placeholder",
          caseNumber: 0.1,
          voteText: "",
          voted: [],
          options: [],
          isFinished: false,
          isActive: false,
          numberParticipants: 0,
          editable: true,
        },
      ]);
    }
  }

  function endAssembly(groupSlug: string) {
    try {
      activateAssembly(groupSlug, false).then(() => {
        setGroup({ ...group, hasActiveAssembly: false });
        setStatusChanges(false);
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleDeleteAssemblyClick(groupSlug: string) {
    try {
      deleteAssembly(groupSlug).then(() => {
        navigate("/admin");
      });
    } catch (error) {
      console.log(error);
    }
  }

  function startAssembly(groupSlug: string) {
    try {
      activateAssembly(groupSlug, true).then(() => {
        setGroup({ ...group, hasActiveAssembly: true });
        setStatusChanges(true);
      });
    } catch (error) {
      console.log(error);
    }
  }

  return !assembly ? (
    <Loader />
  ) : (
    <>
      <Box
        style={{
          position: "absolute",
          top: 70,
          left: 30,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Text fz={"sm"} onClick={() => handleBreadcrumbGroupClick()}>
          GROUPS
        </Text>
        <Image width={15} m={10} src={Arrow}></Image>
        <Text
          fz={"sm"}
          fw={500}
          onClick={() => handleBreadcrumbOrganizerClick()}
        >
          ORGANIZER
        </Text>
        <Image width={15} m={10} src={Arrow}></Image>
        <Text fw={600} fz={"sm"}>
          CREATE/EDIT
        </Text>
      </Box>

      <SimpleGrid
        cols={2}
        breakpoints={[{ maxWidth: 800, cols: 1, spacing: "sm" }]}
        w={"80vw"}
        pt={120}
      >
        <Container
          sx={() => ({
            alignSelf: "center",
          })}
        >
          <Text fz={"xl"} fw={500}>
            EDIT {group.groupName.toUpperCase()} ASSEMBLY
          </Text>
          <Text>
            <Flex align={"center"} justify={"center"}>
              Currently {participants} participants
              <Box
                style={{
                  marginLeft: "4px",
                  cursor: "pointer",
                  position: "relative",
                  top: "3px",
                }}
                onClick={() => refreshParticipants()}
              >
                {!loadParticipans ? (
                  <IconRefresh height={20} width={20} />
                ) : (
                  <Loader height={20} width={20} />
                )}
              </Box>
            </Flex>
          </Text>
          {assembly.isActive ? (
            <Button
              color={"red"}
              onClick={() => endAssembly(group.groupSlug)}
              m={10}
            >
              Stop assembly
            </Button>
          ) : (
            <Button
              color={"green"}
              onClick={() => startAssembly(group.groupSlug)}
              m={10}
            >
              Start Assembly
            </Button>
          )}
          {!assembly.isActive && (
            <>
              <Button color={"red"} onClick={() => setOpenModal(true)} m={10}>
                Delete assembly
              </Button>
              <Modal
                opened={openModal}
                onClose={() => setOpenModal(false)}
                size="lg"
                centered
                withCloseButton={false}
                transition="fade"
                transitionDuration={200}
                exitTransitionDuration={200}
                // Styling is done like this to overwrite Mantine styling, therefore global color variables is not used.
                styles={{
                  modal: {
                    backgroundColor: "#1b202c",
                    color: "white",
                    border: ".5px solid",
                    borderRadius: 5,
                    borderBottomRightRadius: 0,
                    borderColor: "#f8f082",
                  },
                  title: {
                    margin: "0 auto",
                  },
                }}
              >
                <Text mb={5} fw={600} ta={"center"}>
                  Delete {group.groupName} assembly
                </Text>
                <Text ta={"center"}>
                  Are you sure you want to delete this assembly?
                </Text>
                <Text ta={"center"}>All data will be lost!</Text>
                <Container
                  sx={(theme) => ({
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  })}
                >
                  <Button
                    onClick={() => handleDeleteAssemblyClick(group.groupSlug)}
                    color="red"
                    mt="md"
                  >
                    Delete
                  </Button>
                  <Button mt="md" onClick={() => setOpenModal(false)}>
                    Cancel
                  </Button>
                </Container>
              </Modal>
            </>
          )}

          <Button onClick={addCase} m={10}>
            Add case
          </Button>
        </Container>
        {votations.length < 1 ? (
          <Text>There are currently no cases</Text>
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
            multiple
            value={accordionActiveTabs}
            onChange={setAccordionActiveTabs}
          >
            {votations
              .sort((a, b) => a.caseNumber - b.caseNumber)
              .map((vote: VoteType) => {
                return vote.isFinished ? (
                  <Results key={vote._id} votation={vote} />
                ) : (
                  <VotationPanel
                    // Passing accordionActiveTabs to VotationPanel so it can provide it's ID to remain open when vote is submitted.
                    accordionActiveTabs={accordionActiveTabs}
                    setAccordionActiveTabs={(tabs: string[]) =>
                      setAccordionActiveTabs(tabs)
                    }
                    key={vote._id}
                    votation={vote}
                    groupSlug={group.groupSlug}
                    isChanged={isChanged}
                    setIsChanged={setIsChanged}
                    assemblyStatus={assembly.isActive}
                    initEditable={vote.editable || false}
                  />
                );
              })}
          </Accordion>
        )}
      </SimpleGrid>
    </>
  );
}
