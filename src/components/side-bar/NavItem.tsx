import { Box, Flex, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  path: string;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  active = false,
  path,
}) => {
  const navigate = useNavigate();

  return (
    <Flex
      onClick={() => navigate(path)}
      align="center"
      gap="3"
      style={{
        padding: ".5rem .75rem",
        cursor: "pointer",
        backgroundColor: active ? "var(--nav-item-bg-active)" : "transparent",
        borderLeft: active
          ? "2px solid var(--accent-9)"
          : "2px solid transparent",
        color: active ? "var(--text-main)" : "var(--text-secondary)",
        transition: "all 0.2s ease",
      }}
    >
      <Box style={{ color: active ? "var(--accent-9)" : "inherit" }}>
        {icon}
      </Box>
      <Text size="2" weight={active ? "bold" : "regular"}>
        {label}
      </Text>
    </Flex>
  );
};

export default NavItem;
