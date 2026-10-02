import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { Capacitor } from "@capacitor/core";
import { authApi, USE_MOCKS } from "../lib";
import type { JWT } from "../types";
import { toast } from "sonner";
import { UNAUTHORIZED_EVENT } from "../lib/http/interceptors/response/rejected";

type SessionKind = "guest" | "member";

const SESSION_KIND_KEY = "session_kind";

const readKind = (): SessionKind => {
  try {
    return localStorage.getItem(SESSION_KIND_KEY) === "member" ? "member" : "guest";
  } catch {
    return "guest";
  }
};

const writeKind = (kind: SessionKind) => {
  try {
    localStorage.setItem(SESSION_KIND_KEY, kind);
  } catch {
    // ignore
  }
};

interface AuthContextType {
  token: JWT;
  /** Токен получен (гостевой или пользовательский) — можно ходить в API */
  isReady: boolean;
  /** Гость: смотреть можно, оценивать/комментировать/собирать подборки — нет */
  isGuest: boolean;
  /** @deprecated используйте isGuest */
  isTemporaryLogged: boolean;
  temporaryToken: () => Promise<JWT | undefined>;
  verifyToken: (idempotence: string) => Promise<void>;
  loginWithNativeGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  callAuthError: () => void;
  /** Синхронизировать тип сессии с ответом /auth/fetch */
  syncUserType: (userType: "Guest" | "Member") => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

/**
 * Сессия приложения. Бэкенд пускает только с токеном, поэтому при первом
 * запуске молча берём гостевой (/auth/temporary) — пользователь сразу видит
 * контент, а вход через Google предлагаем там, где он действительно нужен.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<JWT>(() => ({
    jwt: authApi.getAccessToken() ?? "",
  }));
  const [kind, setKind] = useState<SessionKind>(readKind);
  const recoveringRef = useRef<Promise<void> | null>(null);

  const applySession = useCallback((jwt: string, nextKind: SessionKind) => {
    authApi.setAccessToken(jwt);
    writeKind(nextKind);
    setToken({ jwt });
    setKind(nextKind);
  }, []);

  const callAuthError = useCallback(() => {
    toast.error("Не удалось войти. Попробуйте ещё раз чуть позже.");
  }, []);

  const temporaryToken = useCallback(async () => {
    try {
      const res = await authApi.createTemporaryToken();
      applySession(res.data.jwt, "guest");
      return res.data;
    } catch (e) {
      console.error("Temporary token error:", e);
      return undefined;
    }
  }, [applySession]);

  const loginWithNativeGoogle = useCallback(async () => {
    try {
      // В мок-режиме Google не дёргаем: мок-бэкенд примет любой idToken.
      const idToken = USE_MOCKS
        ? "mock-google-id-token"
        : (await GoogleAuth.signIn())?.authentication?.idToken;

      if (!idToken) {
        throw new Error("No ID Token received from Google");
      }

      const response = await authApi.googleNative(idToken);
      applySession(response.data.jwt, "member");
      toast.success("Вы вошли в аккаунт");
    } catch (e) {
      console.error("Native Google Login Error:", JSON.stringify(e));
      callAuthError();
      throw e;
    }
  }, [applySession, callAuthError]);

  const verifyToken = useCallback(
    async (idempotence: string) => {
      try {
        const res = await authApi.verifyIdempotence(idempotence);
        applySession(res.data.jwt, "member");
      } catch (e) {
        console.error("Verify token error:", e);
        callAuthError();
        throw e;
      }
    },
    [applySession, callAuthError],
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    // После выхода остаёмся в приложении гостем, а не на пустом экране.
    await temporaryToken();
  }, [temporaryToken]);

  const syncUserType = useCallback((userType: "Guest" | "Member") => {
    const next: SessionKind = userType === "Member" ? "member" : "guest";
    writeKind(next);
    setKind(next);
  }, []);

  // Первый запуск — гостевой токен. Google-плагин инициализируем сразу,
  // чтобы вход был мгновенным, где бы пользователь его ни нажал.
  useEffect(() => {
    if (!token.jwt) temporaryToken();

    if (Capacitor.isNativePlatform() && !USE_MOCKS) {
      try {
        GoogleAuth.initialize({
          clientId:
            "341334726956-oo7rlsn0743ot821mdqoaj5e6uk442vr.apps.googleusercontent.com",
          scopes: ["profile", "email"],
          grantOfflineAccess: true,
        });
      } catch (e) {
        console.error("GoogleAuth init error:", e);
      }
    }
  }, []);

  // Токен протух: пробуем обновить, не вышло — продолжаем гостем.
  useEffect(() => {
    const recover = () => {
      if (recoveringRef.current) return;

      recoveringRef.current = (async () => {
        try {
          if (kind === "member") {
            const res = await authApi.refreshToken();
            applySession(res.data.jwt, "member");
            return;
          }
        } catch {
          toast("Сессия истекла — войдите снова, чтобы сохранять оценки");
        }
        authApi.clearAccessToken();
        await temporaryToken();
      })().finally(() => {
        recoveringRef.current = null;
      });
    };

    window.addEventListener(UNAUTHORIZED_EVENT, recover);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, recover);
  }, [kind, applySession, temporaryToken]);

  const isGuest = kind === "guest";

  return (
    <AuthContext.Provider
      value={{
        token,
        isReady: Boolean(token.jwt),
        isGuest,
        isTemporaryLogged: isGuest,
        verifyToken,
        temporaryToken,
        loginWithNativeGoogle,
        logout,
        callAuthError,
        syncUserType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
