import { useState, useEffect } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Itt olvasnád ki a JWT tokent a localStorage-ből betöltéskor
    const token = localStorage.getItem("token");
    if (token) {
      // Mockoljuk, hogy a tokenből kiolvastuk, hogy ő egy tanár
      setUser({ id: "1", role: "teacher" });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    // JWT dekódolás helyett most beégetünk egy tanár usert a példa kedvéért
    setUser({ id: "1", role: "teacher" });
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
