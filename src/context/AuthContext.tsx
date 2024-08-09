"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/api/apiClient";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [infoUser, setInfoUser] = useState({
    username: "",
    role: "",
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // Giả sử validate-token trả về true nếu token hợp lệ
          const data = await apiClient.get(
            "/auth/admin/validate-token/" + token,
          );
          console.log(data);
          if (data === "OK") {
            setIsAuthenticated(true);
            router.push("/");
          } else {
            setIsAuthenticated(false);
            router.push("/auth/signin");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          setIsAuthenticated(false);
          router.push("/auth/signin");
        }
      } else {
        setIsAuthenticated(false);
        router.push("/auth/signin");
      }
    };

    checkAuth();
  }, []);

  // const checkAuth = async () => {
  //   const token = localStorage.getItem("authToken");
  //   if (token) {
  //     try {
  //       const data = apiClient.get("/auth/admin/validate-token/" + token);
  //       setIsAuthenticated(true);
  //     } catch (error) {
  //       console.error("Auth check failed:", error);
  //       setIsAuthenticated(false);
  //     }
  //   } else {
  //     setIsAuthenticated(false);
  //     router.push("/auth/signin");
  //   }
  // };

  const login = async (token: string) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    router.push("/");
  };

  const logout = async () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    router.push("/auth/signin");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
