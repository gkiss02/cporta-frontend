import { Box, Button, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import api from "../../../api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";

const TeacherTasksPage = () => {
  const [title, setTitle] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { courseId, taskId } = useParams<{
    courseId: string;
    taskId: string;
  }>();

  useEffect(() => {
    if (!taskId) return;

    (async function () {
      try {
        const response = await api.get(`/task/${taskId}`);
        setTitle(response.data.title || "");
        setDescription(response.data.description || "");

        if (response.data.deadline) {
          const dateObj = new Date(response.data.deadline);
          const offset = dateObj.getTimezoneOffset() * 60000;
          const localISOTime = new Date(dateObj.getTime() - offset)
            .toISOString()
            .slice(0, 16);
          setDeadline(localISOTime);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [taskId]);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const response = await api.post(`/task`, {
        title,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        description,
        courseId,
      });

      if (response.data && response.data._id) {
        navigate(`/teacher/${courseId}/task/${response.data._id}`);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={"6"} width={"100%"}>
      <Flex justify={"between"}>
        <Heading size={"6"}>Feladat létrehozása</Heading>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          style={{
            textTransform: "uppercase",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--border-color)",
            padding: "1rem",
            color: "var(--accent-9)",
          }}
        >
          <Save />
          Mentés
        </Button>
      </Flex>

      <Box mt="4">
        <Text>Cím</Text>
        <TextField.Root
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ border: "1px solid var(--border-color)" }}
        />
      </Box>

      <Box mt="4">
        <Text>Határidő</Text>
        <TextField.Root
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ border: "1px solid var(--border-color)" }}
        />
      </Box>

      <Box mt="4">
        <Text>Leírás</Text>
        <TextField.Root
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ border: "1px solid var(--border-color)" }}
        />
      </Box>
    </Box>
  );
};

export default TeacherTasksPage;
