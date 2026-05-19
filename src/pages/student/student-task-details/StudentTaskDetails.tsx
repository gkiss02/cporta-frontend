import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Task } from "../../../types/types";
import api from "../../../api/axiosClient";
import { StickyNote, Calendar } from "lucide-react";

const StudentTaskDetails = () => {
  const [task, setTask] = useState<Task>();
  const { taskId } = useParams<{
    taskId: string;
  }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!taskId) return;

    (async function () {
      try {
        const response = await api.get(`/task/${taskId}`);
        setTask(response.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [taskId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Nincs határidő";
    return new Date(dateString).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Flex p={"6"} width={"100%"} direction={"column"} gap={"6"}>
      <Flex width={"100%"} justify={"between"}>
        <Box>
          <Heading size={"6"}>{task?.title}</Heading>
          <Text
            size={"1"}
            mt={"3"}
            style={{
              color: "#4ade80",
              border: "1px solid #1b4d2e",
              padding: ".25rem .75rem",
              textTransform: "uppercase",
              fontFamily: "monospace",
              display: "inline-block",
              backgroundColor: "rgba(27, 77, 46, 0.1)",
            }}
          >
            {task?.courseName}
          </Text>
        </Box>
        <Button
          style={{
            textTransform: "uppercase",
            backgroundColor: "#4ade80",
            color: "#064e3b",
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => navigate("editor")}
        >
          Feladat elkészítése
        </Button>
      </Flex>
      <Card
        size="3"
        style={{
          border: "1px solid var(--gray-a6)",
          borderLeft: "4px solid var(--accent-9)",
          backgroundColor: "var(--color-surface)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          padding: "1.5rem",
          width: "25rem",
        }}
      >
        <Flex
          style={{ color: "var(--accent-9)", fontSize: "1.1rem" }}
          gap={"1"}
        >
          <StickyNote />
          Specifikáció
        </Flex>
        <Text style={{ fontSize: ".9rem" }}>{task?.description}</Text>
        <Flex
          gap="2"
          align="center"
          mt="2"
          style={{
            borderTop: "1px solid var(--gray-a4)",
            paddingTop: "1rem",
            color: "var(--gray-11)",
            fontSize: "0.85rem",
          }}
        >
          <Calendar size={16} />
          <Text weight="medium">Határidő:</Text>
          <Text>{formatDate(task?.deadline.toString())}</Text>
        </Flex>
      </Card>
    </Flex>
  );
};

export default StudentTaskDetails;
