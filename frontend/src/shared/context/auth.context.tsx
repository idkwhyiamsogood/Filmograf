"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { authApi } from "../lib";
import type { JWT } from "../types";
import { toast } from "sonner";

interface AuthContextType {
  token: JWT;
  isTemporaryLogged: boolean;
  temporaryToken: () => Promise<JWT | undefined>;
  verifyToken: (idempotence: string) => Promise<void>;
  loginWithNativeGoogle: () => Promise<void>;
  logout: () => void;
  callAuthError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<JWT>({ jwt: "" });
  const [isTemporaryLogged, setIsTemporaryLogged] = useState<boolean>(true);
  const isRefreshingRef = useRef(false);

  const callAuthError = useCallback(() => {
    toast.error("При авторизации произошла ошибка, попробуйте позже");
  }, []);

  const temporaryToken = useCallback(async () => {
    try {
      const res = await authApi.createTemporaryToken();
      setToken(res.data);
      setIsTemporaryLogged(true);
      return res.data;
    } catch (e) {
      console.error("Temporary token error:", e);
      callAuthError();
      return undefined;
    }
  }, [callAuthError]);

  const loginWithNativeGoogle = useCallback(async () => {
    try {
      const googleUser = await GoogleAuth.signIn();
      const idToken = googleUser?.authentication?.idToken;

      console.log(idToken);

      if (!idToken) {
        throw new Error("No ID Token received from Google");
      }

      const response = await authApi.googleNative(idToken);
      const jwt = response.data.jwt;

      authApi.setAccessToken(jwt);
      setToken({ jwt });
      setIsTemporaryLogged(false);
    } catch (e) {
      console.error("Native Google Login Error:", JSON.stringify(e));
      callAuthError();
      throw e;
    }
  }, [callAuthError]);

  const verifyToken = useCallback(
    async (idempotence: string) => {
      try {
        const res = await authApi.verifyIdempotence(idempotence);
        setToken(res.data);
        setIsTemporaryLogged(false);
      } catch (e) {
        console.error("Verify token error:", e);
        callAuthError();
        throw e;
      }
    },
    [callAuthError],
  );

  const logout = useCallback(() => {
    authApi.logout();
    setToken({ jwt: "" });
    setIsTemporaryLogged(false);
  }, []);

  useEffect(() => {
    if (!token.jwt) {
      const storedToken = authApi.getAccessToken();
      if (storedToken) {
        setToken({ jwt: storedToken });
        setIsTemporaryLogged(false);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (isRefreshingRef.current) return;

      try {
        if (token.jwt && isMounted) {
          authApi.setAccessToken(token.jwt);
        }

        if (!token.jwt && isMounted) return;

        const { status } = await authApi.getAuthStatus();

        if (status === 403 && isMounted && !isRefreshingRef.current) {
          isRefreshingRef.current = true;
          try {
            const res = await authApi.refreshToken();
            if (isMounted) {
              setToken(res.data);
              setIsTemporaryLogged(false);
            }
          } catch (refreshError) {
            console.error("Refresh token error:", refreshError);
            if (isMounted) {
              logout();
              callAuthError();
            }
          } finally {
            isRefreshingRef.current = false;
          }
        }
      } catch (error: any) {
        console.error("Auth check error:", error);
        if (isMounted && error.status === 401) {
          logout();
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [token.jwt, logout, callAuthError]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isTemporaryLogged,
        verifyToken,
        temporaryToken,
        loginWithNativeGoogle,
        logout,
        callAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}