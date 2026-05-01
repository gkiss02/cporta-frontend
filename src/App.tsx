import "./midnight-mono-theme.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RootLayout from "./components/RootLayout";
import { Theme } from "@radix-ui/themes";
import TeacherCoursesPage from "./pages/teacher/courses/TeacherCoursesPage";
import TeacherTasksPage from "./pages/teacher/teacher-tasks-page/TeacherTasksPage";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/teacher",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <TeacherCoursesPage />,
        },
        { path: "tasks", element: <TeacherTasksPage /> },
        { path: "courses", element: <TeacherCoursesPage /> },
      ],
    },
  ]);
  return (
    <Theme
      appearance="dark"
      accentColor="indigo"
      grayColor="gray"
      panelBackground="translucent"
      radius="small"
    >
      <RouterProvider router={router} />
    </Theme>
  );
};

export default App;
