import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { userApi } from "../api/user.api";
import type { IUser } from "../types";

import { useAuth } from "@/shared/hooks";

export interface UserContextType {
  user: IUser | undefined;
  isGuest: boolean;
  isLoading: boolean;
  setCurrentUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const { token, isGuest, syncUserType, logout: endSession } = useAuth();

  const setCurrentUser = useCallback(async () => {
    if (!token.jwt) return;
    try {
      setIsLoading(true);
      const { data } = await userApi.getMe();
      setUser(data);
      syncUserType(data.userType);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [token.jwt, syncUserType]);

  const logout = useCallback(async () => {
    setUser(undefined);
    await endSession();
  }, [endSession]);

  // Пользователь перезапрашивается при каждой смене токена (вход, выход,
  // восстановление сессии).
  useEffect(() => {
    setCurrentUser();
  }, [setCurrentUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        isGuest: user ? user.userType === "Guest" : isGuest,
        isLoading,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
