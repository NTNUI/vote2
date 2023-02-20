import { Box, Button, Flex, SimpleGrid, Space } from "@mantine/core";
import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../services/organizer";
import Arrow from "../assets/Arrow.svg";
import { useMediaQuery } from "@mantine/hooks";
import { UserDataGroupType } from "../types/user";
import { createAssembly } from "../services/assembly";
//import {createAssembly, activateAssembly, deleteAssembly} from "../services/assembly";

export function OrganizerList() {
  const [organizerGroups, setOrganizerGroups] = useState<UserDataGroupType[]>(
    []
  );
  let navigate = useNavigate();
  const matches = useMediaQuery("(min-width: 600px)");

  function handleQRClick() {
    navigate("/QR");
  }

  function handleBreadcrumbClick() {
    navigate("/start");
  }

  function handleCreateAssemblyClick(group: UserDataGroupType) {
    try {
      createAssembly(group.groupName).then(() => {
        navigate("/assembly", { state: { group: group } });
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleEditAssemblyClick(group: UserDataGroupType) {
    navigate("/assembly", { state: { group: group } });
  }

  function createGroupBox(group: UserDataGroupType, index: number) {
    const startCheckinTestID: string = "checkin-button-" + group.groupName;
    const createAssemblyTestID: string =
      "create-assembly-button-" + group.groupName + "-" + index;
    const editAssemblyTestID: string =
      "edit-assembly-button-" + group.groupName;
    return (
      <>
        <Space h="sm" />
        <Box
          key={index}
          sx={(theme) => ({
            borderStyle: "solid",
            borderColor: "#FAF089",
            borderWidth: "0.01rem",
            textAlign: "center",
            marginLeft: "1rem",
            marginRight: "1rem",
            borderRadius: theme.radius.md,
            color: "white",
          })}
        >
          <Flex
            mih={50}
            gap="xl"
            justify="space-between"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <h4 style={{ marginLeft: "2vw" }}>
              {group.groupName.toUpperCase()}
            </h4>
            {group.hasActiveAssembly ? (
              <Box>
                <Button
                  style={{ marginRight: "2vw" }}
                  color="green"
                  radius="md"
                  onClick={handleQRClick}
                  data-testid={startCheckinTestID}
                >
                  Start check-in
                </Button>
                <Button
                  style={{ marginRight: "2vw" }}
                  color="gray"
                  radius="md"
                  onClick={(e) => handleEditAssemblyClick(group)}
                  data-testid={editAssemblyTestID}
                >
                  Edit
                </Button>
              </Box>
            ) : group.hasAssembly ? (
              <Button
                style={{ marginRight: "2vw" }}
                color="gray"
                radius="md"
                onClick={(e) => handleEditAssemblyClick(group)}
                data-testid={editAssemblyTestID}
              >
                Edit
              </Button>
            ) : (
              <Button
                style={{ marginRight: "2vw" }}
                onClick={() => handleCreateAssemblyClick(group)}
                data-testid={createAssemblyTestID}
              >
                Create assembly
              </Button>
            )}
          </Flex>
        </Box>
      </>
    );
  }

  async function fetchGroups() {
    try {
      const groups = (await getUserData()).groups;
      setOrganizerGroups(
        groups.filter((group) => {
          return group.role == "organizer";
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: 600, cols: 1, spacing: "sm" }]}
        style={{ marginTop: "10vh" }}
        {...(!matches && { style: { width: "100vw" } })}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <p
            style={{ display: "inline", cursor: "pointer" }}
            onClick={handleBreadcrumbClick}
          >
            GROUPS{" "}
          </p>
          <img src={Arrow}></img>
          <p style={{ display: "inline", fontWeight: "bold" }}> ORGANIZER</p>
        </div>
        <h2
          style={{ display: "flex", alignItems: "center" }}
          data-testid="organizer-list-page-title"
          {...(!matches && { style: { textAlign: "center" } })}
        >
          Manage group assemblies
        </h2>
        <div></div>
      </SimpleGrid>
      {organizerGroups.map((group, index) => createGroupBox(group, index))}
    </>
  );
}
function then(arg0: () => void) {
  throw new Error("Function not implemented.");
}
