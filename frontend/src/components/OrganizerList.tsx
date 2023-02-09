import { Box } from "@mantine/core";
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
      <h4>
        ACHTUNG!! The useState/useEffect run twice, resulting in duplicate
        groups.{" "}
      </h4>
      <p>
        This is because of React.StrictMode. Disabling it will fix the problem.
        This error is only supposed to affect dev builds, not prod.
      </p>
      {organizedGroups.map((group, index) => (
        <Box
          key={index}
          onClick={() => console.log(organizedGroups)}
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
            textAlign: "center",
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            cursor: "pointer",
            color: "black",

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            },
          })}
        >
          <p>Group: {group.groupName}</p>
          <p>Role: {group.role}</p>
          <p>Active: {group.hasActiveAssembly.toString()}</p>
        </Box>
      ))}

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
