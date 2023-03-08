import { Box, Button, Flex, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { createAssembly } from "../services/assembly";
import { useStyles } from "../styles/OrganizerGroupBoxStyles";
import { UserDataGroupType } from "../types/user";

export function OrganizerGroupBox({
  group,
  index,
}: {
  group: UserDataGroupType;
  index: number;
}) {
  let navigate = useNavigate();
  const breakMedium = useMediaQuery("(min-width: 660px)");
  const breakSmall = useMediaQuery("(min-width: 546px)");
  const breakMini = useMediaQuery("(min-width: 390px)");
  const { classes } = useStyles();

  const startCheckinTestID: string = "checkin-button-" + group.groupSlug;
  const createAssemblyTestID: string =
    "create-assembly-button-" + group.groupSlug + "-" + index;
  const editAssemblyTestID: string = "edit-assembly-button-" + group.groupSlug;

  function handleQRClick() {
    navigate("/QR");
  }

  function handleCreateAssemblyClick(group: UserDataGroupType) {
    try {
      createAssembly(group.groupSlug).then(() => {
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
      return "350px";
    } else if (breakSmall) {
      return "200px";
    } else if (breakMini) {
      return "150px";
    } else {
      return "100px";
    }
  }

  return (
    <>
      <Space h="sm" />
      <Box
        sx={(theme) => ({
          borderStyle: "solid",
          borderColor: theme.colors.ntnui_yellow[0],
          backgroundColor: theme.colors.ntnui_background[0],
          borderWidth: "0.01rem",
          textAlign: "center",
          marginLeft: "1rem",
          marginRight: "1rem",
          borderRadius: theme.radius.md,
          borderBottomRightRadius: 0,
          color: "white",
        })}
      >
        <Flex
          mih={50}
          gap="xl"
          justify={"space-between"}
          align="center"
          direction="row"
          wrap="nowrap"
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
              {group.groupName}
            </Text>
          </Box>
          {group.hasActiveAssembly ? (
            <Flex wrap={"nowrap"}>
              <Button
                className={
                  breakMedium ? classes.buttonStyle : classes.smallButtonStyle
                }
                color="green"
                onClick={handleQRClick}
                data-testid={startCheckinTestID}
              >
                Start check-in
              </Button>
              <Button
                className={
                  breakMedium ? classes.buttonStyle : classes.smallButtonStyle
                }
                color="gray"
                onClick={() => handleEditAssemblyClick(group)}
                data-testid={editAssemblyTestID}
              >
                Edit
              </Button>
            </Flex>
          ) : group.hasAssembly ? (
            <Button
              className={
                breakMedium ? classes.buttonStyle : classes.smallButtonStyle
              }
              color="gray"
              onClick={() => handleEditAssemblyClick(group)}
              data-testid={editAssemblyTestID}
            >
              Edit
            </Button>
          ) : (
            <Button
              className={
                breakMedium ? classes.buttonStyle : classes.smallButtonStyle
              }
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
