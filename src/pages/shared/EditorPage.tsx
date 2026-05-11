import { Box, Flex, Button, Heading, Text, Spinner } from "@radix-ui/themes";
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Save, ChevronLeft } from "lucide-react";
import api from "../../api/axiosClient";
import type { Task } from "../../types/types";

const EditorPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task>();
  const [code, setCode] = useState<string>(
    `#include <iostream>\n\nint main() {\n    std::cout << "Hello, CPorta!" << std::endl;\n    return 0;\n}`
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    (async function () {
      try {
        const response = await api.get(`/task/${taskId}`);
        setTask(response.data);
      } catch (e) {
        console.error("Failed to fetch task:", e);
      }
    })();
  }, [taskId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log("saving");
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Flex
      direction="column"
      p="6"
      gap="4"
      style={{ height: "100%", width: "100%", overflow: "hidden" }}
    >
      <Flex justify="between" align="center">
        <Flex align="center" gap="4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          >
            <ChevronLeft size={20} />
          </Button>
          <Box>
            <Heading size="4">{task?.title || "Betöltés..."}</Heading>
            <Text size="1" color="gray">
              {task?.courseName}
            </Text>
          </Box>
        </Flex>

        <Flex gap="3">
          <Button variant="soft" color="gray" style={{ cursor: "pointer" }}>
            <Play size={16} /> Futtatás
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            style={{ cursor: "pointer" }}
          >
            {isSaving ? <Spinner /> : <Save size={16} />}
            Mentés
          </Button>
        </Flex>
      </Flex>

      <Box
        style={{
          flexGrow: 1,
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-small)",
          overflow: "hidden",
          backgroundColor: "#1e1e1e",
        }}
      >
        <Editor
          height="100%"
          defaultLanguage="cpp"
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            automaticLayout: true,
            fontFamily: "var(--code-font-family)",
            cursorSmoothCaretAnimation: "on",
            lineNumbersMinChars: 3,
          }}
        />
      </Box>
    </Flex>
  );
};

export default EditorPage;
