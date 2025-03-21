import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Text,
  Title,
  Card,
  Divider,
  CopyButton,
  Flex,
  Loader,
  Box,
} from "@mantine/core";
import { fetchAssemblyLogs } from "../services/log";
import { LogType } from "../types/log";
import { Clipboard, Container } from "tabler-icons-react";

export function AssemblyLogModal(state: { groupSlug: string }) {
  const [openAddOrganizerModal, setOpenAddOrganizerModal] = useState(false);
  const [logs, setLogs] = useState<LogType[]>();

  const fetchLogs = async () => {
    const logs = await fetchAssemblyLogs(state.groupSlug);
    setLogs(logs);
  };

  return (
    <Button
      onClick={() => {
        setOpenAddOrganizerModal(true);
        fetchLogs();
      }}
      m={10}
    >
      <Modal
        opened={openAddOrganizerModal}
        onClose={() => setOpenAddOrganizerModal(false)}
        size="lg"
        centered
        transitionProps={{ duration: 200, exitDuration: 200 }}
        styles={{
          root: {
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
        {!logs ? (
          <Loader />
        ) : (
          <>
            <Flex
              direction="row"
              align="center"
              justify="space-between"
              gap={10}
            >
              <Title mb={10}>Check-in/out logs</Title>
              <CopyButton
                value={logs
                  .map(
                    (log) =>
                      log.user.first_name +
                      " " +
                      log.user.last_name +
                      " - " +
                      log.action +
                      " at " +
                      new Date(log.createdAt).toLocaleTimeString()
                  )
                  .join("\n")}
              >
                {({ copied, copy }) => (
                  <Button
                    mb={10}
                    color={copied ? "teal" : "blue"}
                    onClick={copy}
                    leftSection={<Clipboard />}
                  >
                    Copy logs
                  </Button>
                )}
              </CopyButton>
            </Flex>
            <Card
              shadow="xs"
              radius="md"
              mah={400}
              mih={200}
              color="dark"
              style={{ overflowY: "scroll" }}
            >
              {logs.map((log) => (
                <Box key={log._id}>
                  <Text p={10}>
                    {log.user.first_name} {log.user.last_name} - {log.action} at{" "}
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </Text>
                  <Divider />
                </Box>
              ))}
            </Card>
          </>
        )}
      </Modal>
      Logs
    </Button>
  );
}
