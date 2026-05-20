import { Box, Flex, Button, Heading, Text, Spinner } from "@radix-ui/themes";
import Editor from "@monaco-editor/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useBlocker } from "react-router-dom";
import {
  Play,
  Save,
  ChevronLeft,
  Terminal,
  CheckCircle2,
  Award,
} from "lucide-react";
import api from "../../api/axiosClient";
import { UserType, type Task } from "../../types/types";
import { io, type Socket } from "socket.io-client";
import UnsavedChangesDialog from "../../components/ussaved-changes-dialog.tsx/UnsavedChangesDialog";
import { GradeSubmissionDialog } from "../../components/grade-submission-dialog/GradeSubmissionDialog";
import { useAuth } from "../../context/auth/AuthContext";

const EditorPage = () => {
  const { taskId, submissionId: urlSubmissionId } = useParams<{
    taskId: string;
    submissionId: string;
  }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task>();

  const [code, setCode] = useState<string>();
  const [initialCode, setInitialCode] = useState<string>();

  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  const [submissionId, setSubmissionId] = useState<string>();
  const [containerId, setContainerId] = useState<string>();
  const [output, setOutput] = useState<string>("");
  const [socketId, setSocketId] = useState<string>();
  const socketRef = useRef<Socket | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const { user } = useAuth();

  const isStudent = user?.type === UserType.STUDENT;

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
      try {
        let data;

        if (urlSubmissionId && user?.type !== UserType.STUDENT) {
          const response = await api.get(
            `/submission/teacher-view/${taskId}/${urlSubmissionId}`
          );
          data = response.data;
        } else {
          const response = await api.post("/submission", { taskId, code });
          data = response.data;
        }

        setContainerId(data.containerId);
        setSubmissionId(data.submissionId);
        setCode(data.code);
        setInitialCode(data.code);
      } catch (e) {
        console.error("Failed to initialize workspace:", e);
      }
    })();
  }, [taskId, urlSubmissionId, user?.type]);

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

  const handleFinalize = async () => {
    setIsFinalizing(true);
    try {
      if (hasUnsavedChanges) {
        await api.post(`/submission/${submissionId}`, { code });
      }
      await api.post(`/submission/finalize/${submissionId}`);
      setInitialCode(code); // Reset guard state before leaving
      navigate(-1);
    } catch (err) {
      console.error("Finalization failed:", err);
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleGrade = async (point: number) => {
    try {
      await api.post(`/submission/grade/${submissionId}`, { point });
      setIsGradeModalOpen(false);
      navigate(-1);
    } catch (err) {
      console.error("Grading failed:", err);
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
      const endpoint = isStudent
        ? `/submission/student/compile/${submissionId}`
        : `/submission/teacher/compile/${submissionId}`;

      await api.post(endpoint, {
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
            <Flex gap="3" align="center">
              <Heading size="4">{task?.title || "Betöltés..."}</Heading>
              {!isStudent && (
                <Text
                  size="1"
                  style={{
                    backgroundColor: "rgba(173, 198, 255, 0.1)",
                    color: "var(--accent-9)",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                  }}
                >
                  READ-ONLY NÉZET
                </Text>
              )}
            </Flex>
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
            disabled={isSaving || isCompiling || isFinalizing}
            style={{
              cursor: "pointer",
              border: "1px solid var(--border-color)",
            }}
          >
            {isCompiling ? <Spinner /> : <Play size={16} />} Futtatás
          </Button>

          {isStudent ? (
            <>
              <Button
                onClick={handleSave}
                disabled={
                  isSaving || isCompiling || !hasUnsavedChanges || isFinalizing
                }
                style={{
                  cursor:
                    isSaving ||
                    isCompiling ||
                    !hasUnsavedChanges ||
                    isFinalizing
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

              <Button
                onClick={handleFinalize}
                disabled={isSaving || isCompiling || isFinalizing}
                style={{
                  cursor:
                    isSaving || isCompiling || isFinalizing
                      ? "default"
                      : "pointer",
                  border: "1px solid transparent",
                  backgroundColor: "var(--rt-color-success)",
                  color: "var(--color-background)",
                  fontWeight: "bold",
                }}
              >
                {isFinalizing ? <Spinner /> : <CheckCircle2 size={16} />}
                Véglegesítés
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsGradeModalOpen(true)}
              style={{
                cursor: "pointer",
                border: "1px solid transparent",
                backgroundColor: "var(--accent-9)",
                color: "var(--color-background)",
                fontWeight: "bold",
              }}
            >
              <Award size={16} />
              Pontozás
            </Button>
          )}
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
            readOnly: !isStudent,
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

      <GradeSubmissionDialog
        open={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        onConfirm={handleGrade}
      />
    </Flex>
  );
};

export default EditorPage;
