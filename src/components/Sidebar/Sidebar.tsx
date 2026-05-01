import { Card, Flex } from "@radix-ui/themes";
import NavItem from "./NavItem";
import { ClipboardCheck, GraduationCap } from "lucide-react";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <Flex height={"100vh"} style={{ width: "18rem" }}>
      <Card
        variant="ghost"
        style={{ backgroundColor: "var(--color-surface)", width: "18rem" }}
      >
        <NavItem
          label="Oktatott kurzusok"
          icon={<GraduationCap />}
          active={location.pathname.includes("courses")}
          path="courses"
        />
        <NavItem
          label="Újonnan beadott feladatok"
          icon={<ClipboardCheck />}
          active={location.pathname.includes("tasks")}
          path="tasks"
        />
      </Card>
    </Flex>
  );
};

export default Sidebar;
