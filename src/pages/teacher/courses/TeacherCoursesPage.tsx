import { Flex, Heading } from "@radix-ui/themes";
import ApiTable from "../../../components/ApiTable/ApiTable";
import { useEffect, useState } from "react";
import api from "../../../api/axiosClient";
import type { Course } from "../../../types/types";

const TeacherCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    (async function () {
      try {
        const response = await api.get("/course/teacher");
        setCourses(response.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <Flex p={"6"} direction={"column"} align={"center"} width={"100%"}>
      <Flex direction={"column"} gap={"4"} width={"100%"}>
        <Heading size="6">Oktatott kurzusok</Heading>
        <ApiTable
          columns={["Kurzus kód", "Megnevezés", "Hallgatók száma", "Átlagjegy"]}
          data={courses}
          mapping={["code", "name", "studentCount", "averageGrade"]}
        />
      </Flex>
    </Flex>
  );
};

export default TeacherCoursesPage;
