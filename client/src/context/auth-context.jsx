import { createContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register, login, checkAuth } from "@/services/auth";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(12),
});

const registerSchema = z
  .object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6).max(12),
    confirmPassword: z.string().min(6).max(12),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password Does not match",
    path: ["confirmPassword"],
  });

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyAuth() {
      try {
        const data = await checkAuth();
        setUser(data);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    verifyAuth();
  }, []);

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
  });

  async function handleRegister(data) {
    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password
      });
      // Automatically login or show success message
      const res = await login({ email: data.email, password: data.password });
      sessionStorage.setItem("accessToken", res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Registration failed. Please try again.";
      alert(msg);
    }
  }

  async function handleLogin(data) {
    try {
      const res = await login(data);
      sessionStorage.setItem("accessToken", res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Login failed. Please try again.";
      alert(msg);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/auth");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading,
        registerForm,
        loginForm,
        handleLogin,
        handleRegister,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
