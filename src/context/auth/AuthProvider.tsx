import { useState } from "react";
import type { User } from "../../types/types";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>();

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
