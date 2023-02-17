import { useEffect, useState } from "react";
import { Loader, SimpleGrid, Container, Text, Button, Group, Box, Center, Flex, Grid, Stack } from "@mantine/core";
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
    setUserData(await getUserData());
  };
  const click = () => {
    console.log("cliked");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return !userData ? (
    <Loader></Loader>
  ) : (
    <>
      <Container className={classes.greetingBox}>
        <SimpleGrid
          className={classes.innerBox}
          spacing={"md"}
          verticalSpacing={"xl"}
          cols={3}
          breakpoints={[{ maxWidth: 768, cols: 1, spacing: "sm" }]}
        >
          <div></div>

          <p className={classes.name}>Hello {userData.firstName}!</p>

          {userData.isOrganizer && (
            <Button
              onClick={() => navigate("/admin")}
              className={classes.button}
            >
              Organizer
            </Button>
          )}
        </SimpleGrid>
        <p className={classes.title}>Your groups</p>
        <p className={classes.subtitle}>
          Overview of your groups and active annual general assemblies
        </p>
      </Container>

      <Flex justify={"center"} wrap="wrap" gap="3rem" style={{marginLeft: "10rem", marginRight: "10rem"}}>
        {userData.groups.map((group) => (
          <Box
            key={group.groupName}
            {...(!group.hasActiveAssembly
              ? {
                  opacity: 0.5,
                  className: classes.inActiveBox,
                }
              : { onClick: click, className: classes.activeBox })}
          >
            {group.groupName.toUpperCase()}
            <Text style={{ justifySelf: "right" }} fz={"xs"}>
              {group.role}
            </Text>
          </Box>
        ))}
        </Flex>
    </>
  );
}
