import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Text,
  Title,
  Card,
  Divider,
  CopyButton,
} from "@mantine/core";
import { fetchAssemblyLogs } from "../services/log";
import { LogType } from "../types/log";
import { Clipboard } from "tabler-icons-react";

export function AssemblyLogModal(state: { groupSlug: string }) {
  const [openAddOrganizerModal, setOpenAddOrganizerModal] = useState(false);
  const [logs, setLogs] = useState<LogType[]>([]);

  const fetchLogs = async () => {
    const logs = await fetchAssemblyLogs(state.groupSlug);
    setLogs(logs);
  };

  useEffect(() => {
    fetchLogs();
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
              leftIcon={<Clipboard />}
            >
              Copy logs
            </Button>
          )}
        </CopyButton>
        <Card
          shadow="xs"
          radius="md"
          mah={400}
          mih={200}
          color="dark"
          sx={{ overflowY: "scroll" }}
        >
          {logs.map((log) => (
            <>
              <Text p={10} key={log._id}>
                {log.user.first_name} {log.user.last_name} - {log.action} at{" "}
                {new Date(log.createdAt).toLocaleTimeString()}
              </Text>
              <Divider />
            </>
          ))}
        </Card>
      </Modal>
      Logs
    </Button>
  );
}
