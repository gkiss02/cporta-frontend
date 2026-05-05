import { Card, Flex, Box, Text, Button } from "@radix-ui/themes";
import { Code, Clock, ArrowRight } from "lucide-react";
import type { Task } from "../../types/types";

interface ActiveTaskCardProps {
  task: Task;
}

const ActiveTaskCard: React.FC<ActiveTaskCardProps> = ({ task }) => {
  let formattedDate = "Nincs határidő";
  if (task.deadline) {
    const d = new Date(task.deadline);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    formattedDate = `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  }

  return (
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
      <Flex gap="4" align="center">
        <Box
          style={{
            backgroundColor: "var(--gray-a3)",
            padding: "0.75rem",
            borderRadius: "var(--radius-3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Code size={24} color="var(--accent-11)" />
        </Box>
        <Text size="5" weight="bold">
          {task.title}
        </Text>
      </Flex>
      <Flex
        gap="2"
        align="center"
        style={{
          backgroundColor: "var(--gray-a2)",
          padding: "0.75rem 1rem",
          borderRadius: "var(--radius-3)",
          border: "1px solid var(--gray-a4)",
        }}
      >
        <Clock size={16} color="var(--gray-11)" />
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Határidő: {formattedDate}
        </Text>
      </Flex>
      <Flex justify="end">
        <Button
          style={{
            backgroundColor: "var(--gray-a2)",
            cursor: "pointer",
            border: "1px solid var(--gray-a6)",
            color: "var(--text-main)",
          }}
        >
          Megnyitás <ArrowRight size={16} />
        </Button>
      </Flex>
    </Card>
  );
};

export default ActiveTaskCard;
