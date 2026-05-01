import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { User, Lock, LogIn } from "lucide-react";

const LoginPage = () => {
  return (
    <Flex align="center" justify="center" mt={"9"}>
      <Box width="25rem">
        <Box mb="5">
          <Flex direction="column" align="center">
            <Heading style={{ color: "var(--accent-9)" }} size="8">
              CPORTA
            </Heading>
            <Text style={{ color: "var(--text-secondary)" }}>
              Tanár bejelentkezés
            </Text>
          </Flex>
        </Box>
        <Card size="3">
          <Flex direction="column" gap="3">
            <Box>
              <Flex justify={"between"}>
                <Text
                  style={{
                    color: "var(--accent-9)",
                    textTransform: "uppercase",
                  }}
                  size="2"
                  weight="bold"
                >
                  Felhasználó név
                </Text>
                <User size={16} color="var(--accent-9)" />
              </Flex>
              <TextField.Root />
            </Box>
            <Box>
              <Flex justify={"between"}>
                <Text
                  style={{
                    color: "var(--accent-9)",
                    textTransform: "uppercase",
                  }}
                  size={"2"}
                  weight="bold"
                >
                  Jelszó
                </Text>
                <Lock size={16} color="var(--accent-9)" />
              </Flex>
              <TextField.Root type="password" />
            </Box>
            <Button style={{ textTransform: "uppercase" }} mt="3">
              <Text weight="bold" style={{ color: "var(--color-background)" }}>
                Bejelentkezés
              </Text>
              <LogIn size={16} color="var(--color-background)" />
            </Button>
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
};

export default LoginPage;
