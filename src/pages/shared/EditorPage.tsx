import { Box, Flex, Button, Heading, Text, Spinner } from "@radix-ui/themes";
import Editor from "@monaco-editor/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useBlocker } from "react-router-dom";
import { Play, Save, ChevronLeft, Terminal } from "lucide-react";
import api from "../../api/axiosClient";
import type { Task } from "../../types/types";
import { io, type Socket } from "socket.io-client";
import UnsavedChangesDialog from "../../components/ussaved-changes-dialog.tsx/UnsavedChangesDialog";

const EditorPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task>();

  const [code, setCode] = useState<string>();
  const [initialCode, setInitialCode] = useState<string>();

  const [isSaving, setIsSaving] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>();
  const [containerId, setContainerId] = useState<string>();
  const [output, setOutput] = useState<string>("");
  const [socketId, setSocketId] = useState<string>();
  const socketRef = useRef<Socket | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  const hasUnsavedChanges =
    code !== undefined && initialCode !== undefined && code !== initialCode;

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  const notifyServerOnLeave = async () => {
    if (!containerId) return;
    try {
      await api.delete(`/submission/${containerId}`);
    } catch (err) {
      console.error("Failed to call leave endpoint:", err);
    }
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output]);

  useEffect(() => {
    (async function () {
      const { data } = await api.post("/submission", {
        taskId,
        code,
      });

      setContainerId(data.containerId);
      setSubmissionId(data.submissionId);
      setCode(data.code);
      setInitialCode(data.code);
    })();
  }, [taskId]);

  const handleStop = useCallback(() => {
    if (!socketRef.current || !containerId) return;

    socketRef.current.emit("stop", { containerId });
    setOutput((prev) => prev + "\n--- Futtatás megszakítva (Ctrl+C) ---\n");
    setIsCompiling(false);
  }, [isCompiling, containerId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "c") {
        const selection = window.getSelection()?.toString();

        if (!selection) {
          e.preventDefault();
          handleStop();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleStop, isCompiling]);

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

  useEffect(() => {
    socketRef.current = io(
      import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000",
      {
        withCredentials: true,
      }
    );

    const socket = socketRef.current;

    socket.on("connect", () => {
      setSocketId(socket.id);
      setOutput((prev) => prev + "--- Terminál kapcsolat felépítve ---\n");
    });

    socket.on("output", (data: string) => {
      setOutput((prev) => prev + data);
    });

    socket.on("connect_error", (err) => {
      setOutput((prev) => prev + `\nKapcsolódási hiba: ${err.message}\n`);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post(`/submission/${submissionId}`, {
        code,
      });
      setInitialCode(code);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompile = async () => {
    setOutput("");
    if (!socketId) {
      setOutput((prev) => prev + "Hiba: Nincs aktív terminál kapcsolat.\n");
      return;
    }

    setIsCompiling(true);
    setOutput(
      (prev) =>
        prev + "\n--- Kód fordítása és futtatása... (Leállítás: Ctrl+C) ---\n"
    );

    try {
      await api.post(`/submission/compile/${submissionId}`, {
        containerId,
        code,
        socketId,
      });

      setIsCompiling(false);
    } catch (err) {
      console.error("Compile failed:", err);
      setOutput((prev) => prev + "Hiba történt a fordítás során.\n");
      setIsCompiling(false);
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
            onClick={async () => {
              if (hasUnsavedChanges) {
                navigate(-1);
              } else {
                await notifyServerOnLeave();
                navigate(-1);
              }
            }}
            style={{ cursor: "pointer", border: "1px solid transparent" }}
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
          <Button
            variant="soft"
            color="gray"
            onClick={handleCompile}
            disabled={isSaving || isCompiling}
            style={{
              cursor: "pointer",
              border: "1px solid var(--border-color)",
            }}
          >
            {isCompiling ? <Spinner /> : <Play size={16} />} Futtatás
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isCompiling || !hasUnsavedChanges}
            style={{
              cursor:
                isSaving || isCompiling || !hasUnsavedChanges
                  ? "default"
                  : "pointer",
              border: "1px solid var(--border-color)",
              backgroundColor: hasUnsavedChanges
                ? "var(--accent-9)"
                : "var(--gray-a3)",
              color: hasUnsavedChanges
                ? "var(--color-background)"
                : "var(--text-secondary)",
            }}
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
          minHeight: "200px",
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
      <Box
        style={{
          height: "250px",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-small)",
          backgroundColor: "#121212",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Flex
          align="center"
          gap="2"
          style={{
            backgroundColor: "#1c1b1b",
            padding: "8px 12px",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <Terminal size={16} color="var(--accent-9)" />
          <Text size="2" weight="bold" style={{ color: "var(--text-main)" }}>
            Terminál
          </Text>
        </Flex>
        <Box
          style={{
            flexGrow: 1,
            padding: "12px",
            overflowY: "auto",
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: "var(--code-font-family)",
              color: "#4ae176",
              fontSize: "13px",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {output}
          </pre>
          <div ref={terminalEndRef} />
        </Box>
      </Box>

      <UnsavedChangesDialog
        open={blocker.state === "blocked"}
        onCancel={() => blocker.reset?.()}
        onConfirm={async () => {
          await notifyServerOnLeave();
          blocker.proceed?.();
        }}
      />
    </Flex>
  );
};

export default EditorPage;
