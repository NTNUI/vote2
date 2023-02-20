import { Box, Button, Flex, Space } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { createAssembly } from "../services/assembly";
import { UserDataGroupType } from "../types/user";

export function OrganizerGroupBox(props: {
  group: UserDataGroupType;
  index: number;
}) {
  let navigate = useNavigate();

  const startCheckinTestID: string = "checkin-button-" + props.group.groupName;
  const createAssemblyTestID: string =
    "create-assembly-button-" + props.group.groupName + "-" + props.index;
  const editAssemblyTestID: string =
    "edit-assembly-button-" + props.group.groupName;

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

  return (
    <>
      <Space h="sm" />
      <Box
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
            {props.group.groupName.toUpperCase()}
          </h4>
          {props.group.hasActiveAssembly ? (
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
                onClick={() => handleEditAssemblyClick(props.group)}
                data-testid={editAssemblyTestID}
              >
                Edit
              </Button>
            </Box>
          ) : props.group.hasAssembly ? (
            <Button
              style={{ marginRight: "2vw" }}
              color="gray"
              radius="md"
              onClick={() => handleEditAssemblyClick(props.group)}
              data-testid={editAssemblyTestID}
            >
              Edit
            </Button>
          ) : (
            <Button
              style={{ marginRight: "2vw" }}
              onClick={() => handleCreateAssemblyClick(props.group)}
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
