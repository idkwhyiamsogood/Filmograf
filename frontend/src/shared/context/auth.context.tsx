"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from "react";
import { authApi } from "../lib";
import type { JWT } from "../types";

import { toast } from "sonner";

interface AuthContextType {
  token: JWT;
  isTemporaryLogged: boolean;

  temporaryToken: () => Promise<JWT>;
  verifyToken: (idempotence: string) => Promise<void>;
  logout: () => void;
  callAuthError: () => string | number;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<JWT>({ jwt: "" });
  const [isTemporaryLogged, setIsTemporaryLogged] = useState<boolean>(true);

  const callAuthError = () =>
    toast.error("При авторbизации произошла ошибка попробуйте позже");

  const temporaryToken = useCallback(async () => {
    try {
      await authApi.createTemporaryToken().then((res) => {
        setToken(res.data);
        setIsTemporaryLogged(true);
      });
    } catch (e) {
      console.log(e);
      callAuthError();
    } finally {
      return token;
    }
  }, []);

  const verifyToken = useCallback(async (idempotence: string) => {
    try {
      await authApi.verifyIdempotence(idempotence).then((res) => {
        setToken(res.data);
      });
    } catch (e) {
      console.log(e);
      callAuthError();
    } finally {
      setIsTemporaryLogged(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
  }, []);

  useEffect(() => {
    if (!token.jwt) {
      const storedToken = authApi.getAccessToken();
      if (storedToken) {
        setToken({ jwt: storedToken });
      }
    }
  }, []);

  useEffect(() => {
    if (token.jwt) authApi.setAccessToken(token.jwt);

    // dev only
    // console.log(token);
    // console.log(isTemporaryLogged);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isTemporaryLogged,
        verifyToken,
        temporaryToken,
        logout,
        callAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
