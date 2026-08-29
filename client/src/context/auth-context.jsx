import { createContext } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

  function handleRegister(data) {
    console.log(data);
  }

  function handleLogin(data) {
    console.log(data);
  }

  return (
    <AuthContext.Provider
      value={{
        registerForm,
        loginForm,
        handleLogin,
        handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
