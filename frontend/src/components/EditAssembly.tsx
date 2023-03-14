import {
  Accordion,
  Box,
  Button,
  Container,
  Image,
  Loader,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Arrow from "../assets/Arrow.svg";
import { UserDataGroupType } from "../types/user";
import {
  activateAssembly,
  deleteAssembly,
  getAssemblyByName,
} from "../services/assembly";
import { createVotation, getVotations } from "../services/votation";
import { AssemblyType } from "../types/assembly";
import VotationPanel from "./VotationPanel";
import { VoteType } from "../types/votes";
import { AccordionItem } from "@mantine/core/lib/Accordion/AccordionItem/AccordionItem";

export function EditAssembly(state: { group: UserDataGroupType }) {
  const [group, setGroup] = useState<UserDataGroupType>(state.group);
  const [votations, setVotations] = useState<VoteType[]>([]);
  const [cases, setCases] = useState<VoteType>({
    _id: "",
    title: "placeholder",
    caseNumber: 0.1,
    voteText: "",
    voted: [0],
    options: [],
    isFinished: true,
  });
  const [assembly, setAssembly] = useState<AssemblyType | undefined>();
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const assemblyData = await getAssemblyByName(group.groupSlug);
      setAssembly(assemblyData);
    };

    fetch().catch(console.error);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const cases = await getVotations(group.groupSlug);
      setVotations(cases);
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

  async function addCase() {
    await createVotation(
      group.groupSlug,
      cases.title,
      cases.caseNumber,
      cases.voteText,
      cases.options
    );
    setIsChanged(!isChanged);
  }

  function endAssembly(groupSlug: string) {
    try {
      activateAssembly(groupSlug, false).then(() => {
        setGroup({ ...group, hasActiveAssembly: false });
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
          {group.hasActiveAssembly ? (
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
          {!group.hasActiveAssembly && (
            <Button
              color={"red"}
              onClick={() => handleDeleteAssemblyClick(group.groupSlug)}
              m={10}
            >
              Delete assembly
            </Button>
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
          >
            {votations
              .sort((a, b) => a.caseNumber - b.caseNumber)
              .map((vote: VoteType) => {
                return (
                  <VotationPanel
                    key={vote._id}
                    votation={vote}
                    groupSlug={group.groupSlug}
                    isChanged={isChanged}
                    setIsChanged={setIsChanged}
                  />
                );
              })}
          </Accordion>
        )}
      </SimpleGrid>
    </>
  );
}
