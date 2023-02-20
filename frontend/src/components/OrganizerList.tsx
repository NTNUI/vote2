import { SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../services/organizer";
import Arrow from "../assets/Arrow.svg";
import { useMediaQuery } from "@mantine/hooks";
import { UserDataGroupType } from "../types/user";
import { OrganizerGroupBox } from "./OrganizerGroupBox";

export function OrganizerList() {
  const [organizerGroups, setOrganizerGroups] = useState<UserDataGroupType[]>(
    []
  );
  let navigate = useNavigate();
  const matches = useMediaQuery("(min-width: 600px)");

  function handleQRClick() {
    navigate("/QR");
  }

  function handleBreadcrumbClick() {
    navigate("/start");
  }

  function handleCreateAssemblyClick() {
    navigate("/assembly");
  }

  async function fetchGroups() {
    try {
      const groups = (await getUserData()).groups;
      setOrganizerGroups(
        groups.filter((group) => {
          return group.role == "organizer";
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: 600, cols: 1, spacing: "sm" }]}
        style={{ marginTop: "10vh" }}
        {...(!matches && { style: { width: "100vw" } })}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <p
            style={{ display: "inline", cursor: "pointer" }}
            onClick={handleBreadcrumbClick}
          >
            GROUPS{" "}
          </p>
          <img src={Arrow}></img>
          <p style={{ display: "inline", fontWeight: "bold" }}>ORGANIZER</p>
        </div>
        <h2
          style={{ display: "flex", alignItems: "center" }}
          data-testid="organizer-list-page-title"
          {...(!matches && { style: { textAlign: "center" } })}
        >
          Manage group assemblies
        </h2>
        <div></div>
      </SimpleGrid>
      {organizerGroups.map((group, index) => (
        <OrganizerGroupBox key={index} {...{ group, index: index }} />
      ))}
    </>
  );
}
