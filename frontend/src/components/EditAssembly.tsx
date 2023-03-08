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

export function EditAssembly(state: { group: UserDataGroupType }) {
  const [group, setGroup] = useState<UserDataGroupType>(state.group);
  const [cases, setCases] = useState<VoteType>({
    _id: "",
    caseNumber: 0.1,
    title: "placeholder",
    voteText: "",
    voted: [0],
    options: [],
    isFinished: true,
  });
  const [votations, setVotations] = useState<VoteType[]>([]);
  const [assembly, setAssembly] = useState<AssemblyType | undefined>();

  useEffect(() => {
    const fetch = async () => {
      const assemblyData = await getAssemblyByName(group.groupSlug);
      setAssembly(assemblyData);
    };
    const getVotation = async () => {
      const votation = await getVotations(group.groupSlug);
      setVotations(votation);
      console.log(votation);
    };
    fetch().catch(console.error);
    getVotation().catch(console.error);
  }, []);

  let navigate = useNavigate();

  function handleBreadcrumbGroupClick() {
    navigate("/start");
  }

  function handleBreadcrumbOrganizerClick() {
    navigate("/admin");
  }

  async function addCase() {
    const vote = await createVotation(
      "valgkomiteen",
      cases.title,
      cases.caseNumber,
      cases.voteText,
      cases.options
    );
    setVotations([...votations, vote]);
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

        <Accordion
          defaultValue={"vote1"}
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
          {votations ? (
            votations
              .sort((a: VoteType, b: VoteType) => {
                return a.caseNumber - b.caseNumber;
              })
              .map((item: VoteType) => (
                <VotationPanel
                  key={item._id}
                  votation={item}
                  index={item.caseNumber}
                  groupSlug={group.groupSlug}
                />
              ))
          ) : (
            <Loader />
          )}
        </Accordion>
      </SimpleGrid>
    </>
  );
}
