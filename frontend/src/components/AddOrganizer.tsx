import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { ExtraOrganizerType } from "../types/assembly";
import {
  Button,
  Modal,
  Text,
  Flex,
  Box,
  Select,
  Group,
  Divider,
} from "@mantine/core";
import {
  addExternalOrganizerToAssembly,
  getExternalAssemblyOrganizers,
  removeExternalOrganizerFromAssembly,
  searchForGroupMember,
} from "../services/organizer";
import { UserSearchType } from "../types/user";

export function AddOrganizerButtonModal(state: { groupSlug: string }) {
  const [openAddOrganizerModal, setOpenAddOrganizerModal] = useState(false);
  const [extraOrganizers, setExtraOrganizers] = useState<ExtraOrganizerType[]>(
    []
  );
  const [searchResult, setSearchResult] = useState<UserSearchType>([]);
  const [userSearch, setUserSearch] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue(userSearch, 200);

  useEffect(() => {
    const searchGroupMember = async (search: string) => {
      const result = await searchForGroupMember(state.groupSlug, search);
      setSearchResult(result);
    };

    if (debouncedSearch !== "") {
      searchGroupMember(debouncedSearch);
    }
  }, [debouncedSearch]);

  const fetchOrganizers = async () => {
    const organizers = await getExternalAssemblyOrganizers(state.groupSlug);
    setExtraOrganizers(organizers);
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  return (
    <Button onClick={() => setOpenAddOrganizerModal(true)} m={10}>
      <Modal
        opened={openAddOrganizerModal}
        onClose={() => setOpenAddOrganizerModal(false)}
        size="lg"
        centered
        transition="fade"
        transitionDuration={200}
        exitTransitionDuration={200}
        // Styling is done like this to overwrite Mantine styling, therefore global color variables is not used.
        styles={{
          modal: {
            backgroundColor: "#1b202c",
            color: "white",
            border: ".5px solid",
            borderRadius: 5,
            borderBottomRightRadius: 0,
            borderColor: "#f8f082",
          },
          title: {
            margin: "0 auto",
          },
        }}
      >
        <Text mb={5} fw={600} ta={"center"}>
          Add organizer
        </Text>
        <Text ta={"center"}>The user must to be a member of the group.</Text>

        <Flex direction="row" align="center" justify="center">
          <Box
            m={20}
            sx={(theme) => ({
              border: `1px solid ${theme.colors.gray[3]}`,
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
              minWidth: 300,
            })}
          >
            {extraOrganizers.length < 1 ? (
              <Text align="center">No extra organizers</Text>
            ) : (
              <Text mb={20} align="center">
                Extra organizers:
              </Text>
            )}
            {extraOrganizers.map((organizer, index) => (
              <Box key={organizer.ntnui_no}>
                <Group position="center" noWrap grow={true}>
                  <Text sx={{ flex: 1 }}>{organizer.name}</Text>
                  <Button
                    maw={100}
                    onClick={() => {
                      removeExternalOrganizerFromAssembly(
                        state.groupSlug,
                        organizer.ntnui_no
                      ).then(() => fetchOrganizers());
                    }}
                    data-testid="remove-organizer-button"
                  >
                    Remove
                  </Button>
                </Group>
                {index < extraOrganizers.length - 1 && (
                  <Divider mt={5} mb={5} />
                )}
              </Box>
            ))}
          </Box>
        </Flex>

        <Select
          label="Search for group member"
          placeholder="Type to search"
          searchable
          clearable
          data={
            searchResult.map((member) => ({
              value: member.ntnui_no.toString(),
              label: `${member.first_name} ${member.last_name}`,
            })) || []
          }
          onSearchChange={(value) => {
            setUserSearch(value);
          }}
          onChange={(value) => {
            if (!value) return;
            const selectedMember = searchResult.find(
              (member) => member.ntnui_no.toString() === value
            );

            if (selectedMember) {
              addExternalOrganizerToAssembly(
                state.groupSlug,
                selectedMember.ntnui_no,
                `${selectedMember.first_name} ${selectedMember.last_name}`
              ).then(fetchOrganizers);
            }
          }}
        />
      </Modal>
      Add organizer
    </Button>
  );
}
