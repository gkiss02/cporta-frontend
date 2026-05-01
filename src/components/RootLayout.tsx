import { Outlet } from "react-router";
import { Flex } from "@radix-ui/themes";
import Sidebar from "./Sidebar/Sidebar";

const RootLayout = () => {
  return (
    <Flex>
      <Sidebar />
      <Outlet />
    </Flex>
  );
};

export default RootLayout;
