import { Image, Loader, Text, Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../services/organizer";
import Arrow from "../assets/Arrow.svg";
import { UserDataGroupType } from "../types/user";
import { OrganizerGroupBox } from "./OrganizerGroupBox";

export function OrganizerList() {
  const [organizerGroups, setOrganizerGroups] = useState<UserDataGroupType[]>();
  let navigate = useNavigate();

  function handleBreadcrumbClick() {
    navigate("/start");
  }

  async function fetchGroups() {
    try {
      const groups = (await getUserData()).groups;
      setOrganizerGroups(
        groups.filter((group) => {
          return group.organizer == true;
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  return !organizerGroups ? (
    <Loader />
  ) : (
    <>
      <Box
        style={{
          position: "absolute",
          top: 70,
          left: 30,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Text fz={"sm"} fw={500} onClick={() => handleBreadcrumbClick()}>
          GROUPS
        </Text>
        <Image width={15} m={10} src={Arrow}></Image>
        <Text fz={"sm"} fw={600}>
          ORGANIZER
        </Text>
      </Box>
      <Text
        fz="xl"
        fw={500}
        styles={{
          root: {
            justifyContent: "center",
            display: "flex",
            justifySelf: "center",
          },
        }}
        data-testid="organizer-list-page-title"
      >
        Manage group assemblies
      </Text>

      {organizerGroups.map((group, index) => (
        <OrganizerGroupBox key={index} {...{ group, index: index }} />
      ))}
    </>
  );
}
