import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import api from "../../api/axiosClient";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const response = await api.post("/auth/teacher/login", {
        email,
        password,
      });

      const { accessToken, user } = response.data;

      login(accessToken, user);

      navigate("/teacher/courses");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
                  Felhasználó
                </Text>
                <User size={16} color="var(--accent-9)" />
              </Flex>
              <TextField.Root
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
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
              <TextField.Root
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </Box>
            <Button
              style={{
                textTransform: "uppercase",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              mt="3"
              onClick={handleLogin}
              disabled={isLoading}
            >
              <Text weight="bold" style={{ color: "var(--color-background)" }}>
                {isLoading ? "Bejelentkezés..." : "Bejelentkezés"}
              </Text>
              {!isLoading && (
                <LogIn size={16} color="var(--color-background)" />
              )}
            </Button>
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
};

export default LoginPage;
