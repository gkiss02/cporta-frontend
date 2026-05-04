import "./midnight-mono-theme.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RootLayout from "./components/RootLayout";
import { Theme } from "@radix-ui/themes";
import TeacherCoursesPage from "./pages/teacher/courses/TeacherCoursesPage";
import TeacherTasksPage from "./pages/teacher/teacher-tasks-page/TeacherTasksPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserType } from "./types/types";
import { AuthProvider } from "./context/auth/AuthProvider";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <LoginPage /> },
    {
      element: <ProtectedRoute allowedRoles={[UserType.TEACHER]} />,
      children: [
        {
          path: "/teacher",
          element: <RootLayout />,
          children: [
            { index: true, element: <TeacherCoursesPage /> },
            { path: "tasks", element: <TeacherTasksPage /> },
            { path: "courses", element: <TeacherCoursesPage /> },
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
