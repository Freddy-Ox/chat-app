import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("token")
  );
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");

    if (isAuthenticated) {
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [isAuthenticated]);

  function login(username: string, token: string) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("username", username);
    setIsAuthenticated(true);
    setUsername(username);
  }

  function logout() {
    setIsAuthenticated(false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
