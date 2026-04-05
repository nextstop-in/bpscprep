import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";
import * as authService from "../lib/authService";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<{ message: string; user: string }>;
  confirmSignup: (email: string, code: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("bpsc_user");
    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedUser && storedAccessToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccessToken);
    }
    setIsLoading(false);
  }, []);

  const getErrorMessage = (error: any): string => {
    if (error?.message === "Network Error") {
      return "Network error: Please check your connection or backend server availability. CORS might be misconfigured.";
    }
    if (error?.code === "ERR_NETWORK") {
      return "Cannot reach the server. Ensure the backend API is running and CORS is properly configured.";
    }
    if (error?.response?.status === 400) {
      return error?.response?.data?.message || "Invalid input. Please check your email and password.";
    }
    if (error?.response?.status === 401) {
      return "Invalid credentials. Please try again.";
    }
    if (error?.response?.status === 409) {
      return "Email already exists. Please try logging in instead.";
    }
    return error?.response?.data?.message || error?.message || "An error occurred. Please try again.";
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      
      // Store tokens
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("idToken", response.data.idToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      
      // Create user object from email
      const userData = {
        id: email, // Use email as unique ID
        name: email.split("@")[0],
        email,
      };
      
      setUser(userData);
      setAccessToken(response.data.accessToken);
      localStorage.setItem("bpsc_user", JSON.stringify(userData));
    } catch (error: any) {
      const message = getErrorMessage(error);
      console.error("Login failed:", error);
      const customError = new Error(message);
      (customError as any).originalError = error;
      throw customError;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await authService.sendSignupOTP(email, password);
      // OTP has been sent, return the response for the caller to handle
      return response.data;
    } catch (error: any) {
      const message = getErrorMessage(error);
      console.error("Signup failed:", error);
      const customError = new Error(message);
      (customError as any).originalError = error;
      throw customError;
    }
  };

  const confirmSignup = async (email: string, code: string) => {
    try {
      await authService.confirmOTP(email, code);
      // After confirming OTP, create mock user (actual login will happen separately)
      const userData = {
        id: email,
        name: email.split("@")[0],
        email,
      };
      setUser(userData);
      localStorage.setItem("bpsc_user", JSON.stringify(userData));
    } catch (error: any) {
      const message = getErrorMessage(error);
      console.error("OTP confirmation failed:", error);
      const customError = new Error(message);
      (customError as any).originalError = error;
      throw customError;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("bpsc_user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, confirmSignup, logout, isLoading, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}