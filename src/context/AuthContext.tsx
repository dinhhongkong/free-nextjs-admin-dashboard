"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { User } from "@/model/Auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User ;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>({
    id: 0,
    username: "",
    role: "",
    iat: 0,
    exp: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // const token = localStorage.getItem("authToken");
      const token = Cookies.get("authToken");
      if (token) {
        const decodedToken: User = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          setIsAuthenticated(false);
          Cookies.remove("authToken");
          return;
        }
        setUser(decodedToken);
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  const login = async (token: string) => {
    // localStorage.setItem("authToken", token);
    Cookies.set("authToken", token);
    const decodedToken: User = jwtDecode(token);
    setUser(decodedToken);
    setIsAuthenticated(true);
    router.push("/");
  };

  const logout = async () => {
    // localStorage.removeItem("authToken");
    Cookies.remove("authToken");
    setIsAuthenticated(false);
    router.push("/auth/signin");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
