import { useEffect, useState } from "react";
import { Loader, Text, Button, Box, Flex, Stack } from "@mantine/core";
import { useStyles } from "../styles/groupStyles";
import { getUserData } from "../services/organizer";
import { UserDataResponseType } from "../types/user";
import { useNavigate } from "react-router-dom";

export function Groups() {
  const { classes } = useStyles();
  const navigate = useNavigate();

  let [userData, setUserData] = useState<UserDataResponseType | undefined>(
    undefined
  );
  const fetchData = async () => {
    const userData = await getUserData();
    userData.groups.sort((group) => {
      if (group.hasActiveAssembly) {
        return -1;
      } else {
        return 1;
      }
    });
    setUserData(userData);
  };
  const click = (groupName: string, groupSlug: string) => {
    navigate("/qr", { state: { groupName: groupName, groupSlug: groupSlug } });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return !userData ? (
    <Loader />
  ) : (
    <>
      <Stack m={10} mt={100}>
        <Flex
          wrap={"wrap"}
          align={"center"}
          justify={"center"}
          columnGap={100}
          rowGap={20}
        >
          <Text className={classes.name}>Hello {userData.firstName}!</Text>

          {userData.isOrganizer && (
            <Button
              onClick={() => navigate("/admin")}
              className={classes.button}
            >
              Organizer
            </Button>
          )}
        </Flex>
        <Text mt={10} mb={10} size={"xl"}>
          Participate in assemblies for your groups:
        </Text>
      </Stack>

      <Flex
        justify={"center"}
        wrap="wrap"
        rowGap={"2rem"}
        columnGap={"2rem"}
        m={10}
      >
        {userData.groups.map((group) => (
          <Box
            key={group.groupSlug}
            {...(!group.hasActiveAssembly
              ? {
                  opacity: 0.5,
                  className: classes.box,
                }
              : {
                  onClick: () => click(group.groupName, group.groupSlug),
                  className: classes.activeBox,
                })}
          >
            {group.groupName.toUpperCase()}
            <Text style={{ justifySelf: "right" }} fz={"xs"}>
              {group.organizer ? "Organizer" : "Member"}
            </Text>
          </Box>
        ))}
      </Flex>
    </>
  );
}
