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
import StudentTasksPage from "./pages/student/student-tasks/StudentTasksPage";
import StudentCoursesPage from "./pages/student/student-courses/StudentCoursesPage";
import CourseDetails from "./pages/teacher/course-details/TeacherCourseDetails";

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
            { path: "tasks", element: <StudentTasksPage /> },
            { path: "dashboard", element: <StudentDashboardPage /> },
            { path: "courses", element: <StudentCoursesPage /> },
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
