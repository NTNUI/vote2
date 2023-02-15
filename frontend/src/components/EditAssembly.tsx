import { Accordion, Box, Button, Flex, Grid, Input, MultiSelect, SimpleGrid, TextInput, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Arrow from "../assets/Arrow.svg";
import { useForm } from "@mantine/form";

interface VoteDetails {
  title: string;
  description: string;
  options: string[];
  editable: boolean;
}

const defaultOptions: string[] = ["Yes", "No", "Blank"];

export function EditAssembly() {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [cases, setCases] = useState<VoteDetails[]>([]);
  
  const form = useForm<VoteDetails>();
  let navigate = useNavigate();

  useEffect(() => {
    console.log("Fetches data");
    const exampleCase: VoteDetails = {
      title: "Test",
      description: "Used for testing",
      options: ["Yes", "No", "NEVER"],
      editable: false,
    }
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
    setCases((cases) => [...cases, {title:"",description:"",options:[], editable:true}]);
    console.log(cases);
  }

  function endAssembly() {
    console.log("Stop!");
    setIsActive(false);
  }

  function startAssembly() {
    console.log("Start!");
    setIsActive(true);
  }

  function handleSubmit(values: VoteDetails, index: number) {
    let newCases:VoteDetails[] = cases;
    newCases[index] = values;
    setCases(newCases);
  }

  function setEditable(item: VoteDetails, index: number, conditon: boolean) {
    let newCases:VoteDetails[] = cases;
    item.editable = conditon;
    newCases[index] = item;
    console.log("Edits.")
    setCases(newCases);
    console.log(cases);
  }

  return (
    <>
      <SimpleGrid cols={3}>
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
          <p
            style={{ display: "inline", fontWeight: "bold" }}>
            CREATE/EDIT
          </p>
        </div>

        <h2
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          data-testid="edit-assembly-page-title"
        >
          Edit assembly
        </h2>
        <div></div>
      </SimpleGrid>

      <SimpleGrid cols={2}>
        <div>
          <h3 style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>-group- Assembly</h3>
          <Button color={"green"} onClick={startAssembly} disabled={isActive}>Start Assembly</Button>
          <Button color={"red"} onClick={endAssembly} disabled={!isActive}>End assembly</Button>
          <Button onClick={addCase}>Add case</Button>
        </div>

        <div>
          <Accordion
            defaultValue={"vote1"}
            styles={{
              item: {
                backgroundColor: "white",
                //#1A202C
                border: "solid",
                borderColor: "white",
                borderRadius: "5px",
              },
            }}>
            {cases.map((item, index) => (
            
              <Accordion.Item value={String(index)}>
                <Accordion.Control>Vote {index+1}</Accordion.Control>
                {!item.title || item.editable ? 
                <Accordion.Panel>
                  <form onSubmit={form.onSubmit((values) => handleSubmit(values,index))}>
                  <TextInput
                    withAsterisk
                    label="Title"
                    placeholder="title"
                    {...form.getInputProps('title')}
                  />

                  <TextInput
                    withAsterisk
                    label="Description"
                    placeholder="description"
                    {...form.getInputProps('description')}
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
                    {...form.getInputProps('options')}
                  />
                  <Button type="submit" >Save current vote</Button>
                  </form>
                </Accordion.Panel> 
                : 
                <Accordion.Panel>
                  <p>{item.title}</p>
                  <p>{item.description}</p>
                  <p>{item.options}</p>
                  <Button onClick={() => {setEditable(item, index, true)}}>Edit current vote</Button>
                  <Button>Activate voting</Button>
                  <Button>Delete voting</Button>
                </Accordion.Panel> }
              </Accordion.Item> 
              
            ))}

          </Accordion>
        </div>
      </SimpleGrid>
    </>
  );
};
