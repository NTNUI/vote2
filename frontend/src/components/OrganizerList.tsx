import { Box, Button, Flex } from "@mantine/core";
import { throws } from "assert";
import { useEffect, useState } from "react";
import { getGroups } from "../services/organizer";

interface GroupData {
  groupName: string;
  role: string;
  hasActiveAssembly: boolean;
}

export function OrganizerList() {
  const [organizedGroups, setOrganizedGroups] = useState<GroupData[]>([]);

  function handleClick() {
    console.log("Next page");
  }

  function createGroupBox(group: GroupData, index: number) {
    let groupName = group.groupName;
    groupName = groupName.charAt(0).toUpperCase() + groupName.slice(1);
    if (group.hasActiveAssembly) {
      return (
        <Box
          key={index}
          onClick={handleClick}
          sx={(theme) => ({
            /* backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0], */
            borderStyle: "solid",
            borderColor: "white",
            textAlign: "center",
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            cursor: "pointer",
            color: "white",

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            },
          })}
        >
          {/*         <p>Group: {groupName}</p>
        <p>Role: {group.role}</p>
        <p>Active: {group.hasActiveAssembly.toString()}</p> */}
          <Flex
            mih={50}
            gap="md"
            justify="space-between"
            align="flex-start"
            direction="row"
            wrap="wrap"
          >
            <h4>{groupName}</h4>
            <div>
              <Button color="green" radius="md">
                Start checkin
              </Button>
              <Button color="gray" radius="md">
                Edit
              </Button>
            </div>
          </Flex>
        </Box>
      );
    } else {
      return (
        <Box
          key={index}
          onClick={handleClick}
          sx={(theme) => ({
            /* backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0], */
            borderStyle: "solid",
            borderColor: "white",
            textAlign: "center",
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            cursor: "pointer",
            color: "white",

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            },
          })}
        >
          {/*         <p>Group: {groupName}</p>
        <p>Role: {group.role}</p>
        <p>Active: {group.hasActiveAssembly.toString()}</p> */}
          <Flex
            mih={50}
            gap="md"
            justify="space-between"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <h4>{groupName}</h4>
            <Button>Create assembly</Button>
          </Flex>
        </Box>
      );
    }
  }

  async function sortGroups() {
    try {
      const groupsRequest = await getGroups();
      const groups = groupsRequest.data.groups;
      for (let i = 0; i < groups.length; i++) {
        let group: GroupData = groups[i];
        // Enabled member-role to also get included to the list. Only used for testing atm :)
        if (group.role == "organizer" || group.role == "member") {
          setOrganizedGroups((organizedGroups) => [...organizedGroups, group]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    sortGroups();
    console.log("en gang");
  }, []);

  return (
    <>
      <h2>Manage group assemblies</h2>
      <h4>
        ACHTUNG!! The useEffect runs twice, resulting in duplicate groups.
      </h4>
      <p>
        This is because of React.StrictMode. Disabling it will fix the problem.
        This error is only supposed to affect dev builds, not prod.
      </p>
      {organizedGroups.map((group, index) => createGroupBox(group, index))}

      {/* <Box
      onClick={() => console.log(organizedGroups)}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        textAlign: 'center',
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        cursor: 'pointer',

        '&:hover': {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        },
      })}
    >
      Box lets you add inline styles with sx prop
    </Box> */}
    </>
  );
}
