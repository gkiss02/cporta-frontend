import { Box, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import api from "../../../api/axiosClient";
import type { Task } from "../../../types/types";
import ActiveTaskCard from "../../../components/active-task-card/ActiveTaskCard";

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
    <Box p={"6"}>
      <Heading size={"6"} mb={"6"}>
        Aktív feladatok
      </Heading>
      {activeTasks?.map((activeTask) => (
        <ActiveTaskCard task={activeTask} />
      ))}
    </Box>
  );
};

export default StudentDashboardPage;
