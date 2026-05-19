import { Box, Flex, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import api from "../../../api/axiosClient";

import ActiveTaskCard from "../../../components/active-task-card/ActiveTaskCard";
import type { Task } from "../../../types/types";

const StudentDashboardPage = () => {
  const [activeTasks, setActiveTask] = useState<Task[]>();

  useEffect(() => {
    (async function () {
      try {
        const response = await api.get("/task/active");
        console.log(response.data);
        setActiveTask(response.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <Box
      p="6"
      style={{
        flexGrow: 1,
        overflowY: "auto",
        height: "100%",
        border: "1px solid var(--border-color)",
      }}
    >
      <Heading size="6" mb="6">
        Aktív feladatok
      </Heading>
      <Flex direction="column" gap="4">
        {activeTasks?.map((activeTask) => (
          <ActiveTaskCard key={activeTask._id} task={activeTask} />
        ))}
      </Flex>
    </Box>
  );
};

export default StudentDashboardPage;
