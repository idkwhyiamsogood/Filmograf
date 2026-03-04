"use client";

// types
import type { ReactNode } from "react";

//
import { TokenStorage } from "@/core/Storage";

// fn
import { createContext, useState } from "react";

// hooks
import { useEffect } from "react";

interface AuthContextType {
  token: string | null;
  tokenStorage: TokenStorage;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode}) => {
  const [token, setToken] = useState<string | null>(null);
  const tokenStorage = new TokenStorage("");

  async () => {
    const token = await tokenStorage.getToken();
    setToken(token)
    console.log(token);
  }

  return (
  <AuthContext.Provider value={{ token, tokenStorage }}>
    {children}
  </AuthContext.Provider>
);
};
