import React, { useEffect, useState } from "react";
import {
  Loader,
  SimpleGrid,
  Container,
  Text,
  Button,
  Grid,
  Space,
} from "@mantine/core";
import { useStyles } from "../styles/groupStyles";
import { getGroups } from "../services/organizer";
import { UserDataResponseType } from "../types/user";
import { useNavigate } from "react-router-dom";

export function Groups() {
  const { classes } = useStyles();
  const navigate = useNavigate();

  let [userData, setUserData] = useState<UserDataResponseType | undefined>(
    undefined
  );
  const fetchData = async () => {
    setUserData(await getGroups());
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
    <Space h="xl" />
      <Container className={classes.greetingBox}>
        <SimpleGrid
          className={classes.innerBox}
          spacing={"md"}
          verticalSpacing={"xl"}
          cols={3}
          breakpoints={[{ maxWidth: 768, cols: 1, spacing: "sm" }]}
        >
          <div></div>
          
          <p className={classes.name}>Hello {userData.data.firstName}!</p>

          {userData.data.isOrganizer && (
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
      <SimpleGrid
        className={classes.grid}
        spacing={"lg"}
        verticalSpacing={"xl"}
        cols={3}
        breakpoints={[
          { maxWidth: 1030, cols: 2, spacing: "md" },
          { maxWidth: 768, cols: 2, spacing: "sm" },
          { maxWidth: 640, cols: 1, spacing: "sm" },
        ]}
      >
        {userData.data.groups.map((group) => (
          <Container
            key={group.groupName}
            {...(!group.hasActiveAssembly
              ? {
                  opacity: 0.5,
                  className: classes.inActiveBox,
                }
              : { onClick: click, className: classes.activeBox })}
          >
            {group.groupName.toUpperCase()}
            <Text fz={"xs"}>{group.role}</Text>
          </Container>
        ))}
      </SimpleGrid>
    </>
  );
}
