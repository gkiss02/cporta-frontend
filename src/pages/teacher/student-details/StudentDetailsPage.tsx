import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Flex, Heading, Text, Button, Card } from "@radix-ui/themes";
import { ChevronLeft } from "lucide-react";
import api from "../../../api/axiosClient";
import ApiTable from "../../../components/api-table/ApiTable";

interface SubmissionEntry {
  _id: string;
  taskId: string;
  status: string;
  submittedAt: string;
  grade: number | null;
  taskTitle: string;
  courseName: string;
  student: {
    name: string;
    neptun: string;
    email: string;
  };
}

const StudentSubmissionsPage = () => {
  const { courseId, studentId } = useParams<{
    courseId: string;
    studentId: string;
  }>();
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get(
          `/submission/course/${courseId}/student/${studentId}`
        );
        setSubmissions(response.data);
      } catch (e) {
        console.error("Failed to fetch student submissions:", e);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && studentId) fetchSubmissions();
  }, [courseId, studentId]);

  const studentInfo = submissions[0]?.student;

  return (
    <Flex p="6" direction="column" gap="6" width="100%">
      <Flex align="center" gap="4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        >
          <ChevronLeft size={24} />
        </Button>
        <Box>
          <Heading size="6">Hallgatói eredmények</Heading>
          {studentInfo && (
            <Flex gap="3" mt="1">
              <Text size="2" style={{ color: "var(--text-secondary)" }}>
                {studentInfo.name} ({studentInfo.neptun})
              </Text>
              <Text size="2" style={{ color: "var(--accent-9)" }}>
                {submissions[0]?.courseName}
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>
      <Box mt="4">
        <ApiTable
          columns={["Feladat", "Állapot", "Beadás ideje", "Pontszám"]}
          data={submissions.map((s) => ({
            ...s,
            submittedAt: s.submittedAt
              ? new Date(s.submittedAt).toLocaleString("hu-HU")
              : "Nincs beadva",
            grade: s.grade !== null ? `${s.grade} pont` : "Nincs értékelve",
            _id: `/teacher/courses/${courseId}/task/${s.taskId}/editor/${s._id}`,
          }))}
          mapping={["taskTitle", "status", "submittedAt", "grade"]}
        />

        {!loading && submissions.length === 0 && (
          <Card size="2" style={{ textAlign: "center", marginTop: "2rem" }}>
            <Text color="gray">
              Ehhez a hallgatóhoz nem tartoznak beadott feladatok ebben a
              kurzusban.
            </Text>
          </Card>
        )}
      </Box>
    </Flex>
  );
};

export default StudentSubmissionsPage;
