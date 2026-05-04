import { Card, Flex } from "@radix-ui/themes";
import NavItem from "./NavItem";
import {
  ClipboardCheck,
  FileCheck,
  Files,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { UserType } from "../../types/types";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <Flex height={"100vh"} style={{ width: "18rem" }}>
      <Card
        variant="ghost"
        style={{ backgroundColor: "var(--color-surface)", width: "18rem" }}
      >
        {user?.type === UserType.TEACHER && (
          <>
            <NavItem
              label="Oktatott kurzusok"
              icon={<GraduationCap />}
              active={location.pathname.includes("/teacher/courses")}
              path="courses"
            />
            <NavItem
              label="Újonnan beadott feladatok"
              icon={<ClipboardCheck />}
              active={location.pathname.includes("/teacher/tasks")}
              path="tasks"
            />
          </>
        )}
        {user?.type === UserType.STUDENT && (
          <>
            <NavItem
              label="Dashboard"
              icon={<LayoutDashboard />}
              active={location.pathname.includes("/student/dashboard")}
              path="dashboard"
            />
            <NavItem
              label="Kurzusok"
              icon={<Files />}
              active={location.pathname.includes("/student/courses")}
              path="courses"
            />
            <NavItem
              label="Feladatok"
              icon={<FileCheck />}
              active={location.pathname.includes("/student/tasks")}
              path="tasks"
            />
          </>
        )}
      </Card>
    </Flex>
  );
};

export default Sidebar;
