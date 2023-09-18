import { useContext, useEffect, useState } from "react";
import { Loader, Text, Button, Box, Flex, Stack } from "@mantine/core";
import { useStyles } from "../styles/groupStyles";
import { getUserData } from "../services/organizer";
import { UserDataResponseType } from "../types/user";
import { useNavigate } from "react-router-dom";
import { checkedInState, checkedInType } from "../utils/Context";

export function Groups() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { setCheckedIn } = useContext(checkedInState) as checkedInType;

  const [userData, setUserData] = useState<UserDataResponseType | undefined>(
    undefined
  );
  const fetchData = async () => {
    try {
      const userData = await getUserData();
      userData.groups.sort((group) => {
        if (group.hasActiveAssembly) {
          return -1;
        } else {
          return 1;
        }
      });
      setUserData(userData);
    } catch (error) {
      navigate("/login");
    }
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
  const checkinNavigate = (groupSlug: string) => {
    setCheckedIn(false);
    navigate("/lobby/" + groupSlug);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return !userData ? (
    <Loader data-testid="LoaderIcon" />
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
          <Text className={classes.name} data-testid="username-greeting-text">
            Hello {userData.firstName}!
          </Text>

          {userData.isOrganizer && (
            <Button
              onClick={() => navigate("/admin")}
              className={classes.button}
              data-testid="organizer-button"
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
            data-testid={"group-" + group.groupSlug}
            {...(!group.hasActiveAssembly
              ? {
                  opacity: 0.5,
                  className: classes.box,
                }
              : {
                  onClick: () => checkinNavigate(group.groupSlug),
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
