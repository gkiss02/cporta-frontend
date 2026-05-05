import { Text, Card, Flex } from "@radix-ui/themes";
import NavItem from "./NavItem";
import {
  ClipboardCheck,
  ClipboardList,
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
    <Flex
      style={{
        width: "18rem",
        height: "100%",
        flexShrink: 0,
      }}
    >
      <Card
        variant="ghost"
        style={{
          backgroundColor: "var(--color-surface)",
          width: "100%",
          height: "100%",
          margin: 0,
          borderRadius: 0,
          border: "none",
          borderRight: "1px solid rgba(229, 226, 225, 0.1)",
          borderTop: "1px solid rgba(229, 226, 225, 0.1)",
        }}
      >
        <Card
          size="2"
          style={{
            backgroundColor: "rgba(229, 226, 225, 0.05)",
          }}
          mb={"5"}
        >
          <Flex gap="3" align="center">
            <Card
              style={{
                width: "3.5rem",
                height: "3.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--color-panel-solid)",
                padding: 0,
              }}
            >
              <Text size="4" weight="bold" style={{ color: "var(--accent-9)" }}>
                {user?.firstName[0]}
                {user?.lastName[0]}
              </Text>
            </Card>
            <Flex direction="column">
              <Text
                size="3"
                weight="bold"
                style={{ color: "var(--text-main)" }}
              >
                {user?.firstName} {user?.lastName}
              </Text>
              <Text
                size="2"
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "var(--code-font-family)",
                }}
              >
                NEPTUN: {user?.neptunCode}
              </Text>
            </Flex>
          </Flex>
        </Card>
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
              icon={<GraduationCap />}
              active={location.pathname.includes("/student/courses")}
              path="courses"
            />
            <NavItem
              label="Feladatok"
              icon={<ClipboardList />}
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
