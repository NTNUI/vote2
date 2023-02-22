import { Box, Button, Flex, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { createAssembly } from "../services/assembly";
import { UserDataGroupType } from "../types/user";

export function OrganizerGroupBox(props: {
  group: UserDataGroupType;
  index: number;
}) {
  let navigate = useNavigate();
  const breakMedium = useMediaQuery("(min-width: 601px)");
  const breakSmall = useMediaQuery("(min-width: 546px)");
  const breakMini = useMediaQuery("(min-width: 390px)");

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

  function truncateText(): string {
    if (breakMedium) {
      return "300px";
    } else if (breakSmall) {
      return "150px";
    } else if (breakMini) {
      return "100px";
    } else {
      return "70px";
    }
  }

  return (
    <>
      <Space h="sm" />
      <Box
        sx={(theme) => ({
          borderStyle: "solid",
          borderColor: theme.colors.ntnui_yellow[0],
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
          {...(!breakSmall
            ? { justify: "center" }
            : { justify: "space-between" })}
          align="center"
          direction="row"
          wrap="wrap"
          sx={{ padding: "1vw" }}
        >
          <Box
            style={{
              width: truncateText(),
              marginLeft: "2vw",
              textAlign: "left",
            }}
          >
            <Text lineClamp={2} {...(breakSmall ? { fz: "lg" } : { fz: "sm" })}>
              {props.group.groupName.toUpperCase()}
            </Text>
          </Box>
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
