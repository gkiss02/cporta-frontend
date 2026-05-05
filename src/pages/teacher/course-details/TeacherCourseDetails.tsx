import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Student, Task } from "../../../types/types";
import api from "../../../api/axiosClient";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Text,
} from "@radix-ui/themes";
import ApiTable from "../../../components/api-table/ApiTable";

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courseDetails, setCourseDetails] = useState<{
    name: string;
    code: string;
  }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) return;

    const fetchStudents = async () => {
      try {
        const response = await api.get(`/course/${courseId}/students`);
        if (response.data && response.data.length > 0) {
          setStudents(response.data[0].studentDetails);
        }
        setCourseDetails({
          name: response.data[0].name,
          code: response.data[0].code,
        });
      } catch (e) {
        console.error(e);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await api.get(`/task/list/${courseId}`);

        setTasks(response.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchTasks();
    fetchStudents();
  }, [courseId]);

  return (
    <Flex p={"6"} direction={"column"} align={"center"} width={"100%"}>
      <Flex
        direction={"column"}
        gap={"4"}
        width={"100%"}
        style={{ maxWidth: "1200px" }}
      >
        <Flex justify={"between"} align={"end"}>
          <Box>
            <Text style={{ color: "var(--accent-9)" }} size={"2"}>
              {courseDetails?.code}
            </Text>
            <Heading size="6">{courseDetails?.name}</Heading>
          </Box>
          <Button
            onClick={() => navigate(`/teacher/${courseId}/task/new`)}
            style={{
              textTransform: "uppercase",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--border-color)",
              padding: "1rem",
              color: "var(--accent-9)",
            }}
          >
            + Új feladat kiírása
          </Button>
        </Flex>
        <Grid columns="1fr 350px" gap="5">
          <ApiTable
            columns={[
              "Vezetéknév",
              "Keresztnév",
              "Neptun",
              "Átlag",
              "Utolsó aktivitás",
            ]}
            data={students}
            mapping={[
              "lastName",
              "firstName",
              "neptunCode",
              "averageGrade",
              "lastLoginAt",
            ]}
          />
          <Box
            style={{
              backgroundColor: "rgba(255,255,255,0.02)",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Heading
              size="3"
              mb="4"
              style={{ textTransform: "uppercase", letterSpacing: "1px" }}
            >
              Kiírt feladatok
            </Heading>
            <Flex direction="column" gap="3">
              {tasks.map((task) => {
                const isExpired = new Date(task.deadline) < new Date();
                return (
                  <Card
                    key={task._id}
                    variant="surface"
                    style={{ padding: "1rem" }}
                  >
                    <Flex justify="between" align="start" mb="2">
                      <Text
                        size="3"
                        weight="bold"
                        style={{ maxWidth: "10rem" }}
                      >
                        {task.title}
                      </Text>
                      <Badge
                        color={isExpired ? "gray" : "green"}
                        variant="soft"
                      >
                        {isExpired ? "LEZÁRULT" : "AKTÍV"}
                      </Badge>
                    </Flex>
                    <Text size="1">
                      Határidő:{" "}
                      {new Date(task.deadline).toLocaleDateString("hu-HU")}
                    </Text>
                  </Card>
                );
              })}
              {tasks.length === 0 && (
                <Text size="2">Nincs még kiírt feladat.</Text>
              )}
            </Flex>
          </Box>
        </Grid>
      </Flex>
    </Flex>
  );
};

export default CourseDetails;
