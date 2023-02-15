import { Box, Button, Flex, SimpleGrid, Space } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGroups } from "../services/organizer";
import Arrow from "../assets/Arrow.svg";
import { useMediaQuery } from "@mantine/hooks";

interface GroupData {
  groupName: string;
  role: string;
  hasActiveAssembly: boolean;
}

export function OrganizerList() {
  const [organizedGroups, setOrganizedGroups] = useState<GroupData[]>([]);
  let navigate = useNavigate();
  const matches = useMediaQuery("(min-width: 600px)");

  function handleQRClick() {
    navigate("/QR");
  }

  function handleBreadcrumbClick() {
    navigate("/start");
  }

  function handleCreateAssemblyClick() {
    navigate("/assembly");
  }

  function createGroupBox(group: GroupData, index: number) {
    let groupName = group.groupName;
    groupName = groupName.charAt(0).toUpperCase() + groupName.slice(1);
    const startCheckinTestID: string = "checkin-button-" + group.groupName;
    const createAssemblyTestID: string =
      "create-assembly-button-" + group.groupName + "-" + index;
    const editAssemblyTestID: string =
      "edit-assembly-button-" + group.groupName;
    return (
      <>
        <Space h="xl" />

        <Box
          key={index}
          sx={(theme) => ({
            borderStyle: "solid",
            borderColor: "white",
            textAlign: "center",
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
            <h4 style={{ marginLeft: "2vw" }}>{groupName}</h4>
            {group.hasActiveAssembly ? (
              <div style={{ marginRight: "2vw" }}>
                <Button
                  color="green"
                  radius="md"
                  onClick={handleQRClick}
                  data-testid={startCheckinTestID}
                >
                  Start checkin
                </Button>
                <Button
                  color="gray"
                  radius="md"
                  onClick={handleCreateAssemblyClick}
                  data-testid={editAssemblyTestID}
                >
                  Edit
                </Button>
              </div>
            ) : (
              <Button
                style={{ marginRight: "2vw" }}
                onClick={handleCreateAssemblyClick}
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

  async function sortGroups() {
    try {
      const groupsRequest = await getGroups();
      const groups = groupsRequest.data.groups;
      for (let i = 0; i < groups.length; i++) {
        let group: GroupData = groups[i];
        if (group.role == "organizer") {
          setOrganizedGroups((organizedGroups) => [...organizedGroups, group]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    sortGroups();
  }, []);

  return (
    <>
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: 600, cols: 1, spacing: "sm" }]}
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
      {organizedGroups.map((group, index) => createGroupBox(group, index))}
    </>
  );
}
