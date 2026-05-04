import { Outlet } from "react-router";
import { Box, Flex, Heading } from "@radix-ui/themes";
import Sidebar from "./Sidebar/Sidebar";
import { Code } from "lucide-react";

const RootLayout = () => {
  return (
    <Flex direction={"column"} style={{ width: "100vw", height: "100vh" }}>
      <Box
        style={{
          backgroundColor: "var(--color-surface)",
          width: "100vw",
          height: "4rem",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: ".25rem",
          color: "var(--accent-9)",
          padding: ".75rem",
        }}
      >
        <Code />
        <Heading size={"5"}>cporta</Heading>
      </Box>
      <Flex style={{ flexGrow: 1, overflow: "hidden" }}>
        <Sidebar />
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default RootLayout;
