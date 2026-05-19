import "./midnight-mono-theme.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RootLayout from "./components/RootLayout";
import { Theme } from "@radix-ui/themes";
import TeacherCoursesPage from "./pages/teacher/courses/TeacherCoursesPage";
import TeacherTasksPage from "./pages/teacher/tasks/TeacherTasksPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserType } from "./types/types";
import { AuthProvider } from "./context/auth/AuthProvider";
import StudentDashboardPage from "./pages/student/student-dashboard/StudentDashboardPage";
import StudentCoursesPage from "./pages/student/student-courses/StudentCoursesPage";
import CourseDetails from "./pages/teacher/course-details/TeacherCourseDetails";
import StudentTaskDetails from "./pages/student/student-task-details/StudentTaskDetails";
import EditorPage from "./pages/shared/EditorPage";
import StudentSubmissionsPage from "./pages/teacher/student-details/StudentDetailsPage";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <LoginPage type="student" /> },
    { path: "/teacher/login", element: <LoginPage type="teacher" /> },
    {
      element: <ProtectedRoute allowedRoles={[UserType.TEACHER]} />,
      children: [
        {
          path: "/teacher",
          element: <RootLayout />,
          children: [
            { index: true, element: <TeacherCoursesPage /> },
            { path: ":courseId/task/new", element: <TeacherTasksPage /> },
            { path: ":courseId/task/:taskId", element: <TeacherTasksPage /> },
            {
              path: "courses",
              children: [
                {
                  path: ":courseId/student/:studentId",
                  element: <StudentSubmissionsPage />,
                },
                {
                  path: ":courseId/task/:taskId/editor/:submissionId",
                  element: <EditorPage />,
                },
                { index: true, element: <TeacherCoursesPage /> },
                { path: ":courseId", element: <CourseDetails /> },
              ],
            },
          ],
        },
      ],
    },
    {
      element: <ProtectedRoute allowedRoles={[UserType.STUDENT]} />,
      children: [
        {
          path: "/student",
          element: <RootLayout />,
          children: [
            { index: true, element: <StudentDashboardPage /> },
            { path: "dashboard", element: <StudentDashboardPage /> },
            { path: "courses", element: <StudentCoursesPage /> },
            {
              path: ":courseId/task/:taskId",
              children: [
                { index: true, element: <StudentTaskDetails /> },
                { path: "editor", element: <EditorPage /> },
              ],
            },
          ],
        },
      ],
    },
  ]);
  return (
    <AuthProvider>
      <Theme
        appearance="dark"
        accentColor="indigo"
        grayColor="gray"
        panelBackground="translucent"
        radius="small"
      >
        <RouterProvider router={router} />
      </Theme>
    </AuthProvider>
  );
};

export default App;
