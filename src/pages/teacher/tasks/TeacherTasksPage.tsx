import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  Card,
  Select,
  Switch,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import api from "../../../api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import { Save, TerminalSquare, Cpu, ShieldCheck, Timer } from "lucide-react";
import type { ContainerConfig } from "../../../types/types";

const TeacherTasksPage = () => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  const [containerConfig, setContainerConfig] = useState<ContainerConfig>({
    compiler: "gcc",
    cppStandard: "c++17",
    compileFlags: "-Wall -Wextra -O2",
    ramLimit: 256,
    storageLimit: 50,
    cpuQuota: 100,
    pidLimit: 64,
    networkIsolation: true,
    readonlyRootfs: true,
    runTimeoutMs: 2000,
    compileTimeoutSec: 10,
  });

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
        const res = await api.get(`/task/${taskId}`);
        const t = res.data;
        setTitle(t.title || "");
        setDescription(t.description || "");
        if (t.containerConfig) {
          setContainerConfig(t.containerConfig);
        }

        if (t.deadline) {
          const dateObj = new Date(t.deadline);
          const offset = dateObj.getTimezoneOffset() * 60000;
          setDeadline(
            new Date(dateObj.getTime() - offset).toISOString().slice(0, 16)
          );
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [taskId]);

  const updateConfig = (key: keyof ContainerConfig, value: any) => {
    setContainerConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        title,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        description,
        courseId,
        containerConfig,
      };

      const response = taskId
        ? await api.put(`/task/${taskId}`, payload)
        : await api.post(`/task`, payload);

      if (response.data?._id) {
        navigate(`/teacher/${courseId}/task/${response.data._id}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      p="6"
      width="100%"
      style={{
        flexGrow: 1,
        overflowY: "auto",
        height: "100%",
        border: "1px solid var(--border-color)", // Opcionális, ha a többi oldalon is van
      }}
    >
      <Box style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Flex justify="between" mb="5">
          <Heading size="6">
            {taskId ? "Feladat szerkesztése" : "Feladat létrehozása"}
          </Heading>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            style={{
              textTransform: "uppercase",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--border-color)",
              cursor: "pointer",
              color: "var(--accent-9)",
            }}
          >
            <Save size={16} /> Mentés
          </Button>
        </Flex>

        <Flex direction="column" gap="4" mb="6">
          <Box>
            <Text
              mb="1"
              size="2"
              weight="bold"
              style={{ color: "var(--text-secondary)" }}
            >
              Cím
            </Text>
            <TextField.Root
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--color-surface)",
              }}
            />
          </Box>
          <Box>
            <Text
              mb="1"
              size="2"
              weight="bold"
              style={{ color: "var(--text-secondary)" }}
            >
              Határidő
            </Text>
            <TextField.Root
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--color-surface)",
              }}
            />
          </Box>
          <Box>
            <Text
              mb="1"
              size="2"
              weight="bold"
              style={{ color: "var(--text-secondary)" }}
            >
              Leírás
            </Text>
            <TextField.Root
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--color-surface)",
              }}
            />
          </Box>
        </Flex>

        <Flex align="center" gap="2" mb="4">
          <Box
            style={{
              width: "4px",
              height: "1.2rem",
              backgroundColor: "var(--rt-color-success)",
            }}
          />
          <Text
            size="2"
            weight="bold"
            style={{ textTransform: "uppercase", letterSpacing: "1px" }}
          >
            Sandbox Konfiguráció
          </Text>
        </Flex>

        <Flex direction="column" gap="4" mb="6">
          {/* 1. BUILD & ENVIRONMENT */}
          <Card
            size="2"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            <Flex
              align="center"
              gap="2"
              mb="4"
              style={{ color: "var(--text-secondary)" }}
            >
              <TerminalSquare size={16} />{" "}
              <Text size="2" weight="bold">
                1. BUILD & ENVIRONMENT
              </Text>
            </Flex>
            <Flex gap="4" mb="3">
              <Box style={{ flex: 1 }}>
                <Text
                  size="1"
                  mb="1"
                  style={{
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                  }}
                >
                  Compiler
                </Text>
                <Select.Root
                  value={containerConfig.compiler}
                  onValueChange={(val) => updateConfig("compiler", val)}
                >
                  <Select.Trigger
                    style={{
                      width: "100%",
                      backgroundColor: "var(--color-panel-solid)",
                    }}
                  />
                  <Select.Content>
                    <Select.Item value="gcc">gcc</Select.Item>
                    <Select.Item value="clang">clang</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
              <Box style={{ flex: 1 }}>
                <Text
                  size="1"
                  mb="1"
                  style={{
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                  }}
                >
                  C++ Szabvány
                </Text>
                <Select.Root
                  value={containerConfig.cppStandard}
                  onValueChange={(val) => updateConfig("cppStandard", val)}
                >
                  <Select.Trigger
                    style={{
                      width: "100%",
                      backgroundColor: "var(--color-panel-solid)",
                    }}
                  />
                  <Select.Content>
                    <Select.Item value="c++11">c++11</Select.Item>
                    <Select.Item value="c++14">c++14</Select.Item>
                    <Select.Item value="c++17">c++17</Select.Item>
                    <Select.Item value="c++20">c++20</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>
            <Box>
              <Text
                size="1"
                mb="1"
                style={{
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                }}
              >
                Fordítási flagek
              </Text>
              <TextField.Root
                value={containerConfig.compileFlags}
                onChange={(e) => updateConfig("compileFlags", e.target.value)}
                style={{ backgroundColor: "var(--color-panel-solid)" }}
              />
            </Box>
          </Card>

          {/* 2. RESOURCE LIMITS */}
          <Card
            size="2"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            <Flex
              align="center"
              gap="2"
              mb="4"
              style={{ color: "var(--text-secondary)" }}
            >
              <Cpu size={16} />{" "}
              <Text size="2" weight="bold">
                2. RESOURCE LIMITS
              </Text>
            </Flex>
            <Flex gap="4" mb="3">
              <Box style={{ flex: 1 }}>
                <Text
                  size="1"
                  mb="1"
                  style={{
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                  }}
                >
                  RAM Limit (MB)
                </Text>
                <TextField.Root
                  type="number"
                  value={containerConfig.ramLimit}
                  onChange={(e) =>
                    updateConfig("ramLimit", Number(e.target.value))
                  }
                  style={{ backgroundColor: "var(--color-panel-solid)" }}
                />
              </Box>
              <Box style={{ flex: 1 }}>
                <Text
                  size="1"
                  mb="1"
                  style={{
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                  }}
                >
                  Tárhely (MB)
                </Text>
                <TextField.Root
                  type="number"
                  value={containerConfig.storageLimit}
                  onChange={(e) =>
                    updateConfig("storageLimit", Number(e.target.value))
                  }
                  style={{ backgroundColor: "var(--color-panel-solid)" }}
                />
              </Box>
            </Flex>
            <Flex gap="4">
              <Box style={{ flex: 1 }}>
                <Text
                  size="1"
                  mb="1"
                  style={{
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                  }}
                >
                  CPU Quota (%)
                </Text>
                <TextField.Root
                  type="number"
                  value={containerConfig.cpuQuota}
                  onChange={(e) =>
                    updateConfig("cpuQuota", Number(e.target.value))
                  }
                  style={{ backgroundColor: "var(--color-panel-solid)" }}
                />
              </Box>
              <Box style={{ flex: 1 }}>
                <Text
                  size="1"
                  mb="1"
                  style={{
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                  }}
                >
                  PID Limit
                </Text>
                <TextField.Root
                  type="number"
                  value={containerConfig.pidLimit}
                  onChange={(e) =>
                    updateConfig("pidLimit", Number(e.target.value))
                  }
                  style={{ backgroundColor: "var(--color-panel-solid)" }}
                />
              </Box>
            </Flex>
          </Card>

          {/* 3. BIZTONSÁG */}
          <Card
            size="2"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            <Flex
              align="center"
              gap="2"
              mb="4"
              style={{ color: "var(--text-secondary)" }}
            >
              <ShieldCheck size={16} />{" "}
              <Text size="2" weight="bold">
                3. BIZTONSÁG
              </Text>
            </Flex>
            <Flex align="center" gap="3" mb="3">
              <Switch
                checked={containerConfig.networkIsolation}
                onCheckedChange={(checked) =>
                  updateConfig("networkIsolation", checked)
                }
              />
              <Text size="2">Hálózati izoláció (No Internet)</Text>
            </Flex>
            <Flex align="center" gap="3">
              <Switch
                checked={containerConfig.readonlyRootfs}
                onCheckedChange={(checked) =>
                  updateConfig("readonlyRootfs", checked)
                }
              />
              <Text size="2">Read-only File System (kivéve /tmp)</Text>
            </Flex>
          </Card>
          <Card
            size="2"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            <Flex
              align="center"
              gap="2"
              mb="4"
              style={{ color: "var(--text-secondary)" }}
            >
              <Timer size={16} />{" "}
              <Text size="2" weight="bold">
                4. TIMEOUTS
              </Text>
            </Flex>
            <Flex gap="4">
              <Box style={{ flex: 1 }}>
                <Text
                  size="1"
                  mb="1"
                  style={{
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                  }}
                >
                  Futási időkorlát (ms)
                </Text>
                <TextField.Root
                  type="number"
                  value={containerConfig.runTimeoutMs}
                  onChange={(e) =>
                    updateConfig("runTimeoutMs", Number(e.target.value))
                  }
                  style={{ backgroundColor: "var(--color-panel-solid)" }}
                />
              </Box>
              <Box style={{ flex: 1 }}>
                <Text
                  size="1"
                  mb="1"
                  style={{
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                  }}
                >
                  Fordítási időkorlát (s)
                </Text>
                <TextField.Root
                  type="number"
                  value={containerConfig.compileTimeoutSec}
                  onChange={(e) =>
                    updateConfig("compileTimeoutSec", Number(e.target.value))
                  }
                  style={{ backgroundColor: "var(--color-panel-solid)" }}
                />
              </Box>
            </Flex>
          </Card>
        </Flex>
      </Box>
    </Box>
  );
};

export default TeacherTasksPage;
