import { Image, Loader, SimpleGrid, Text, Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../services/organizer";
import Arrow from "../assets/Arrow.svg";
import { useMediaQuery } from "@mantine/hooks";
import { UserDataGroupType } from "../types/user";
import { OrganizerGroupBox } from "./OrganizerGroupBox";

export function OrganizerList() {
  const [organizerGroups, setOrganizerGroups] = useState<UserDataGroupType[]>();
  let navigate = useNavigate();
  const matches = useMediaQuery("(min-width: 600px)");

  function handleQRClick() {
    navigate("/QR");
  }

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
        }}
      >
        <Text fz={"sm"} fw={500} onClick={() => handleBreadcrumbClick()}>
          GROUPS
        </Text>
        <Image src={Arrow}></Image>
        <Text fz={"sm"} fw={700}>
          ORGANIZER
        </Text>
      </Box>
      <Text
        fz={"xl"}
        fw={500}
        sx={() => ({
          justifyContent: "center",
          display: "flex",
          justifySelf: "center",
        })}
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
function then(arg0: () => void) {
  throw new Error("Function not implemented.");
}
