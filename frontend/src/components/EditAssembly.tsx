import { Accordion, Box, Button, Flex, Grid, Input, SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGroups } from "../services/organizer";
import Arrow from "../assets/Arrow.svg";

interface GroupData {
  groupName: string;
  role: string;
  hasActiveAssembly: boolean;
}

export function EditAssembly() {
  let navigate = useNavigate();

  function handleBreadcrumbGroupClick() {
    navigate("/start");
  }

  function handleBreadcrumbOrganizerClick() {
    navigate("/admin");
  }



  useEffect(() => {

  }, []);

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
          style={{ display: "flex", alignItems: "center", justifyContent:"center" }}
          data-testid="edit-assembly-page-title"
        >
          Edit assembly
        </h2>
        <div></div>
      </SimpleGrid>

      <SimpleGrid cols={2}>
        <div>
            <h3 style={{
                display:"flex",
                alignItems:"center",
                justifyContent:"center"
            }}>-group- Assembly</h3>
        </div>

        <div>
            <Accordion 
            defaultValue={"vote1"}
            styles={{
                item: {
                    backgroundColor:"white",
                    //#1A202C
                    border:"solid",
                    borderColor:"white",
                    borderRadius:"5px",
                },
            }}>
                <Accordion.Item value="vote1">
                    <Accordion.Control>Vote 1</Accordion.Control>
                    <Accordion.Panel>
                        <p style={{textAlign:"left"}}>Title</p>
                        <Input
                        placeholder="Title"
                        />
                        <p style={{textAlign:"left"}}>Description</p>
                        <Input
                        placeholder="Description"
                        />
                        <p style={{textAlign:"left"}}>Options</p>
                        <Input
                        placeholder="OPTION 1"
                        />
                        <Input
                        placeholder="OPTION 2"
                        />

                        <SimpleGrid cols={2}>
                            <Button>Add new option</Button>
                            <Button>Activate voting</Button>
                        </SimpleGrid>
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="vote2">
                    <Accordion.Control>Vote 2</Accordion.Control>
                    <Accordion.Panel>Vote vote vote</Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="vote3">
                    <Accordion.Control>Vote 3</Accordion.Control>
                    <Accordion.Panel>Vote vote vote</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </div>
      </SimpleGrid>
      
    </>

  );
}
