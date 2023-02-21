import {
  Accordion,
  Button,
  Container,
  MultiSelect,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Arrow from "../assets/Arrow.svg";
import { useForm } from "@mantine/form";
import { UserDataGroupType } from "../types/user";
import { activateAssembly, deleteAssembly } from "../services/assembly";

interface VoteDetails {
  title: string;
  description: string;
  options: string[];
  editable: boolean;
}

const defaultOptions: string[] = ["Yes", "No", "Blank"];

export function EditAssembly(state: { group: UserDataGroupType }) {
  const [group, setGroup] = useState<UserDataGroupType>(state.group);
  const [cases, setCases] = useState<VoteDetails[]>([]);

  useEffect(() => {
    //Need endpoint to fetch a single group
  }, []);

  const form = useForm<VoteDetails>();
  let navigate = useNavigate();

  useEffect(() => {
    console.log("Fetches data");
    const exampleCase: VoteDetails = {
      title: "Test",
      description: "Used for testing",
      options: ["Yes", "No", "NEVER"],
      editable: false,
    };
    setCases((cases) => [...cases, exampleCase]);
  }, []);

  function handleBreadcrumbGroupClick() {
    navigate("/start");
  }

  function handleBreadcrumbOrganizerClick() {
    navigate("/admin");
  }

  function addCase() {
    console.log("Add!");
    setCases((cases) => [
      ...cases,
      { title: "", description: "", options: [], editable: true },
    ]);
    console.log(cases);
  }

  function endAssembly(groupName: string) {
    try {
      activateAssembly(groupName, false).then(() => {
        setGroup({ ...group, hasActiveAssembly: false });
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleDeleteAssemblyClick(groupName: string) {
    try {
      deleteAssembly(groupName).then(() => {
        navigate("/admin");
      });
    } catch (error) {
      console.log(error);
    }
  }

  function startAssembly(groupName: string) {
    try {
      activateAssembly(groupName, true).then(() => {
        setGroup({ ...group, hasActiveAssembly: true });
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleSubmit(values: VoteDetails, index: number) {
    let newCases: VoteDetails[] = cases;
    newCases[index] = values;
    setCases(newCases);
  }

  function setEditable(item: VoteDetails, index: number, conditon: boolean) {
    let newCases: VoteDetails[] = cases;
    item.editable = conditon;
    newCases[index] = item;
    console.log("Edits.");
    setCases(newCases);
    console.log(cases);
  }

  return (
    <>
      {/* <SimpleGrid cols={3}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p
            style={{ display: "inline", cursor: "pointer" }}
            onClick={handleBreadcrumbGroupClick}
          >
            GROUPS{" "}
          </p>
          <img src={Arrow}></img>
          <p
            style={{ display: "inline", cursor: "pointer" }}
            onClick={handleBreadcrumbOrganizerClick}
          >
            ORGANIZER
          </p>
          <img src={Arrow}></img>
          <p style={{ display: "inline", fontWeight: "bold" }}>CREATE/EDIT</p>
        </div>

        <h2
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          data-testid="edit-assembly-page-title"
        >
          Edit {group.groupName} assembly
        </h2>
        <div></div>
      </SimpleGrid> */}

      <SimpleGrid
        cols={2}
        breakpoints={[{ maxWidth: 770, cols: 1, spacing: "sm" }]}
        w={"80vw"}
      >
        <Container>
          <h4>EDIT {group.groupName.toUpperCase()} ASSEMBLY</h4>
          {group.hasActiveAssembly ? (
            <Button
              color={"red"}
              onClick={() => endAssembly(group.groupName)}
              m={10}
            >
              Stop assembly
            </Button>
          ) : (
            <Button
              color={"green"}
              onClick={() => startAssembly(group.groupName)}
              m={10}
            >
              Start Assembly
            </Button>
          )}
          {!group.hasActiveAssembly && (
            <Button
              color={"red"}
              onClick={() => handleDeleteAssemblyClick(group.groupName)}
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
          styles={{
            item: {
              backgroundColor: "white",
              //#1A202C
              border: "solid",
              borderColor: "white",
              borderRadius: "5px",
              maxWidth: 780,
            },
          }}
        >
          {cases.map((item, index) => (
            <Accordion.Item value={String(index)}>
              <Accordion.Control>Vote {index + 1}</Accordion.Control>
              {!item.title || item.editable ? (
                <Accordion.Panel>
                  <form
                    onSubmit={form.onSubmit((values) =>
                      handleSubmit(values, index)
                    )}
                  >
                    <TextInput
                      withAsterisk
                      label="Title"
                      placeholder="title"
                      {...form.getInputProps("title")}
                    />

                    <TextInput
                      withAsterisk
                      label="Description"
                      placeholder="description"
                      {...form.getInputProps("description")}
                    />

                    <MultiSelect
                      label="Creatable MultiSelect"
                      data={defaultOptions}
                      placeholder="Select items"
                      searchable
                      creatable
                      getCreateLabel={(query) => `+ Create ${query}`}
                      onCreate={(query) => {
                        const item = { value: query, label: query };
                        //setData((current) => [...current, item]);
                        return item;
                      }}
                      {...form.getInputProps("options")}
                    />
                    <Button type="submit">Save current vote</Button>
                  </form>
                </Accordion.Panel>
              ) : (
                <Accordion.Panel>
                  <p>{item.title}</p>
                  <p>{item.description}</p>
                  <p>{item.options}</p>
                  <Button
                    onClick={() => {
                      setEditable(item, index, true);
                    }}
                    m={5}
                  >
                    Edit current vote
                  </Button>
                  <Button m={5}>Activate voting</Button>
                  <Button m={5}>Delete voting</Button>
                </Accordion.Panel>
              )}
            </Accordion.Item>
          ))}
        </Accordion>
      </SimpleGrid>
    </>
  );
}
